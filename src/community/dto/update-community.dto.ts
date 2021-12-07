import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsString, IsOptional, IsNumber, IsUrl, Max, Length } from "class-validator";

export class UpdateCommunityDto {
    @ApiPropertyOptional({
        description: "커뮤니티 이름"
    })
    @IsString()
    @IsOptional()
    @Length(1,50)
    community_name: string;

    @ApiPropertyOptional({
        description: "커뮤니티 설명"
    })
    @IsString()
    @IsOptional()
    @Length(1, 200)
    community_desc: string;

    @ApiPropertyOptional({
        description: "매니저 id"
    })
    @IsNumber()
    @IsOptional()
    community_manager_id: number;

    @ApiPropertyOptional({
        description: "부 매니저 id"
    })
    @IsNumber()
    @IsOptional()
    community_sub_manager_id: number;

    @ApiPropertyOptional({
        description: "커뮤니티 프로필 이미지"
    })
    @IsUrl()
    @IsOptional()
    community_profile_img: string;

    @ApiPropertyOptional({
        description: "커뮤니티 배너 이미지"
    })
    @IsUrl()
    @IsOptional()
    community_banner_img: string;
}
