import { ApiProperty } from "@nestjs/swagger";

export class CreateGamePostDto {
    @ApiProperty({
        description: "게임 id"
    })
    game_id: string;

    @ApiProperty({
        description: "포스팅 id"
    })
    post_id: string;
}