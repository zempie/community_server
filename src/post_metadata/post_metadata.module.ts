import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { PostMetadata } from "./post_metadata.entity";
import { PostMetadataService } from "./post_metadata.service";

@Module({
    imports: [SequelizeModule.forFeature([PostMetadata])],
    controllers: [],
    providers: [PostMetadataService],
    exports: [PostMetadataService]
})
export class PostMetadataModule {}
