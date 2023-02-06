import { Body, Controller, Get, Post, Put, Query, UnauthorizedException } from "@nestjs/common";
import { CreateNotificationDto } from "./dto/create-notification.dto";
import { NotificationService } from "./notification.service";
import { ZempieUseGuards } from "src/util/decorators/ZempieUseGaurd";
import { UserAuthGuard, UserTokenCheckGuard } from "src/auth/user-auth.guard";
import { CurrentUser } from "src/auth/user-auth-decorator";
import { User } from "src/user/user.entity";
import { BaseQuery } from "src/abstract/base-query";
import { UserService } from "src/user/user.service";
import { ReturnNotificationDto } from "./dto/notification.dto";
import { UserMetaService } from "src/user_meta/user_meta.service";


@Controller("api/v1/notification")
export class NotificationsController {
  constructor(
    private notificationService: NotificationService,
    private userService: UserService,
    private userMetaService: UserMetaService, 
  ){}

  @Post()
  async create( @Body() data:CreateNotificationDto ) {
    return await this.notificationService.create(data)
  }

  @Get()
  @ZempieUseGuards(UserTokenCheckGuard)
  async getList(
    @Query() query: BaseQuery,
    @CurrentUser() user: User
  ) {
    if(!user){
      throw new UnauthorizedException()

    }
    const noti_count = await this.notificationService.countIsRead(user.id)
    const { result, count } = await this.notificationService.findAndCountAll(user, query)

    //use-meta에 데이터 없으면 만들고 있으면 업데이트
    const hasUserMeta = await this.userMetaService.get(user.id)

    if( hasUserMeta ){
      hasUserMeta.notification_check_time = new Date()
      await hasUserMeta.save()
    } else {
      await this.userMetaService.create({user_id:user.id, notification_check_time: new Date() })
    }


    return {
      read_count: noti_count,
      result:await Promise.all(
      result.map(async(elem)=>{
      const user = await this.userService.findOne(elem.user_id)
           
      return new ReturnNotificationDto({
        id:elem.id,
        content:elem.content,
        target_id:elem.target_id,
        is_read:elem.is_read,
        type:elem.type,
        created_at:elem.created_at,
        user:user
      })
    }))
   }
  }

  @Put()
  @ZempieUseGuards(UserTokenCheckGuard)
  async updateReadStatus(
    @Body() data: { id: number },
    @CurrentUser() user: User
  ){
    const where = {
      id:[data.id],
      target_user_id:user.id
    }
    return await this.notificationService.updateReadStatus(true,where)
  }

  @Put('/read-all')
  @ZempieUseGuards(UserTokenCheckGuard)
  async updateAllReadStatus(
    @CurrentUser() user: User
  ){
    const where = {
      target_user_id:user.id
    }

    return await this.notificationService.updateReadStatus(true, where)

  }

}