import { ApiProperty } from "@nestjs/swagger";
import { ChannelState } from "../channelstate.enum";

export class CreateCommunityChannelDto {
    @ApiProperty({
        description: "커뮤니티 id"
    })
    community_id: string;

    @ApiProperty({
        description: "유저 id"
    })
    user_id: number;

    @ApiProperty({
        description: "채널 이름"
    })
    title: string;

    @ApiProperty({
        description: "채널 설명"
    })
    description: string;

    @ApiProperty({
        description: "채널 프로필 이미지"
    })
    profile_img: string;

    @ApiProperty({
        description: "정렬"
    })
    sort: number;

    @ApiProperty({
        enum: ChannelState,
        enumName: "ChannelState",
        description: "공개(PIBULIC) / 비공개(PRIVATE) default: 공개(PIBULIC)"
    })
    state: ChannelState;
}
