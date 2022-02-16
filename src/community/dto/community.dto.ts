import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsEnum, IsOptional } from "class-validator";
import { BaseQuery } from "src/abstract/base-query";
import { BlockDto } from "src/block/dto/block.dto";
import { CommunityChannel } from "../community-channel/community-channel.entity";
import { CommunityState } from "../enum/communitystate.enum";

export class CommunityDto {
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

    @ApiProperty()
    channels: CommunityChannel[];

    @ApiProperty()
    state: CommunityState;

    @ApiPropertyOptional({
        type: BlockDto, isArray: true
    })
    user_block?: BlockDto[]

    @ApiProperty()
    is_certificated?: boolean;

    @ApiProperty()
    is_subscribed?: boolean;

    @ApiProperty()
    is_private?: boolean;

    constructor(partial: Partial<CommunityDto>) {
        this.is_subscribed = partial.is_subscribed ? partial.is_subscribed : false;
        this.is_private = partial.is_private ? partial.is_private : false;
        this.user_block = partial.user_block ? partial.user_block : null;
        Object.assign(this, partial);
    }

}

export enum CommunityChannersSort {
    ALPHABETIC = "alphabetic",
    SUBSCRIBE = "subscribe"
}
export class CommunityChannersQuery extends BaseQuery {
    @IsEnum(CommunityChannersSort)
    @IsOptional()
    sort?: CommunityChannersSort
}

export class CommunityShortDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    name: string;

    @ApiProperty()
    url: string;

    @ApiProperty()
    profile_img: string;

    @ApiProperty()
    is_certificated?: boolean;


    constructor(partial: Partial<CommunityShortDto>) {
        this.id = partial.id;
        this.is_certificated = partial.is_certificated;
        this.name = partial.name;
        this.profile_img = partial.profile_img;
        this.url = partial.url
        // Object.assign(this, partial);
    }
}