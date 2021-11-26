import { Module } from "@nestjs/common";
import { CommunityJoinService } from "./community-join.service";
import { CommunityJoin } from "./community-join.entity";
import { SequelizeModule } from "@nestjs/sequelize";

@Module({
    imports: [SequelizeModule.forFeature([CommunityJoin])],
    providers: [CommunityJoinService],
    exports: [CommunityJoinService]
})
export class CommunityJoinModule {}
