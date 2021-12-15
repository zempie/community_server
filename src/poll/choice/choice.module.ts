import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { ChoiceLog } from "./choice-log/choice-log.entity";
import { ChoiceLogService } from "./choice-log/choice-log.service";
import { ChoiceController } from "./choice.controller";
import { Choice } from "./choice.entity";
import { ChoiceService } from "./choice.service";

@Module({
    imports: [SequelizeModule.forFeature([Choice, ChoiceLog])],
    controllers: [ChoiceController],
    providers: [ChoiceService, ChoiceLogService],
    exports: [ChoiceService, ChoiceLogService]
})
export class ChoiceModule { }
