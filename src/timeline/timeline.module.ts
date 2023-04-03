import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { BlockModule } from "src/block/block.module";
import { ChannelPostModule } from "src/channel-post/channel-post.module";
import { CommonInfoModule } from "src/commoninfo/commoninfo.module";
import { CommunityChannelModule } from "src/community/community-channel/community-channel.module";
import { CommunityJoinModule } from "src/community/community-join/community-join.module";
import { CommunityModule } from "src/community/community.module";
import { FollowModule } from "src/follow/follow.module";
import { GamePostModule } from "src/game/game-post/game-post.module";
import { GameModule } from "src/game/game.module";
import { LikeModule } from "src/like/like.module";
import { PortfolioPostModule } from "src/portfolio/portfolio-post/portfolio-post.module";
import { PortfolioModule } from "src/portfolio/portfolio.module";
import { PostedAtModule } from "src/posted_at/posted_at.module";
import { PostsModule } from "src/posts/posts.module";
import { PostMetadataModule } from "src/post_metadata/post_metadata.module";
import { SearchKeywordLog } from "src/search/search_keyword_log/search_keyword_log.entity";
import { SearchKeywordLogService } from "src/search/search_keyword_log/search_keyword_log.service";
import { User } from "src/user/user.entity";
import { UserModule } from "src/user/user.module";
import { ChannelController, TimelineController } from "./timeline.controller";
import { TimelineService } from "./timeline.service";

@Module({
    imports: [
        SequelizeModule.forFeature([User, SearchKeywordLog]),
        PortfolioPostModule,
        GameModule,
        PortfolioModule,
        PostsModule,
        ChannelPostModule,
        CommunityJoinModule,
        GamePostModule,
        UserModule,
        FollowModule,
        CommonInfoModule,
        PostedAtModule,
        LikeModule,
        BlockModule,
        CommunityModule,
        CommunityChannelModule,
        PostMetadataModule
    ],
    controllers: [TimelineController, ChannelController],
    providers: [SearchKeywordLogService, TimelineService],
    exports: [TimelineService]
})
export class TimelineModule {}
