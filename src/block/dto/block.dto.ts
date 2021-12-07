import { ApiProperty } from "@nestjs/swagger";
import { BlockType } from "../enum/blocktype.enum";

export class BlockDto {
    @ApiProperty()
    id: string;

    @ApiProperty({
        description: "유저 블락 이라면 null"
    })
    community_id: string;

    @ApiProperty()
    user_id: number;

    @ApiProperty()
    target_id: string;

    @ApiProperty()
    blocked_at: number;

    @ApiProperty()
    expires_on: number;

    @ApiProperty()
    reason: string;

    @ApiProperty()
    type: BlockType;
    constructor(partial: Partial<BlockDto>) {
        Object.assign(this, partial);
    }
}
