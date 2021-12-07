import { Controller, Delete, Get, Param, Post, Query } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { SuccessReturnModel } from "src/abstract/base-model";
import { CurrentUser } from "src/auth/user-auth-decorator";
import { UserTokenCheckGuard } from "src/auth/user-auth.guard";
import { User } from "src/user/user.entity";
import { UserService } from "src/user/user.service";
import { ZempieUseGuards } from "src/util/decorators/ZempieUseGaurd";
import { FcmDto, FcmSaveQuery } from "./dto/fcm.dto";
import { FcmService } from "./fcm.service";

@Controller("api/v1/fcm")
@ApiTags("api/v1/fcm")
export class FcmController {
    constructor(private fcmService: FcmService, private userService: UserService) { }

    @Get("/:user_id")
    @ApiResponse({ status: 200, description: "성공 반환" })
    @ApiOperation({ description: "유저 토큰 정보 보기" })
    @ZempieUseGuards(UserTokenCheckGuard)
    async findUserToken(@CurrentUser() user: User, @Param("user_id") user_id: number) {
        const userInfo = await this.userService.findOne(user_id);
        const tokenInfo = await this.fcmService.findOneByUserId(user_id);

        return {
            ...userInfo,
            ...tokenInfo
        };
    }

    @Post("/:user_id")
    @ApiResponse({ status: 200, description: "성공 반환" })
    @ApiOperation({ description: "유저 토큰 저장" })
    @ZempieUseGuards(UserTokenCheckGuard)
    async createUserToken(
        @CurrentUser() user: User,
        @Param("user_id") user_id: number,
        @Query() query: FcmSaveQuery
    ): Promise<FcmDto> {
        const newtoken = await this.fcmService.create(user_id, query.token);
        const userInfo = await this.userService.findOne(user_id);
        newtoken.token
        return new FcmDto({
            user: userInfo,
            ...newtoken.get({ plain: true })
        });
    }

    @Post("/:user_id/remove")
    @ApiResponse({ status: 200, description: "성공 반환" })
    @ApiOperation({ description: "유저 토큰 삭제" })
    @ZempieUseGuards(UserTokenCheckGuard)
    async DeleteUserToken(@CurrentUser() user: User, @Param("user_id") user_id: number): Promise<SuccessReturnModel> {
        await this.fcmService.deletebyUserId(user_id);
        return { success: true };
    }
}
