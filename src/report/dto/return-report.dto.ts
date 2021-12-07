import { ApiProperty } from "@nestjs/swagger";

export class ReturnReportDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    user_id: number;

    @ApiProperty()
    user_uid: string;

    @ApiProperty()
    post_id: string;

    @ApiProperty()
    comment_id: string;

    @ApiProperty({
        description: "1 || 2 || 3 || 4 || 5(text)"
    })
    report_reason: string;

    @ApiProperty()
    is_read: boolean;
}
