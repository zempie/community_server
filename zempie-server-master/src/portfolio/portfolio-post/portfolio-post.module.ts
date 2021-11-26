import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { PortfolioPostTimeLine } from "./portfolio-post-timeline.entity";
import { PortfolioTimelineService } from "./portfolio-post-timeline.service";
import { PortfolioPost } from "./portfolio-post.entity";
import { PortfolioPostService } from "./portfolio-post.service";

@Module({
    imports: [SequelizeModule.forFeature([PortfolioPost, PortfolioPostTimeLine])],
    controllers: [],
    providers: [PortfolioPostService, PortfolioTimelineService],
    exports: [PortfolioPostService, PortfolioTimelineService]
})
export class PortfolioPostModule { }
