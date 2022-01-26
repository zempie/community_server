import { ApiProperty } from "@nestjs/swagger";
import { GameDTO } from "src/game/game.model";
import { PostsDto } from "src/posts/dto/posts.dto";

export class SearchHashtagDto {
    @ApiProperty({
        description: "게임"
    })
    game: GameDTO[];

    @ApiProperty({
        description: "포스팅"
    })
    posts: PostsDto[];
}
