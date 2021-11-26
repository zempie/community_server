import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { GamePostTimeLine } from "./game-post-timeline.entity";
import { GameTimelineService } from "./game-post-timeline.service";
import { GamePost } from "./game-post.entity";
import { GamePostService } from "./game-post.service";

@Module({
    imports: [SequelizeModule.forFeature([GamePost, GamePostTimeLine])],
    controllers: [],
    providers: [GamePostService, GameTimelineService],
    exports: [GamePostService, GameTimelineService]
})
export class GamePostModule { }
