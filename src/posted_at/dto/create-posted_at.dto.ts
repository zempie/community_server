import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { ValidateNested } from "class-validator";
import { PostedAtCommunityDto } from "./posted_at.dto";

export class CreatePostedAtDto {
    @ApiProperty()
    posts_id: string;

    // 내 채널에 올린 경우
    @ApiProperty()
    channel_id: string;

    // 게임페이지에 올린경우
    @ApiProperty()
    game_id?: string;

    // 커뮤니티페이지에 올린경우
    //    채널 선택
    // @ApiProperty()
    // community_id: string;

    // @ApiProperty()
    // community_channel_id: string;

    @ApiProperty({
        type: [PostedAtCommunityDto],
        required: false
    })
    @ValidateNested({ each: true })
    @Type(() => PostedAtCommunityDto)
    community?: PostedAtCommunityDto[]

    //포트폴리오에 추가한경우
    @ApiProperty()
    portfolio_ids?: string[];
}
