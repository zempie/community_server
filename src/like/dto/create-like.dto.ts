import { ApiProperty } from "@nestjs/swagger";
import { LikeType } from "../enum/liketype.enum";

export class CreatePostLikeDto {
    @ApiProperty()
    user_id: number;

    @ApiProperty()
    type: LikeType;
}

export class CreateCommentLikeDto {
    @ApiProperty()
    post_id: string;

    @ApiProperty()
    comment_id: string;

    @ApiProperty()
    user_id: number;

    @ApiProperty()
    type: LikeType;

    @ApiProperty()
    state: boolean;
}

export class CreateCommentdisLikeDto {
    @ApiProperty()
    post_id: string;

    @ApiProperty()
    comment_id: string;

    @ApiProperty()
    type: LikeType;

    @ApiProperty()
    user_id: number;

    @ApiProperty()
    state: boolean;
}
