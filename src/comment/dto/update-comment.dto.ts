import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { ValidateNested } from "class-validator";
import { File } from "../../file/dto/file.dto";

export class UpdateCommentDto {
    @ValidateNested({ each: true })
    @Type(() => File)
    attatchment_files?: File[];

    @ApiProperty({
        description: "댓글 내용"
    })
    content?: string;

    like_cnt?: number;

    dislike_cnt?: number;
}
