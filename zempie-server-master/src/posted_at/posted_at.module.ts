import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { PostedAt } from "./posted_at.entity";
import { PostedAtService } from "./posted_at.service";

@Module({
    imports: [SequelizeModule.forFeature([PostedAt])],
    controllers: [],
    providers: [PostedAtService],
    exports: [PostedAtService]
})
export class PostedAtModule {}
