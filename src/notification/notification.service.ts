import { Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { BaseService } from "src/abstract/base-service";
import { Notification } from "./notification.entity";
import { NotificationDto } from "./dto/notification.dto";
import { User } from "src/user/user.entity";


@Injectable()
export class NotificationService extends BaseService<Notification>{
  constructor(
    @Inject("NotificationRepository")
    private readonly notificationRepository : typeof Notification
  ){
    super(notificationRepository)
  }


  async create(data:NotificationDto) {
   return this.notificationRepository.create(
    data,{ raw: true }
   )
  }

  async countIsRead(user_id:number){
    return await this.notificationRepository.count({
      where:{
        target_user_id:user_id
      }
    })
  }

  async findAndCountAll( user:User, query: { limit: number, offset?: number } ){

   const notificaiton = await this.notificationRepository.findAndCountAll({ 
      where: {
        target_user_id: user.id,
      },
      order: [["created_at", "DESC"]],
      limit: query.limit,
      offset: query.offset
    })
    return {
      result:notificaiton.rows,
      count:notificaiton.count
    }

  }

  async updateReadStatus(is_read:boolean, where:any){
    return await this.notificationRepository.update( {is_read:is_read } ,{ where })
  }


}