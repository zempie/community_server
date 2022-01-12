import { ApiProperty } from "@nestjs/swagger";
import { CommunityUserModelAddCnt } from "src/abstract/base-model";
import { UserDto } from "src/user/dto/user.dto";
import { UserType } from "src/user/enum/usertype.enum";
import { User } from "src/user/user.entity";
import { JoinState } from "../enum/joinstate.enum";
import { JoinStatus } from "../enum/joinststus.enum";
import { JoinType } from "../enum/jointype.enum";

export class ReturnCommunityJoinDto extends CommunityUserModelAddCnt {
    @ApiProperty()
    id: number;

    @ApiProperty()
    uid: string;

    @ApiProperty()
    email: string;

    @ApiProperty()
    name: string;
    // @ApiProperty()
    // nickName:string;
    @ApiProperty()
    channel_id: string;

    @ApiProperty()
    profile_img: string;

    @ApiProperty()
    community_id: string;

    // @ApiProperty({
    //     type: UserDto,
    //     isArray: true
    // })
    // user: UserDto;

    @ApiProperty()
    status: JoinStatus;

    @ApiProperty()
    state: JoinState;

    @ApiProperty()
    type?: UserType;

    @ApiProperty()
    post_cnt?: number;

    @ApiProperty()
    liked_cnt?: number;

    @ApiProperty()
    created_at: Date

    constructor(partial: Partial<ReturnCommunityJoinDto>) {
        super(partial);
        this.post_cnt = this.post_cnt ? this.post_cnt : 0;
        this.liked_cnt = this.liked_cnt ? this.liked_cnt : 0;
        Object.assign(this, partial);
    }
}
