import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { ValidateNested } from "class-validator";
import { CommentType } from "../enum/commenttype.enum";
import { File } from "../../file/dto/file.dto";

export class CreateCommentDto {
    @ApiProperty({
        description: "작성자 id"
    })
    user_id: number;

    user_uid: string;

    @ApiPropertyOptional({ type: File, isArray: true })
    @ValidateNested({ each: true })
    @Type(() => File)
    attatchment_files?: File[];

    @ApiProperty({
        enum: CommentType,
        enumName: "CommentType",
        description: "댓글(COMMENT) / 대댓글(REPLY) "
    })
    type: CommentType;

    @ApiProperty({
        description: "대댓글의 상위 댓글 / 댓글의 경우에는 null "
    })
    parent_id: string;

    @ApiProperty({
        description: "해당 포스트 id "
    })
    post_id: string;

    @ApiPropertyOptional({
        description: "댓글 내용 "
    })
    content?: string;

    @ApiProperty({
        description: "비공개(true) / 공개(false) default: 공개(false)"
    })
    is_private: boolean;
}

export class UpdateReCommentDto {
    @ApiProperty({
        description: "댓글 내용 "
    })
    content?: string;

    @ValidateNested({ each: true })
    @Type(() => File)
    attatchment_files?: File[];
}
