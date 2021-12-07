import { Inject, Injectable } from "@nestjs/common";
import { BaseService } from "src/abstract/base-service";
import { PortfolioPostTimeLine } from "./portfolio-post-timeline.entity";

@Injectable()
export class PortfolioTimelineService extends BaseService<PortfolioPostTimeLine> {
    constructor(
        @Inject("PortfolioPostTimeLineRepository")
        private readonly channelPostRepository: typeof PortfolioPostTimeLine
    ) {
        super(channelPostRepository);
    }

    async findPinPosts(portfolio_id: string, channel_id: string, state: boolean) {
        return await this.channelPostRepository.findAndCountAll({
            where: {
                portfolio_id: portfolio_id,
                channel_id: channel_id,
                is_pinned: state
            }
        });
    }
}
