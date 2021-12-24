import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { SearchController } from "./search.controller";
import { CommunityModule } from "src/community/community.module";
import { PostsModule } from "src/posts/posts.module";
import { GameModule } from "src/game/game.module";
import { UserModule } from "src/user/user.module";
import { SearchKeywordLogService } from "./search_keyword_log/search_keyword_log.service";
import { SearchKeywordLog } from "./search_keyword_log/search_keyword_log.entity";
import { User } from "src/user/user.entity";
import { LikeModule } from "src/like/like.module";
import { CommonInfoModule } from "src/commoninfo/commoninfo.module";

@Module({
    imports: [
        SequelizeModule.forFeature([SearchKeywordLog, User]),
        CommunityModule,
        PostsModule,
        GameModule,
        UserModule,
        LikeModule,
        CommonInfoModule
    ],
    controllers: [SearchController],
    providers: [SearchKeywordLogService],
    exports: []
})
export class SearchModule { }
