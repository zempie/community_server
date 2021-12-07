import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { ChannelPost } from "./channel-post.entity";
import { ChannelPostService } from "./channel-post.service";
import { ChannelTimeline } from "./channel-timeline.entity";
import { ChannelTimelineService } from "./channel-timeline.service";

@Module({
    imports: [SequelizeModule.forFeature([ChannelPost, ChannelTimeline])],
    providers: [ChannelPostService, ChannelTimelineService],
    controllers: [],
    exports: [ChannelPostService, ChannelTimelineService]
})
export class ChannelPostModule { }
