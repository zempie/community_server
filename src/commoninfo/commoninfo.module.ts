import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { Block } from "src/block/block.entity";
import { BlockService } from "src/block/block.service";
import { ChannelTimeline } from "src/channel-post/channel-timeline.entity";
import { ChannelTimelineService } from "src/channel-post/channel-timeline.service";
import { Follow } from "src/follow/follow.entity";
import { FollowService } from "src/follow/follow.service";
import { Like } from "src/like/like.entity";
import { LikeService } from "src/like/like.service";
import { Posts } from "src/posts/posts.entity";
import { PostsService } from "src/posts/posts.service";
import { User } from "src/user/user.entity";
import { UserService } from "src/user/user.service";
import { CommonInfoService } from "./commoninfo.service";

@Module({
    imports: [SequelizeModule.forFeature([Follow, Block, Like, Posts, User, ChannelTimeline])],
    providers: [CommonInfoService, FollowService, BlockService, LikeService, PostsService, UserService, ChannelTimelineService],
    exports: [CommonInfoService]
})
export class CommonInfoModule { }
