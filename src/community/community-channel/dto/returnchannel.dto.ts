import { ApiProperty } from "@nestjs/swagger";

export class ReturnCommunityChannelDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    community_id: string;

    @ApiProperty()
    title: string;

    @ApiProperty()
    description: string;

    @ApiProperty()
    profile_img: string;

    // @ApiProperty()
    // sort: number;

    @ApiProperty()
    is_private: boolean;

    constructor(partial: Partial<ReturnCommunityChannelDto>) {
        this.is_private = partial.is_private ? partial.is_private : false;
        Object.assign(this, partial);
    }
}
