import { Controller, Delete, Get, HttpException, HttpStatus, Param, Post, Put } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { CurrentUser } from "src/auth/user-auth-decorator";
import { UserAuthGuard } from "src/auth/user-auth.guard";
import { CommonInfoService } from "src/commoninfo/commoninfo.service";
import { FollowService } from "src/follow/follow.service";
import { User } from "src/user/user.entity";
import { UserService } from "src/user/user.service";
import { ZempieUseGuards } from "src/util/decorators/ZempieUseGaurd";
import { BlockService } from "./block.service";
import { ReturnBlockDto } from "./dto/return-block.dto";
import { BlockType } from "./enum/blocktype.enum";

@Controller("api/v1/member")
@ApiTags("api/v1/member")
export class BlockController {
    constructor(
        private blockService: BlockService,
        private followService: FollowService,
        private userService: UserService,
        private commonInfoService: CommonInfoService
    ) { }

    @Post(":user_id/block")
    @ApiResponse({ status: 200, description: "성공 반환", type: ReturnBlockDto })
    @ApiOperation({ description: "유저 블락, user_id:블락 할 유저 아이디" })
    @ZempieUseGuards(UserAuthGuard)
    async userBlock(@CurrentUser() user: User, @Param("user_id") user_id: number): Promise<ReturnBlockDto> {
        const checkBlock = await this.blockService.findBlockedUserByMe(user.id, user_id, BlockType.USERBLOCK);
        await this.followService.deletefollow(user.id, user_id);
        await this.followService.deletefollow(user_id, user.id)
        if (checkBlock === null) {
            const block = await this.blockService.createUserBlock({
                user_id: user.id,
                target_id: user_id,
                type: BlockType.USERBLOCK
            });
        }
        
        return new ReturnBlockDto({ ...(await this.commonInfoService.commonInfos(user_id, user.id)) });
    }

    @Post(":user_id/unblock")
    @ApiResponse({ status: 200, description: "성공 반환", type: ReturnBlockDto })
    @ApiOperation({ description: "유저 블락, user_id:블락 할 유저 아이디" })
    @ZempieUseGuards(UserAuthGuard)
    async userUnblock(@CurrentUser() user: User, @Param("user_id") user_id: number): Promise<ReturnBlockDto> {
        const checkBlock = await this.blockService.findBlockedUserByMe(user.id, user_id, BlockType.USERBLOCK);
        console.log("!?!?!?!?!");
        console.log(checkBlock);
        
        if (checkBlock !== null) {
            await this.blockService.delete(checkBlock.id)
        }

        return new ReturnBlockDto({ ...(await this.commonInfoService.commonInfos(user_id, user.id)) });
    }

    @Post(":user_id/mute")
    @ApiResponse({ status: 200, description: "성공 반환", type: ReturnBlockDto })
    @ApiOperation({ description: "유저 뮤트, user_id:뮤트 할 유저 아이디" })
    @ZempieUseGuards(UserAuthGuard)
    async userMute(@CurrentUser() user: User, @Param("user_id") user_id: number): Promise<ReturnBlockDto> {
        const existUser = await this.userService.findOne(user_id);
        if (existUser === null) {
            throw new HttpException("유저가 존재하지 않습니다.", HttpStatus.NOT_FOUND);
        }
        const checkMute = await this.blockService.findBlockedUserByMe(user.id, user_id, BlockType.MUTE);
        if (checkMute === null) {
            const mute = await this.blockService.createUserBlock({
                user_id: user.id,
                target_id: user_id,
                type: BlockType.MUTE
            });
        }
        return new ReturnBlockDto({ ...(await this.commonInfoService.commonInfos(user_id, user.id)) });
    }

    @Post(":user_id/unmute")
    @ApiResponse({ status: 200, description: "성공 반환", type: ReturnBlockDto })
    @ApiOperation({ description: "유저 뮤트, user_id:뮤트 할 유저 아이디" })
    @ZempieUseGuards(UserAuthGuard)
    async userUnMute(@CurrentUser() user: User, @Param("user_id") user_id: number): Promise<ReturnBlockDto> {
        const existUser = await this.userService.findOne(user_id);
        if (existUser === null) {
            throw new HttpException("유저가 존재하지 않습니다.", HttpStatus.NOT_FOUND);
        }
        const checkMute = await this.blockService.findBlockedUserByMe(user.id, user_id, BlockType.MUTE);

        if (checkMute !== null) {
            await this.blockService.delete(checkMute.id);
        }
        return new ReturnBlockDto({ ...(await this.commonInfoService.commonInfos(user_id, user.id)) });
    }
}
