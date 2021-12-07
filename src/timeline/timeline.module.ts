import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { ChannelPostModule } from "src/channel-post/channel-post.module";
import { CommonInfoModule } from "src/commoninfo/commoninfo.module";
import { CommunityJoinModule } from "src/community/community-join/community-join.module";
import { FollowModule } from "src/follow/follow.module";
import { GamePostModule } from "src/game/game-post/game-post.module";
import { GameModule } from "src/game/game.module";
import { LikeModule } from "src/like/like.module";
import { PortfolioPostModule } from "src/portfolio/portfolio-post/portfolio-post.module";
import { PortfolioModule } from "src/portfolio/portfolio.module";
import { PostedAtModule } from "src/posted_at/posted_at.module";
import { PostsModule } from "src/posts/posts.module";
import { SearchKeywordLog } from "src/search/search_keyword_log/search_keyword_log.entity";
import { SearchKeywordLogService } from "src/search/search_keyword_log/search_keyword_log.service";
import { User } from "src/user/user.entity";
import { UserModule } from "src/user/user.module";
import { ChannelController, TimelineController } from "./timeline.controller";

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
        LikeModule
    ],
    controllers: [TimelineController, ChannelController],
    providers: [SearchKeywordLogService],
    exports: []
})
export class TimelineModule {}
