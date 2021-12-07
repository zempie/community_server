import { ApiProperty } from "@nestjs/swagger";
import { CommunityUserModelAddCnt } from "src/abstract/base-model";
import { DataType } from "sequelize-typescript";

export class UserDto extends CommunityUserModelAddCnt {

    @ApiProperty({
        description: "유저 id"
    })
    id: number;

    @ApiProperty({
        description: "유저 uid"
    })
    uid: string;

    @ApiProperty({
        description: "유저 이름"
    })
    name: string;

    @ApiProperty({
        description: "유저 고유 채널 id"
    })
    channel_id: string;

    @ApiProperty({
        description: "프로필 사진"
    })
    picture: string;

    @ApiProperty({
        description: "이메일"
    })
    email: string;

    @ApiProperty({
        description: "개발자 여부"
    })
    is_developer: number;

    @ApiProperty({
        type: DataType.DATE,
        description: "마지막 로그인"
    })
    last_log_in: Date;

    constructor(partial: Partial<UserDto>) {
        super(partial);
        Object.assign(this, partial);
    }
}
