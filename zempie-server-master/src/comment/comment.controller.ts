import { BadRequestException, Body, Controller, Get, HttpException, HttpStatus, Param, Post } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { CommentService } from "./comment.service";
import { ReportService } from "src/report/report.service";
import { ReturnReportDto } from "src/report/dto/return-report.dto";
import { CreateReportCommentDto } from "src/report/dto/create-report.dto";
import { CurrentUser } from "src/auth/user-auth-decorator";
import { User } from "src/user/user.entity";
import { targetType } from "src/report/enum/reporttargettype.enum";
import { ZempieUseGuards } from "src/util/decorators/ZempieUseGaurd";
import { UserAuthGuard } from "src/auth/user-auth.guard";
import { AdminFcmService } from "src/admin/fcm/admin.fcm.service";
import { UserService } from "src/user/user.service";
import { FcmEnumType } from "src/fcm/fcm.enum";

@Controller("api/v1/comment")
@ApiTags("api/v1/comment")
export class CommentController {
    constructor(
        private commentService: CommentService,
        private reportService: ReportService,
        private adminFcmService: AdminFcmService,
        private userService: UserService,
    ) { }

    @Get("comment")
    @ApiResponse({ status: 200, description: "성공 반환" })
    @ZempieUseGuards(UserAuthGuard)
    async findComments(@CurrentUser() user: User) {
        console.log(user.id, user.uid);

        return await this.commentService.findAll();
    }

    @Post(":comment_id")
    @ApiResponse({ status: 200, description: "성공 반환", type: ReturnReportDto })
    @ApiOperation({ description: "댓글 신고, return {...user_uid} : 신고자 uid" })
    @ApiResponse({ status: 200, description: "처리완료", type: ReturnReportDto })
    @ZempieUseGuards(UserAuthGuard)
    async reportComment(
        @CurrentUser() user: User,
        @Param("comment_id") comment_id: string,
        @Body() data: CreateReportCommentDto
    ): Promise<ReturnReportDto> {
        const eixstComment = await this.commentService.findOne(comment_id);
        if (!eixstComment) {
            throw new HttpException("NOT_FOUND", HttpStatus.NOT_FOUND);
        }
        const check = await this.reportService.existCommentreport(user.id, comment_id)
        if (check !== null) {
            throw new BadRequestException("이미 신고한적이 있습니다.")
        }
        const report = await this.reportService.createCommmentreport({
            ...data,
            comment_id: comment_id,
            reporter_user_id: user.id,
            targetType: targetType.COMMENT
        });
        const writerInfo = await this.userService.findOne(eixstComment.user_id);
        await this.adminFcmService.sendFCM(
            "Report",
            `${writerInfo.name} reported for this ${data.report_reason}`,
            FcmEnumType.ADMIN,
            report.id
        )

        return {
            ...report,
            user_uid: user.uid,
            is_read: false
        };
    }
}
