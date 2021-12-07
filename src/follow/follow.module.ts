import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { CommonInfoModule } from "src/commoninfo/commoninfo.module";
import { CommunityJoinModule } from "src/community/community-join/community-join.module";
import { SearchKeywordLog } from "src/search/search_keyword_log/search_keyword_log.entity";
import { SearchKeywordLogService } from "src/search/search_keyword_log/search_keyword_log.service";
import { User } from "src/user/user.entity";
import { UserService } from "src/user/user.service";
import { FollowController } from "./follow.controller";
import { Follow } from "./follow.entity";
import { FollowService } from "./follow.service";

@Module({
    imports: [SequelizeModule.forFeature([Follow, User, SearchKeywordLog]), CommonInfoModule, CommunityJoinModule],
    controllers: [FollowController],
    providers: [FollowService, UserService, SearchKeywordLogService],
    exports: [FollowService]
})
export class FollowModule {}
