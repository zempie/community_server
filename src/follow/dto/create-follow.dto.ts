import { ApiProperty } from "@nestjs/swagger";

export class CreateFollowDto {
    @ApiProperty({
        description: "해당 유저 id"
    })
    user_id: number;

    @ApiProperty({
        description: "해당 유저를 팔로우하는 유저의 id"
    })
    follow_id: number;
}
