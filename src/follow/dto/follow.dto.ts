import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { CommunityUserModel } from "src/abstract/base-model";
import { ReturnCommunityJoinDto } from "src/community/community-join/dto/return-community-join";

export class FollowDto extends CommunityUserModel {
    @Type(() => ReturnCommunityJoinDto)
    community?: ReturnCommunityJoinDto[];

    constructor(partial: Partial<FollowDto>) {
        super(partial);
        Object.assign(this, partial);
    }
    // @ApiProperty()
    // id: string;

    // @ApiProperty()
    // user_id: string;

    // @ApiProperty()
    // follow_id: string;
}
