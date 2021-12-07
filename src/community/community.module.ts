import { Module } from "@nestjs/common";
import { CommunityService } from "./community.service";
import { SequelizeModule } from "@nestjs/sequelize";
import { CommunityController } from "./community.controller";
import { Community } from "./community.entity";
import { CommunityChannelModule } from "./community-channel/community-channel.module";
import { CommunityJoinModule } from "./community-join/community-join.module";
import { FollowModule } from "src/follow/follow.module";
import { User } from "src/user/user.entity";
import { BlockModule } from "src/block/block.module";
import { UserModule } from "src/user/user.module";
import { PostsModule } from "src/posts/posts.module";
import { LikeModule } from "src/like/like.module";
import { CommonInfoModule } from "src/commoninfo/commoninfo.module";
import { HashtagLogModule } from "src/hashtag-log/hashtag-log.module";
import { ChannelPostModule } from "src/channel-post/channel-post.module";
import { FcmModule } from "src/fcm/fcm.module";
import { CommunityVisitLogService } from "./community-visit-log/community-visit-log.service";
import { CommunityVisitLog } from "./community-visit-log/community-visit-log.entity";
import { SearchKeywordLogService } from "src/search/search_keyword_log/search_keyword_log.service";
import { SearchKeywordLog } from "src/search/search_keyword_log/search_keyword_log.entity";
import { CommunityLogicService } from "./community.logic.service";
import { AdminFcmModule } from "src/admin/fcm/admin.fcm.module";

@Module({
    imports: [
        SequelizeModule.forFeature([Community, User, CommunityVisitLog, SearchKeywordLog]),
        CommunityChannelModule,
        CommunityJoinModule,
        FollowModule,
        BlockModule,
        UserModule,
        PostsModule,
        LikeModule,
        CommonInfoModule,
        HashtagLogModule,
        ChannelPostModule,
        FcmModule,
        AdminFcmModule
    ],
    providers: [CommunityService, CommunityVisitLogService, SearchKeywordLogService, CommunityLogicService],
    exports: [CommunityService, CommunityLogicService],
    controllers: [CommunityController]
})
export class CommunityModule { }
