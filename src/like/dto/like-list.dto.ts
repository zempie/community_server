import { ApiProperty } from "@nestjs/swagger";
import { User } from "src/user/user.entity";

export class LikeListDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    post_id: string;

    @ApiProperty()
    user: User;
}
