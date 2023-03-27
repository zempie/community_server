import { ApiProperty } from "@nestjs/swagger";
import { Exclude, Expose, Transform } from "class-transformer";
import { JoinType } from "src/community/community-join/enum/jointype.enum";

export abstract class BaseModel {
    id: string;

    created_at: Date;

    updated_at: Date;

    deleted_at: Date;
}

export abstract class FollowInfoModel {

    @ApiProperty({
        description: "해당 유저가 로그인한 회원을 팔로우 하고 있는 지 아닌지(자기 자신인 경우 false)"
    })
    follow_you?: boolean;

    @ApiProperty({
        description: "로그인한 회원이 해당 유저를 팔로우 하고 있는 지 아닌지(자기 자신인 경우 false)"
    })
    is_following?: boolean;

    @ApiProperty({
        description: "해당 유저가 로그인한 회원을 블락했는지 아닌지(자기 자신인 경우 false)"
    })
    block_you?: boolean;

    @ApiProperty({
        description: "로그인한 회원이 해당 유저를 블락했는지 아닌지(자기 자신인 경우 false)"
    })
    is_blocked?: boolean;

    @ApiProperty({
        description: "해당 유저가 로그인한 회원을 뮤트 하고 있는 지 아닌지(자기 자신인 경우 false)"
    })
    mutes_you?: boolean;

    @ApiProperty({
        description: "로그인한 회원이 해당 유저를 뮤트했는지 아닌지(자기 자신인 경우 false)"
    })
    is_muted?: boolean;

    constructor(partial: Partial<FollowInfoModel>) {
        this.follow_you = partial.follow_you ?? false;
        this.is_following = partial.is_following ?? false;
        this.block_you = partial.block_you ?? false;
        this.is_blocked = partial.is_blocked ?? false;
        this.mutes_you = partial.mutes_you ?? false;
        this.is_muted = partial.is_muted ?? false;
        Object.assign(this, partial);
    }
}

export abstract class CommunityUserModelAddCnt extends FollowInfoModel {
    @ApiProperty()
    followers_cnt?: number;

    @ApiProperty()
    followings_cnt?: number;

    constructor(partial: Partial<CommunityUserModelAddCnt>) {
        super(partial);
        this.followers_cnt = partial.followers_cnt ? partial.followers_cnt : 0;
        this.followings_cnt = partial.followings_cnt ? partial.followings_cnt : 0;
        Object.assign(this, partial);
    }
}

export abstract class CommunityUserModel extends CommunityUserModelAddCnt {
    @ApiProperty({ description: "고유 ID" })
    id: number;

    @ApiProperty({ description: "고유 User ID" })
    uid: string;

    @ApiProperty({ description: "이메일" })
    email: string;

    @ApiProperty({ description: "이름" })
    name: string;

    @ApiProperty({ description: "닉네임" })
    nickname: string;

    @ApiProperty({ description: "회원 채널 ID" })
    channel_id: string;

    @ApiProperty({ description: "본인 프로필 이미지" })
    profile_img: string;

    @Exclude()
    is_developer: number;

    @ApiProperty()
    type: JoinType;
    // @Expose()
    // get type(): JoinType {
    //     return this.is_developer == 0 ? JoinType.DEVELOPER : JoinType.USER
    // }

    constructor(partial: Partial<CommunityUserModel>) {
        super(partial);
        this.type = partial.is_developer && this.is_developer == 0 ? JoinType.DEVELOPER : JoinType.USER
        Object.assign(this, partial);
    }
}

export abstract class SuccessReturnModel {
    @ApiProperty({ description: "성공여부" })
    success: boolean;
}