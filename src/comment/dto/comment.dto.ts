import { ApiProperty } from "@nestjs/swagger";
import { CommentType } from "../enum/commenttype.enum";
import { File } from "../../file/dto/file.dto";
import { Type } from "class-transformer";
import { ValidateNested } from "class-validator";

export class CommentDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    user_id: number;

    @ApiProperty()
    user_uid: string;

    @ApiProperty()
    type: CommentType;

    @ApiProperty()
    parent_id: string;

    @ApiProperty()
    post_id: string;

    @ValidateNested({ each: true })
    @Type(() => File)
    attatchment_files?: File[];

    @ApiProperty()
    content: string;

    @ApiProperty()
    is_private: boolean;

    @ApiProperty()
    is_pinned: boolean;

    @ApiProperty()
    like_cnt: number;

    @ApiProperty()
    dislike_cnt: number;

    @ApiProperty()
    is_read?: boolean;

    @ApiProperty()
    is_liked?:boolean;

    constructor(partial: Partial<CommentDto>) {
        this.is_read = partial.is_read ? partial.is_read : false;
        this.is_liked = partial.is_liked ? partial.is_liked : false;
        Object.assign(this, partial);
    }
}
