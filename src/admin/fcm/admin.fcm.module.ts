import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { FcmModule } from "src/fcm/fcm.module";
import { AdminFcm } from "./admin.fcm.entity";
import { AdminFcmService } from "./admin.fcm.service";

@Module({
    imports: [SequelizeModule.forFeature([AdminFcm]), FcmModule],
    providers: [AdminFcmService],
    exports: [AdminFcmService],
})
export class AdminFcmModule { }
