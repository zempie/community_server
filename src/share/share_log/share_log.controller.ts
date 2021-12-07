import { Controller, Get, NotFoundException, Param, Post } from "@nestjs/common";
import { ApiTags, ApiResponse, ApiOperation } from "@nestjs/swagger";
import { SuccessReturnModel } from "src/abstract/base-model";
import { CurrentUser } from "src/auth/user-auth-decorator";
import { UserTokenCheckGuard } from "src/auth/user-auth.guard";
import { PostsService } from "src/posts/posts.service";
import { User } from "src/user/user.entity";
import { UserService } from "src/user/user.service";
import { ZempieUseGuards } from "src/util/decorators/ZempieUseGaurd";
import { ShareLogDto } from "./dto/return-share-log.dto";
import { ShareType } from "./enum/sharetype.enum";
import { ShareLogService } from "./share_log.service";

@Controller("api/v1/share")
@ApiTags("api/v1/share")
export class ShareLogController {
    constructor(
        private shareLogService: ShareLogService,
        private postsService: PostsService,
        private userService: UserService
    ) {}

    @Post("/:post_id")
    @ApiResponse({ status: 200, description: "성공 반환" })
    @ApiOperation({ description: "포스팅 공유하기" })
    @ZempieUseGuards(UserTokenCheckGuard)
    async createPostshare(@Param("post_id") post_id: string, @CurrentUser() user: User): Promise<SuccessReturnModel> {
        const post = await this.postsService.findOne(post_id);
        if (post === null) {
            throw new NotFoundException("일치하는 포스팅이 없습니다.");
        }
        await this.postsService.shareCnt(post_id, true);
        await this.shareLogService.create(user.id, post_id, ShareType.POST);

        return { success: true };
    }

    @Get("/:post_id")
    @ApiResponse({ status: 200, description: "성공 반환" })
    @ApiOperation({ description: "포스팅 공유 정보" })
    async countPostshare(@Param("post_id") post_id: string): Promise<ShareLogDto> {
        const post = await this.postsService.findOne(post_id);
        if (post === null) {
            throw new NotFoundException("일치하는 포스팅이 없습니다.");
        }
        const shareInfo = await this.shareLogService.findByPostId(post_id);
        const userInfo: User[] = [];
        for (const item of shareInfo.rows) {
            userInfo.push(await this.userService.findOne(item.user_id));
        }
        return {
            object: post,
            type: ShareType.POST,
            count: shareInfo.count,
            user: userInfo
        };
    }
}
