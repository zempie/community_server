import { ApiProperty } from "@nestjs/swagger";
import { Community } from "src/community/community.entity"
import { Game } from "src/game/game.entity"
import { Posts } from "src/posts/posts.entity"
import { UserDto } from "src/user/dto/user.dto"

export class SearchAllDto {
    @ApiProperty()
    users: UserDto[];
    @ApiProperty()
    games: Game[];
    @ApiProperty()
    community: Community[];
    @ApiProperty()
    posts: Posts[];
    constructor(partial: Partial<SearchAllDto>) {
        Object.assign(this, partial);
    }
}