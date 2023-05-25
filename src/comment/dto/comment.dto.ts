import { ApiProperty } from "@nestjs/swagger";
import { CommentType } from "../enum/commenttype.enum";
import { File } from "../../file/dto/file.dto";
import { Type } from "class-transformer";
import { ValidateNested } from "class-validator";
import { UserDto } from "src/user/dto/user.dto";

export class CommentDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    user_id: number;

    @ApiProperty({
        type: UserDto,
    })
    user: UserDto;

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
    is_liked?: boolean;

    @ApiProperty()
    created_at?: string;

    constructor(partial: Partial<CommentDto>) {
        this.is_read = partial.is_read ? partial.is_read : false;
        this.is_liked = partial.is_liked ? partial.is_liked : false;
        Object.assign(this, partial);
    }
}
export class CommentReCommentDto extends CommentDto {
    @ValidateNested({ each: true })
    @Type(() => CommentDto)
    children_comments?: CommentDto[];
    deleted_at?: string;
    constructor(partial: Partial<CommentReCommentDto>) {

        super(partial);
        this.children_comments = partial.children_comments ? partial.children_comments : [];
        Object.assign(this, partial);
    }
}