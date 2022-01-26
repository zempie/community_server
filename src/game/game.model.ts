import { ApiProperty } from "@nestjs/swagger";
import { BaseQuery } from "src/abstract/base-query";
import { UserDto } from "src/user/dto/user.dto";

export class GameDTO {
    @ApiProperty()
    id: number;

    @ApiProperty()
    user: UserDto;

    @ApiProperty()
    activated: boolean;

    @ApiProperty()
    enabled: boolean;

    @ApiProperty()
    official: boolean;

    @ApiProperty()
    category: boolean;

    @ApiProperty()
    user_id: number;

    @ApiProperty()
    pathname: string;

    @ApiProperty()
    title: string;

    @ApiProperty()
    description: string;

    @ApiProperty()
    version: string;

    @ApiProperty()
    control_type: string;

    @ApiProperty()
    hashtags: string;

    @ApiProperty()
    count_start: number;

    @ApiProperty()
    count_over: number;

    @ApiProperty()
    count_heart: number;

    @ApiProperty()
    url_game: string;

    @ApiProperty()
    url_thumb: string;

    @ApiProperty()
    url_thumb_webp: string;

    @ApiProperty()
    url_thumb_gif: string;

    @ApiProperty()
    created_at: Date;

    @ApiProperty()
    updated_at: Date;

    @ApiProperty()
    deleted_at: Date;

    constructor(partial: Partial<GameDTO>) {
        Object.assign(this, partial);
    }
}