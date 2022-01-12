import { ApiProperty } from "@nestjs/swagger";
import { CommunityUserModel } from "src/abstract/base-model";
import { User } from "src/user/user.entity";
import { JoinState } from "../enum/joinstate.enum";
import { JoinStatus } from "../enum/joinststus.enum";

export class CommunityJoinDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    user_id: number;

    @ApiProperty()
    community_id: string;

    @ApiProperty()
    status: JoinStatus;

    @ApiProperty()
    state: JoinState;
}

export class CommunityJoinUserDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    user: User;

    @ApiProperty()
    community_id: string;

    @ApiProperty()
    status: JoinStatus;

    @ApiProperty()
    state: JoinState;

    constructor(partial: Partial<CommunityJoinUserDto>) {
        Object.assign(this, partial);
    }
}

export class CommunityJoinBlockUserDto extends CommunityUserModel {
    @ApiProperty()
    community_id: string;

    @ApiProperty()
    status: JoinStatus;

    @ApiProperty()
    state: JoinState;

    @ApiProperty()
    created_at: number;

    constructor(partial: Partial<CommunityJoinBlockUserDto>) {
        super(partial)
        Object.assign(this, partial);
    }
}