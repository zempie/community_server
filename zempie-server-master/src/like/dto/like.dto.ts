import { ApiProperty } from "@nestjs/swagger";
import { LikeType } from "../enum/liketype.enum";

export class LikeDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    post_id: string;

    @ApiProperty()
    comment_id: string;

    @ApiProperty()
    user_id: number;

    @ApiProperty()
    type: LikeType;

    @ApiProperty()
    is_read: boolean;
    
    @ApiProperty()
    is_liked: boolean;

    @ApiProperty({
        description: "좋아요(true), 싫어요(false)"
    })
    state: boolean;

    constructor(partial: Partial<LikeDto>) {
        this.is_liked = partial.is_liked ? partial.is_liked : false;
        Object.assign(this, partial);
    }
}
