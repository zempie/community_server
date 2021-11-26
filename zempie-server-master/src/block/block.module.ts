import { Module } from "@nestjs/common";
import { BlockService } from "./block.service";
import { BlockController } from "./block.controller";
import { Block } from "./block.entity";
import { SequelizeModule } from "@nestjs/sequelize";
import { FollowModule } from "src/follow/follow.module";
import { UserModule } from "src/user/user.module";
import { User } from "src/user/user.entity";
import { CommonInfoService } from "src/commoninfo/commoninfo.service";
import { LikeService } from "src/like/like.service";
import { PostsService } from "src/posts/posts.service";
import { Posts } from "src/posts/posts.entity";
import { Like } from "src/like/like.entity";
import { CommonInfoModule } from "src/commoninfo/commoninfo.module";

@Module({
    imports: [SequelizeModule.forFeature([Block, User, Like, Posts]), FollowModule, UserModule, CommonInfoModule],
    providers: [BlockService, LikeService, PostsService],
    controllers: [BlockController],
    exports: [BlockService]
})
export class BlockModule {}
