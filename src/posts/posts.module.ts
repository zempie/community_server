import { Module } from "@nestjs/common";
import { PostsService } from "./posts.service";
import { PostsController } from "./posts.controller";
import { SequelizeModule } from "@nestjs/sequelize";
import { Posts } from "./posts.entity";
import { LikeModule } from "src/like/like.module";
import { CommentModule } from "src/comment/comment.module";
import { PostedAtModule } from "src/posted_at/posted_at.module";
import { CommunityChannelModule } from "src/community/community-channel/community-channel.module";
import { ReportModule } from "src/report/report.module";
import { User } from "src/user/user.entity";
import { UserModule } from "src/user/user.module";
import { ChannelPostModule } from "src/channel-post/channel-post.module";
import { PortfolioPostModule } from "src/portfolio/portfolio-post/portfolio-post.module";
import { CommunityJoinModule } from "src/community/community-join/community-join.module";
import { HashtagLogModule } from "src/hashtag-log/hashtag-log.module";
import { BlockModule } from "src/block/block.module";
import { FollowModule } from "src/follow/follow.module";
import { GamePostModule } from "src/game/game-post/game-post.module";
import { CommonInfoModule } from "src/commoninfo/commoninfo.module";
import { CommunityService } from "src/community/community.service";
import { Community } from "src/community/community.entity";
import { FcmModule } from "src/fcm/fcm.module";
import { PostsViewLogService } from "./posts_view_log/posts_view_log_service";
import { PostsViewLog } from "./posts_view_log/posts_view_log.entity";
import { LikeLog } from "src/like/like_log/like_log.entity";
import { LikeLogService } from "src/like/like_log/like_log.service";
import { PostsLogicService } from "./posts.logic.service";
import { AdminFcmModule } from "src/admin/fcm/admin.fcm.module";
import { NotificationModule } from "src/notification/notification.module";

@Module({
    imports: [
        SequelizeModule.forFeature([Posts, User, Community, PostsViewLog, LikeLog]),
        LikeModule,
        CommentModule,
        PostedAtModule,
        CommunityChannelModule,
        ReportModule,
        UserModule,
        ChannelPostModule,
        PortfolioPostModule,
        CommunityJoinModule,
        HashtagLogModule,
        BlockModule,
        FollowModule,
        GamePostModule,
        CommonInfoModule,
        FcmModule,
        AdminFcmModule,
        NotificationModule
    ],
    providers: [PostsService, CommunityService, PostsViewLogService, LikeLogService, PostsLogicService],
    controllers: [PostsController],
    exports: [PostsService, PostsLogicService]
})
export class PostsModule { }
