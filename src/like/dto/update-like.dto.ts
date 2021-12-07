import { ApiProperty } from "@nestjs/swagger";
import { CreatePostLikeDto } from "./create-like.dto";

export class UpdatePostLikeDto extends CreatePostLikeDto {}

export class UpdateCommentLikeDto {
    @ApiProperty()
    post_id: string;

    @ApiProperty()
    comment_id: string;

    @ApiProperty()
    user_id: string;
}
