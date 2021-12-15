import { ApiProperty } from "@nestjs/swagger";

export class UpdateCommunityChannelDto {
    @ApiProperty({
        description: "채널 이름"
    })
    title: string;

    @ApiProperty({
        description: "채널 설명"
    })
    description: string;

    @ApiProperty({
        description: "채널 프로필 이미지"
    })
    profile_img: string;

    @ApiProperty({
        description: "정렬"
    })
    sort: number;

    @ApiProperty({
        description: "비공개 여부 true/false default: false"
    })
    is_private: boolean;
}
