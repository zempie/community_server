import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsDefined, IsEnum, IsOptional, ValidateNested } from "class-validator";
import { PostedAtCommunityDto } from "src/posted_at/dto/posted_at.dto";
import { PostType } from "../enum/post-posttype.enum";
import { Visibility } from "../enum/post-visibility.enum";
import { CreatePostsDto, PostAttatchmentFileDto } from "./create-posts.dto";
export class UpdatePostsDto {

    @ApiPropertyOptional({
        description: "포스팅 타입  SNS / BLOG",
        required: true,
        enum: PostType,
        enumName: "PostType"
    })
    @IsEnum(PostType)
    @IsOptional()
    post_state: PostType;

    @ApiPropertyOptional({ description: "첨부파일 - 해당 데이터로 덮어쓰기됩니다.", required: false, type: [PostAttatchmentFileDto] })
    @ValidateNested({ each: true })
    @Type(() => PostAttatchmentFileDto)
    @IsOptional()
    attatchment_files?: PostAttatchmentFileDto[];

    @ApiProperty({
        description: "내용",
        required: true
    })
    @IsDefined()
    post_contents: string;

    @ApiPropertyOptional({
        description: "공개(PUBLIC) / 비공개(PRIVATE) / 팔로워 공개(FOLLOWER)   default : PUBLIC",
        required: false,
        enum: Visibility,
        enumName: "Visibility"
    })
    @IsOptional()
    visibility?: Visibility;

    @ApiPropertyOptional({
        description: "해시태그",
        required: false
    })
    @IsOptional()
    @ValidateNested({ each: true })
    @Type(() => String)
    hashtags?: [string];

    @ApiPropertyOptional({
        description: "유저태그",
        required: false
    })
    @IsOptional()
    user_tagId?: string;

    // @ApiProperty({
    //     description: "좋아요 클릭 여부"
    // })
    // liked: boolean;

    @ApiPropertyOptional({
        description: "게임 페이지",
        required: false
    })
    @IsOptional()
    game_id?: string;

    @ApiPropertyOptional({
        description: "내 채널에 올린 경우 (해당 로그인 유저 채널)",
        required: false
    })
    @IsOptional()
    channel_id?: string;

    @ApiPropertyOptional({
        description: "데이터가 있을경우 기존 커뮤니티에서 대체됩니다",
        type: [PostedAtCommunityDto],
        required: false
    })
    @ValidateNested({ each: true })
    @Type(() => PostedAtCommunityDto)
    @IsOptional()
    community?: PostedAtCommunityDto[]
    // @ApiProperty({
    //     description: "커뮤니티에 올린경우 커뮤니티 id",
    //     required: false
    // })
    // community_id: string[];

    // @ApiProperty({
    //     description: "커뮤니티 채널에 올린 경우",
    //     required: false
    // })
    // community_channel_id: string;

    @ApiPropertyOptional({
        description: "포트폴리오에 올린 경우",
        required: false,
        type: [String]
    })
    @IsOptional()
    portfolio_ids?: string[];
}
