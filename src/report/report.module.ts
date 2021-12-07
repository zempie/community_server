import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { ReportController } from "./report.controller";
import { Report } from "./report.entity";
import { ReportService } from "./report.service";

@Module({
    imports: [SequelizeModule.forFeature([Report])],
    controllers: [ReportController],
    providers: [ReportService],
    exports: [ReportService]
})
export class ReportModule {}
