import { ApiProperty } from "@nestjs/swagger";

export class CreatePortfolioPostDTO {
    @ApiProperty({
        description: "상위 채널 id"
    })
    channel_id: string;

    @ApiProperty({
        description: "상위 포트폴리오 id"
    })
    portfolio_id: string;

    @ApiProperty({
        description: "포스팅 id"
    })
    post_id: string;
}
