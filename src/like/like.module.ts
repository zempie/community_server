import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { Like } from "./like.entity";
import { LikeService } from "./like.service";

@Module({
    imports: [SequelizeModule.forFeature([Like])],
    providers: [LikeService],
    exports: [LikeService]
})
export class LikeModule {}
