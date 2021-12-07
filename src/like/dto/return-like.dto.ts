import { ApiProperty } from "@nestjs/swagger";
import { Exclude } from "class-transformer";
import { LikeType } from "../enum/liketype.enum";

export class ReturnLikeDto {
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

    // @ApiProperty({
    //     description: "좋아요(true), 싫어요(false)"
    // })
    @Exclude()
    state: boolean;

    @ApiProperty({
        description: "좋아요(true), 싫어요(false)"
    })
    is_liked:boolean

    @ApiProperty()
    is_read: boolean;

    constructor(partial: Partial<ReturnLikeDto>) {
        this.is_liked = partial.state
        Object.assign(this, partial);
    }
}
