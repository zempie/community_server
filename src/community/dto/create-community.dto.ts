import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsNumber, IsOptional, IsString, IsUrl, Max } from "class-validator";
import { CommunityState } from "../enum/communitystate.enum";

export class CreateCommunityDto {
    @ApiProperty({
        description: "생성자 id"
    })
    owner_id: number;

    @ApiProperty({
        description: "커뮤니티 이름"
    })
    community_name: string;

    @ApiProperty({
        description: "커뮤니티 주소",
        nullable: true
    })
    community_url: string;

    @ApiProperty({
        description: "커뮤니티 설명"
    })
    community_desc: string;

    @ApiProperty({
        description: "매니저 id"
    })
    community_manager_id: number;

    @ApiProperty({
        description: "부 매니저 id"
    })
    community_sub_manager_id: number;

    @ApiProperty({
        description: "커뮤니티 프로필 이미지"
    })
    community_profile_img: string;

    @ApiProperty({
        description: "커뮤니티 배너 이미지"
    })
    community_banner_img: string;

    @ApiProperty({
        enum: CommunityState,
        enumName: "CommunityState",
        description: "공개(false) / 비공개(true)(default: 공개)",
        nullable: true
    })
    community_state: CommunityState;
}