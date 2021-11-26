import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { Portfolio } from "./portfolio.entity";
import { PortfolioService } from "./portfolio.service";

@Module({
    imports: [SequelizeModule.forFeature([Portfolio])],
    controllers: [],
    providers: [PortfolioService],
    exports: [PortfolioService]
})
export class PortfolioModule {}
