import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { NotificationsController } from "./notification.controller";
import { Notification } from "./notification.entity";
import { NotificationService } from "./notification.service";
import { User } from '../user/user.entity'
import { UserModule } from "src/user/user.module";
import { UserMeta } from "src/user_meta/user_meta.entity";
import { UserMetaModule } from "src/user_meta/user_meta.module";
import { UserMetaService } from "src/user_meta/user_meta.service";


@Module({
  imports:[
    SequelizeModule.forFeature([Notification, User, UserMeta]),
    UserModule,
    UserMetaModule,
  ],
  controllers:[NotificationsController],
  providers:[NotificationService, UserMetaService],
  exports:[NotificationService]
})
export class NotificationModule { }