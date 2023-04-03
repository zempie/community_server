import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsEmpty, IsEnum, IsNotEmpty, ValidateNested, IsArray, IsString } from "class-validator";
import { File } from "src/file/file.dto";
import { Game } from "src/game/game.entity";
import { PostedAtCommunityDto, PostedAtGameDto } from "src/posted_at/dto/posted_at.dto";
import { PostMetadataDto } from "src/post_metadata/dto/post_metadata.dto";
import { PostType } from "../enum/post-posttype.enum";
import { PostStatus } from "../enum/post-status.enum";
import { Visibility } from "../enum/post-visibility.enum";

export enum PostFileType {
    IMAGE = "image",
    YOUTUBE_LINK = "youtube_link",
    SOUND = "sound",
    VIDEO = "video"
}
export class PostAttatchmentFileDto extends File {
    @ApiProperty({
        description: "파일 타입",
        enum: PostFileType,
        enumName: "PostFileType"
    })
    @IsEnum(PostFileType)
    type: PostFileType;
}
export class CreatePostsDto {
    // @ApiProperty({
    //     description: "작성자 uid",
    //     required: true
    // })
    // @IsNotEmpty()
    user_uid: string;

    @ApiProperty({
        description: "포스팅 타입  SNS / BLOG",
        required: true,
        enum: PostType,
        enumName: "PostType"
    })
    @IsEnum(PostType)
    post_state: PostType;

    @ApiProperty({ description: "첨부파일", required: false, type: [PostAttatchmentFileDto] })
    @ValidateNested({ each: true })
    @Type(() => PostAttatchmentFileDto)
    attatchment_files?: PostAttatchmentFileDto[];

    @ApiProperty({
        description: "내용",
        required: true
    })
    @IsNotEmpty()
    post_contents: string;

    @ApiProperty({
        description: "공개(PUBLIC) / 비공개(PRIVATE) / 팔로워 공개(FOLLOWER)   default : PUBLIC",
        required: false,
        enum: Visibility,
        enumName: "Visibility"
    })
    visibility: Visibility;

    @ApiProperty({
        description: "해시태그",
        required: false
    })

    @IsArray()
    // @IsString()
    @ApiProperty({ description: "해쉬태그", required: false, type: [String] })
    @Type(() => String)
    hashtags: string[];

    @ApiProperty({
        description: "유저태그",
        required: false
    })
    user_tagId: string;

    // @ApiProperty({
    //     description: "좋아요 클릭 여부"
    // })
    // liked: boolean;

    @ApiProperty({
        type: [PostedAtGameDto],
        description: "게임 페이지",
        required: false
    })
    @Type(() => PostedAtGameDto)
    game?: PostedAtGameDto[];

    @ApiProperty({
        description: "내 채널에 올린 경우 (해당 로그인 유저 채널)",
        required: false
    })
    channel_id?: string;

    @ApiProperty({
        type: [PostedAtCommunityDto],
        required: false
    })
    @ValidateNested({ each: true })
    @Type(() => PostedAtCommunityDto)
    community?: PostedAtCommunityDto[];
    // @ApiProperty({
    //     description: "커뮤니티에 올린경우 커뮤니티 id",
    //     required: false
    // })
    // community_id: string[];ㅈ

    // @ApiProperty({
    //     description: "커뮤니티 채널에 올린 경우",
    //     required: false
    // })
    // community_channel_id: string;

    @ApiProperty({
        description: "포트폴리오에 올린 경우",
        required: false,
        type: [String]
    })
    portfolio_ids?: string[];

    @ApiProperty({
        description: "예약 포스팅 인지 아닌지(예약 포스팅이 아닌 경우 null, 예약 포스팅인 경우 예약 시간)",
        required: false
    })
    scheduled_for?: number;

    @ApiProperty({
        description: "메타 데이터 저장 할 url",
        required: false
    })
    metadata?: PostMetadataDto;

}

export class CreatePosts {
    user_id: number;

    post_state: PostType;

    attatchment_files?: PostAttatchmentFileDto[];

    post_contents: string;

    visibility: Visibility;

    hashtags?: string[];

    user_tagId?: string;

    // liked: boolean;

    game?: PostedAtGameDto[];

    channel_id?: string;

    community?: PostedAtCommunityDto[];

    portfolio_ids?: string[];

    scheduled_for?: number;

    status?: PostStatus;

    is_retweet?: boolean;

    retweet_id?: string;

    metadata?: PostMetadataDto;

}


export class UpdatePosts extends CreatePosts {
    like_cnt?: number;

    comment_cnt?: number;

    read_cnt?: number;
}