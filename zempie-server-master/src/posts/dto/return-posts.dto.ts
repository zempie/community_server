import { ApiProperty } from "@nestjs/swagger";
import { User } from "src/user/user.entity";
import { Posts } from "../posts.entity";

export class ReturnPostsDto {
    @ApiProperty()
    user: User;

    @ApiProperty()
    post: Posts;

    @ApiProperty()
    liked: boolean;
}
