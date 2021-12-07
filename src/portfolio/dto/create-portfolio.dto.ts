import { ApiProperty } from "@nestjs/swagger";

export class CreatePortfolioDto {
    @ApiProperty({
        description: "포트폴리오 제목"
    })
    title: string;

    @ApiProperty({
        description: "포트폴리오 설명"
    })
    description: string;

    @ApiProperty({
        description: "포트폴리오 썸네일 이미지"
    })
    thumbnail_img: string;

    @ApiProperty({
        description: "포트폴리오 공개 여부   default : true(공개)"
    })
    is_public: boolean;

    @ApiProperty({
        description: "작성자 id"
    })
    user_id: number;

    @ApiProperty({
        description: "포트폴리오 핀 여부  default : false"
    })
    is_pinned: boolean;
}
