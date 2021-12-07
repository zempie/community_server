import { ApiProperty } from "@nestjs/swagger";
import { targetType } from "../enum/reporttargettype.enum";

export class CreateReportPostDto {
    @ApiProperty({
        description: "신고자 id"
    })
    user_id: number;

    @ApiProperty({
        enum: targetType,
        enumName: "targetType",
        description: "신고 대상의 타입  댓글(COMMENT) / 포스트(POST) / 유저(USER)"
    })
    targetType: targetType;

    @ApiProperty({
        description: "포스팅 신고의 경우    포스트 id"
    })
    post_id: string;

    @ApiProperty({
        description: "신고 사유   1 || 2 || 3 || 4 || 5(text)"
    })
    report_reason: string;
}

export class CreateReportCommentDto {
    @ApiProperty({
        description: "신고자 id"
    })
    reporter_user_id: number;

    @ApiProperty({
        description: "댓글 신고의 경우   댓글 id"
    })
    comment_id: string;

    @ApiProperty({
        enum: targetType,
        enumName: "targetType",
        description: "신고 대상의 타입  댓글(COMMENT) / 포스트(POST) / 유저(USER)"
    })
    targetType: targetType;

    @ApiProperty({
        description: "신고 사유   1 || 2 || 3 || 4 || 5(text)"
    })
    report_reason: string;
}
