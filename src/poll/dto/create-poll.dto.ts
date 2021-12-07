import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { ValidateNested } from "class-validator";
import { CreatePostsDto } from "src/posts/dto/create-posts.dto";
import { CreateChoiceDto } from "../choice/dto/create-choice.dto";

export class CreatePollDto extends CreatePostsDto {

    @ApiProperty({ description: "투표 마감일" })
    duration: Date;

    @ApiProperty({ description: "투표 데이터" })
    @ValidateNested({ each: true })
    @Type(() => CreateChoiceDto)
    pollData: CreateChoiceDto[]
}

export class CreatePoll {
    postsId: string;
    end_time: number;
}