import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { ValidateNested } from "class-validator";
// import { Community } from "src/community/community.entity";
import { CommunityChannelBaseDto } from 'src/community/community-channel/dto/community-channel.dto'
import { CommunityShortDto } from "src/community/dto/community.dto";
import { GameDTO } from "src/game/game.model";

export class PostedAtCommunityDto {
    @ApiProperty()
    id: string;
    @ApiProperty()
    channel_id: string;
}

export class PostedAtGameDto {
    @ApiProperty()
    id: string;
}

export class PostedAtGameReturnDto{
    @Type(() => GameDTO)
    game:GameDTO

}

export class PoestedAtReturnDto {
    @ApiProperty({ type: CommunityShortDto })
    @ValidateNested({ each: true })
    @Type(() => CommunityShortDto)
    community: CommunityShortDto

    @ApiProperty({ type: CommunityChannelBaseDto })
    @ValidateNested({ each: true })
    @Type(() => CommunityChannelBaseDto)
    @ApiProperty()
    channel: CommunityChannelBaseDto

    constructor(partial: Partial<PoestedAtReturnDto>) {
        Object.assign(this, partial);
    }
}
export class PostedAtDto {
    @ApiProperty()
    id: string;

    @ApiProperty({
        description: "내 채널"
    })
    channel_id: string;

    //게임페이지에 올린경우
    @ApiProperty()
    @Type(() => PostedAtGameReturnDto)
    game: PostedAtGameReturnDto;

    @ApiProperty({ type: [PoestedAtReturnDto] })
    @ValidateNested({ each: true })
    @Type(() => PoestedAtReturnDto)
    community: PoestedAtReturnDto[];

    //포트폴리오에 추가한경우
    @ApiProperty({
        type: [Number]
    })
    portfolio_id?: number[];

    constructor(partial: Partial<PostedAtDto>) {
        Object.assign(this, partial);
    }
}

export class PostedAtSimpleDto {
    @ApiProperty()
    id: string;

    @ApiProperty({
        description: "내 채널"
    })
    channel_id: string;

    //게임페이지에 올린경우
    @ApiProperty()
    @Type(() => PostedAtGameDto)
    game: PostedAtGameDto[];

    @ApiProperty({ type: [PostedAtCommunityDto] })
    @ValidateNested({ each: true })
    @Type(() => PostedAtCommunityDto)
    community: PostedAtCommunityDto[];

    //포트폴리오에 추가한경우
    @ApiProperty({
        type: [Number]
    })
    portfolio_id?: number[];

    constructor(partial: Partial<PostedAtDto>) {
        Object.assign(this, partial);
    }
}
