import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { UserMeta } from "./user_meta.entity";
import { UserMetaService } from "./user_meta.service";
import { User } from '../user/user.entity'
import { UserModule } from "src/user/user.module";
import { UserMetaController } from "./user_meta.controller";

@Module({
  imports:[
    SequelizeModule.forFeature([UserMeta, User]),
    UserModule
  ],
  controllers:[UserMetaController],
  providers:[UserMetaService],
  exports:[UserMetaService]
})
export class UserMetaModule { }