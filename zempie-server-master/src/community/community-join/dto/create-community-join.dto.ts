import { ApiProperty } from "@nestjs/swagger";
import { JoinStatus } from "../enum/joinststus.enum";
import { JoinType } from "../enum/jointype.enum";

export class CreateCommunityJoinDto {
    @ApiProperty()
    user_id: number;

    @ApiProperty()
    community_id: string;

    @ApiProperty()
    status: JoinStatus;
}
