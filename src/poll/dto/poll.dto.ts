import { ApiProperty } from "@nestjs/swagger";
import { PostsDto } from "src/posts/dto/posts.dto";
import { ChoiceDto } from "../choice/dto/choice.dto";

export class PollDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    duration: number;

    @ApiProperty()
    choices: ChoiceDto[]

    @ApiProperty()
    end_time: number;

    @ApiProperty()
    createdAt: Date;

    constructor(partial: Partial<PollDto>) {
        Object.assign(this, partial);
    }
}

export class PostsPollDto extends PostsDto {
    poll: PollDto
    user_uid:string;
    constructor(partial: Partial<PostsPollDto>) {
        super(partial)
        Object.assign(this, partial);
    }
}