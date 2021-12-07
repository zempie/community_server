import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsDefined } from "class-validator";
import { User } from "src/user/user.entity";

export class FcmDto {
    @ApiProperty()
    id: string;

    @ApiProperty({
        description: "유저 정보"
    })
    user: User;

    @ApiProperty()
    token: string;

    constructor(partial: Partial<FcmDto>) {
        Object.assign(this, partial);
    }
}
export class FcmSaveQuery {
    @ApiProperty({ description: "저장할 토큰",required:true })
    @Type(_=>String)
    @IsDefined()
    token: string
}
