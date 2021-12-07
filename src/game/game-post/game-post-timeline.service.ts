import { Inject, Injectable } from "@nestjs/common";
import { BaseService } from "src/abstract/base-service";
import { GamePostTimeLine } from "./game-post-timeline.entity";

@Injectable()
export class GameTimelineService extends BaseService<GamePostTimeLine> {
    constructor(
        @Inject("GamePostTimeLineRepository")
        private readonly gamePostRepository: typeof GamePostTimeLine
    ) {
        super(gamePostRepository);
    }

    async findPinPost(game_id: string, state: boolean) {
        return await this.gamePostRepository.findAndCountAll({
            where: {
                game_id: game_id,
                is_pinned: state
            }
        });
    }
}
