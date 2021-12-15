import { ApiProperty } from "@nestjs/swagger";

export class PortfolioDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    title: string;

    @ApiProperty()
    description: string;

    @ApiProperty()
    thumbnail_img: string;

    @ApiProperty()
    is_public: boolean;

    @ApiProperty()
    user_id: number;

    @ApiProperty()
    is_pinned: boolean;
}
