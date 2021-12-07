import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsEmpty, IsEnum, IsNumber, IsOptional, IsString, IsUUID, ValidateNested } from "class-validator";
import { PostType } from "../enum/post-posttype.enum";
import { PostStatus } from "../enum/post-status.enum";
import { Visibility } from "../enum/post-visibility.enum";
import { File } from "src/file/dto/file.dto";
import { User } from "src/user/user.entity";
import { UserDto } from "src/user/dto/user.dto";
import { PostAttatchmentFileDto } from "./create-posts.dto";
import { PostedAtDto } from "src/posted_at/dto/posted_at.dto";

export class PostsDto {
    @ApiProperty()
    id: string;

    @ApiProperty({ type: UserDto })
    @IsEmpty({ always: true })
    user: UserDto;

    @ApiProperty()
    @IsEnum(PostType)
    post_type: PostType;

    @ApiProperty({ type: PostAttatchmentFileDto, isArray: true })
    @ValidateNested({ each: true })
    @Type(() => PostAttatchmentFileDto)
    attatchment_files?: PostAttatchmentFileDto[];

    @ApiProperty()
    content: string;

    @ApiProperty({ enum: Visibility, enumName: "Visibility" })
    visibility: Visibility;

    @ApiProperty()
    hashtags: string[];

    @ApiProperty()
    user_tag: UserDto[];

    @ApiProperty()
    liked: boolean;

    @ApiProperty()
    like_cnt: number;

    @ApiProperty()
    comment_cnt: number;

    @ApiProperty()
    read_cnt: number;

    @ApiProperty()
    shared_cnt: number;

    @ApiProperty()
    scheduled_for: string;

    @ApiProperty({ enum: PostStatus, enumName: "PostStatus" })
    status: PostStatus;

    @ApiProperty()
    is_retweet: boolean;

    @ApiProperty()
    is_pinned: boolean;

    @ApiProperty({ type: PostedAtDto })
    @IsEmpty({ always: true })
    posted_at?: PostedAtDto;

    constructor(partial: Partial<PostsDto>) {
        this.liked = partial.liked ? partial.liked : false;
        this.is_pinned = partial.is_pinned ? partial.is_pinned : false;
        this.is_retweet = partial.is_retweet ? (typeof (partial.is_retweet) === "boolean" ? partial.is_retweet : (partial.is_retweet === 1 ? true : false)) : false;
        partial.is_retweet = this.is_retweet;
        if(partial.is_retweet === true){
            partial.content = null;
        }
        Object.assign(this, partial);
    }
}


export class PostOutDto {
    @ApiProperty()
    @IsUUID()
    id: string;

    @ApiProperty()
    @IsUUID()
    community_id: string;

    @ApiProperty()
    @IsString({ groups: ["1", "2", "3", "4", "5"] })
    report_reason: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    report_text?: string;

    @ApiPropertyOptional()
    @IsOptional()
    created_at?: number;

    @ApiProperty()
    @IsNumber()
    user_id: number;
}