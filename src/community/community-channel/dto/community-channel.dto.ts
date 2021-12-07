import { ApiProperty } from "@nestjs/swagger";
import { ChannelState } from "../channelstate.enum";

export class CommunityChannelBaseDto {
    @ApiProperty()
    id: string;

    @ApiProperty({
        description: "상위 커뮤니티 id"
    })
    community_id: string;

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
        description: "공개(PUBLIC) / 비공개(PRIVATE) default: 공개(PUBLIC)",
        enum: ChannelState,
        enumName:"ChannelState"
    })
    state: ChannelState;

    constructor(partial: Partial<CommunityChannelDto>) {
        Object.assign(this, partial);
        // this.sort = 0;
    }
}
export class CommunityChannelDto extends CommunityChannelBaseDto {

    sort: number;

    constructor(partial: Partial<CommunityChannelDto>) {
        super(partial)
        Object.assign(this, partial);
        // this.sort = 0;
    }
}
