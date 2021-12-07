import { ApiProperty } from "@nestjs/swagger";
import { FollowInfoModel } from "src/abstract/base-model";
import { User } from "src/user/user.entity";
import { BlockType } from "../enum/blocktype.enum";

export class ReturnBlockDto extends FollowInfoModel {
    @ApiProperty({ description: "블럭한 유저의 ID" })
    id: number;

    constructor(partial: Partial<ReturnBlockDto>) {
        super(partial);
        Object.assign(this, partial);
    }
}
