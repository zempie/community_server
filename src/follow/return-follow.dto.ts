import { ApiProperty } from "@nestjs/swagger";
import { CommunityUserModelAddCnt } from "src/abstract/base-model";

export class ReturnFollowDto extends CommunityUserModelAddCnt {
    @ApiProperty({
        description: "팔로우 해당 유저"
    })
    id: number;

    @ApiProperty()
    is_read: boolean;

    constructor(partial: Partial<ReturnFollowDto>) {
        super(partial);
        Object.assign(this, partial);
    }
}

export class ReturnUnFollowDto extends CommunityUserModelAddCnt {
    @ApiProperty({
        description: "팔로우 해당 유저"
    })
    id: number;

    constructor(partial: Partial<ReturnUnFollowDto>) {
        super(partial);
        Object.assign(this, partial);
    }
}
