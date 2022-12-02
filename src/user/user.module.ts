import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { TagController, UserController } from "./user.controller";
import { FollowModule } from "src/follow/follow.module";
import { User } from "./user.entity";
import { UserService } from "./user.service";
import { CommunityJoinModule } from "src/community/community-join/community-join.module";
import { CommunityService } from "src/community/community.service";
import { Community } from "src/community/community.entity";
import { BlockService } from "src/block/block.service";
import { Block } from "src/block/block.entity";
import { PortfolioModule } from "src/portfolio/portfolio.module";
import { PostsService } from "src/posts/posts.service";
import { Posts } from "src/posts/posts.entity";
import { LikeService } from "src/like/like.service";
import { Like } from "src/like/like.entity";
import { CommonInfoModule } from "src/commoninfo/commoninfo.module";
import { HashtagLogModule } from "src/hashtag-log/hashtag-log.module";
import { FcmModule } from "src/fcm/fcm.module";
import { SearchKeywordLogService } from "src/search/search_keyword_log/search_keyword_log.service";
import { SearchKeywordLog } from "src/search/search_keyword_log/search_keyword_log.entity";
import { NotificationService } from "src/notification/notification.service";
import { Notification } from "src/notification/notification.entity";



@Module({
    imports: [
        SequelizeModule.forFeature([User, Community, Block, Posts, Like, SearchKeywordLog, Notification]),
        FollowModule,
        CommunityJoinModule,
        PortfolioModule,
        CommonInfoModule,
        HashtagLogModule,
        FcmModule,
    ],
    controllers: [UserController, TagController],
    providers: [UserService, CommunityService, BlockService, PostsService, LikeService, SearchKeywordLogService, NotificationService],
    exports: [UserService]
})
export class UserModule {}
