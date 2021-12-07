import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { Game } from "./game.entity";
import { GameService } from "./game.service";

@Module({
    imports: [SequelizeModule.forFeature([Game])],
    controllers: [],
    providers: [GameService],
    exports: [GameService]
})
export class GameModule {}
