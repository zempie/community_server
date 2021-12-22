import { ApiProperty } from "@nestjs/swagger";
import { Game } from "src/game/game.entity";
import { PostsDto } from "src/posts/dto/posts.dto";
import { Posts } from "src/posts/posts.entity";

export class SearchHashtagDto {
    @ApiProperty({
        description: "게임"
    })
    game: Game[];

    @ApiProperty({
        description: "포스팅"
    })
    posts: PostsDto[];
}
