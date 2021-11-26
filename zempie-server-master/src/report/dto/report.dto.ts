import { ApiProperty } from "@nestjs/swagger";

export class ReportDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    user_id: number;

    @ApiProperty()
    post_id: string;

    @ApiProperty()
    comment_id: string;

    @ApiProperty({
        description: "1 || 2 || 3 || 4 || 5(text)"
    })
    report_reason: string;

    @ApiProperty()
    isDone: Boolean;
}
