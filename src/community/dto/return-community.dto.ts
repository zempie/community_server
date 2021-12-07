import { ApiProperty } from "@nestjs/swagger";
import { CommunityChannel } from "../community-channel/community-channel.entity";
import { CommunityChannelBaseDto, CommunityChannelDto } from "../community-channel/dto/community-channel.dto";

export class ReturnCommunityDto {
    @ApiProperty()
    id: string;

    @ApiProperty({
        description: "커뮤니티 생성자"
    })
    owner_id: number;

    @ApiProperty()
    name: string;

    @ApiProperty()
    manager_id: number;

    @ApiProperty()
    submanager_id: number;

    @ApiProperty()
    url: string;

    @ApiProperty()
    description: string;

    @ApiProperty()
    profile_img: string;

    @ApiProperty()
    banner_img: string;

    @ApiProperty()
    member_cnt: number;

    @ApiProperty()
    posts_cnt: number;

    @ApiProperty()
    visit_cnt: number;

    @ApiProperty({
        type: CommunityChannelBaseDto,
        isArray: true
    })
    channels: CommunityChannelBaseDto[];

    @ApiProperty()
    is_certificated: boolean;

    @ApiProperty()
    is_subscribed: boolean;

    @ApiProperty()
    is_private: boolean;
    constructor(partial: Partial<ReturnCommunityDto>) {
        this.is_subscribed = partial.is_subscribed ? partial.is_subscribed : false;
        Object.assign(this, partial);
    }
}

export class ReturnCommunityUidDto {
    @ApiProperty()
    id: string;

    @ApiProperty({
        description: "커뮤니티 생성자"
    })
    owner_uid: string;

    @ApiProperty()
    name: string;

    @ApiProperty()
    manager_uid: string;

    @ApiProperty()
    submanager_uid: string;

    @ApiProperty()
    url: string;

    @ApiProperty()
    description: string;

    @ApiProperty()
    profile_img: string;

    @ApiProperty()
    banner_img: string;

    @ApiProperty()
    member_cnt: number;

    @ApiProperty()
    posts_cnt: number;

    @ApiProperty()
    visit_cnt: number;

    @ApiProperty({
        type: CommunityChannelBaseDto,
        isArray: true
    })
    channels: CommunityChannelBaseDto[];

    @ApiProperty()
    is_certificated: boolean;

    @ApiProperty()
    is_subscribed: boolean;

    @ApiProperty()
    is_private: boolean;
    constructor(partial: Partial<ReturnCommunityUidDto>) {
        this.is_subscribed = partial.is_subscribed ? partial.is_subscribed : false;
        Object.assign(this, partial);
    }
}
