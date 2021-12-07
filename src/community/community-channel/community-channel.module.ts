import { Module } from "@nestjs/common";
import { CommunityChannelService } from "./community-channel.service";
import { CommunityChannel } from "./community-channel.entity";
import { SequelizeModule } from "@nestjs/sequelize";

@Module({
    imports: [SequelizeModule.forFeature([CommunityChannel])],
    providers: [CommunityChannelService],
    exports: [CommunityChannelService]
})
export class CommunityChannelModule {}
