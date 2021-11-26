import { ApiProperty } from "@nestjs/swagger";
import { BlockType } from "../enum/blocktype.enum";

export class CreateUserBlockDto {
    @ApiProperty()
    user_id: number;

    @ApiProperty({
        description: "신고 할 대상"
    })
    target_id: number;

    @ApiProperty()
    type: BlockType;
}

export class CreateCommunityBlockDto {
    @ApiProperty({
        description: "유저 블락 이라면 null"
    })
    community_id: string;

    // @ApiProperty()
    // user_id: number;

    @ApiProperty()
    target_id: number;

    // @ApiProperty()
    // blocked_at: number;

    // @ApiProperty()
    // expires_on: number;

    // @ApiProperty()
    // reason: string;

    @ApiProperty()
    type: BlockType;
}

export class CreateCommunityKickDto {
    @ApiProperty()
    community_id: string;

    @ApiProperty()
    target_id: number;

    @ApiProperty()
    type: BlockType;
}
