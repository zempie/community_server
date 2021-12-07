import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { AdminFcmModule } from "src/admin/fcm/admin.fcm.module";
import { ReportModule } from "src/report/report.module";
import { User } from "src/user/user.entity";
import { UserService } from "src/user/user.service";
import { CommentController } from "./comment.controller";
import { Comment } from "./comment.entity";
import { CommentService } from "./comment.service";

@Module({
    imports: [SequelizeModule.forFeature([Comment, User]), ReportModule, AdminFcmModule],
    controllers: [CommentController],
    providers: [CommentService, UserService],
    exports: [CommentService]
})
export class CommentModule { }
