import { ApiProperty } from "@nestjs/swagger";
import { Community } from "src/community/community.entity"
import { Game } from "src/game/game.entity"
import { GameDTO } from "src/game/game.model";
import { PostsDto } from "src/posts/dto/posts.dto";
import { Posts } from "src/posts/posts.entity"
import { UserDto } from "src/user/dto/user.dto"

export class SearchAllDto {
    @ApiProperty()
    users: UserDto[];
    @ApiProperty()
    games: GameDTO[];
    @ApiProperty()
    community: Community[];
    @ApiProperty()
    posts: PostsDto[];
    constructor(partial: Partial<SearchAllDto>) {
        Object.assign(this, partial);
    }
}