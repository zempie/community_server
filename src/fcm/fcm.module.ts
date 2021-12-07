import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { Fcm } from "./fcm.entity";
import { FcmService } from "./fcm.service";
import { FcmController } from "./fcm.controller";
import { User } from "src/user/user.entity";
import { UserService } from "src/user/user.service";

@Module({
    imports: [SequelizeModule.forFeature([Fcm, User])],
    providers: [FcmService, UserService],
    exports: [FcmService],
    controllers: [FcmController]
})
export class FcmModule {}
