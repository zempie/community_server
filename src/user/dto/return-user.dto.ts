import { ApiProperty } from "@nestjs/swagger";
import { CommunityUserModelAddCnt } from "src/abstract/base-model";
import { UserType } from "../enum/usertype.enum";
import { UserDto } from "./user.dto";

export class ReturnUser extends CommunityUserModelAddCnt {

    @ApiProperty()
    post_cnt: number;

    @ApiProperty()
    liked_cnt: number;

    @ApiProperty()
    type: UserType;
}
