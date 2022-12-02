import { Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { BaseService } from "src/abstract/base-service";
import { UserMeta } from "./user_meta.entity"
import { UserMetaDto } from "./dto/user_meta.dto";



@Injectable()
export class UserMetaService extends BaseService<UserMeta>{
  constructor(
    @Inject("UserMetaRepository")
    private readonly userMetaRepository : typeof UserMeta
  ){
    super(userMetaRepository)
  }

  async get(user_id: number) {
    return this.userMetaRepository.findOne({where:{user_id: user_id}})
  }


  async create(data:UserMetaDto) {
   return this.userMetaRepository.create(
    data,{ raw: true }
   )
  }

  async updateCheckTime(user_id: number) {
    return this.userMetaRepository.update({notification_check_time:Date.now()},{ where:{
      user_id:user_id
    }})
  }

}