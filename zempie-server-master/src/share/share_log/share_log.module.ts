import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { PostsModule } from "src/posts/posts.module";
import { User } from "src/user/user.entity";
import { UserModule } from "src/user/user.module";
import { ShareLogController } from "./share_log.controller";
import { ShareLog } from "./share_log.entity";
import { ShareLogService } from "./share_log.service";

@Module({
    imports: [SequelizeModule.forFeature([ShareLog, User]), PostsModule, UserModule],
    providers: [ShareLogService],
    controllers: [ShareLogController],
    exports: [ShareLogService]
})
export class ShareLogModule {}
