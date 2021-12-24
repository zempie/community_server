import { BadRequestException, ClassSerializerInterceptor, Controller, Get, UseInterceptors } from "@nestjs/common";
import { Param, Query, UsePipes, ValidationPipe } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { CurrentUser } from "src/auth/user-auth-decorator";
import { UserTokenCheckGuard } from "src/auth/user-auth.guard";
import { CommonInfoService } from "src/commoninfo/commoninfo.service";
import { CommunityJoin } from "src/community/community-join/community-join.entity";
import { CommunityJoinService } from "src/community/community-join/community-join.service";
import { ReturnCommunityJoinDto } from "src/community/community-join/dto/return-community-join";
import { SearchKeywordLogService } from "src/search/search_keyword_log/search_keyword_log.service";
import { User } from "src/user/user.entity";
import { UserService } from "src/user/user.service";
import { ZempieUseGuards } from "src/util/decorators/ZempieUseGaurd";
import { CustomQueryResult, CustomQueryResultResponseType } from "src/util/pagination-builder";
import { FollowDto } from "./dto/follow.dto";
import { FollowListQueryDTO } from "./dto/query-dto";
import { FollowService } from "./follow.service";

@Controller("api/v1/user")
@ApiTags("api/v1/user")
export class FollowController {
    constructor(
        private followService: FollowService,
        private commonInfoService: CommonInfoService,
        private communityJoinService: CommunityJoinService,
        private userService: UserService,
        private searchKeywordLogService: SearchKeywordLogService
    ) { }

    @UseInterceptors(ClassSerializerInterceptor)
    @Get("/:user_id/list/following")
    @ApiResponse({ status: 200, description: "정상", type: CustomQueryResultResponseType(FollowDto) })
    @ApiResponse({ status: 400, description: "잘못된 유저 id 일 경우" })
    @ApiOperation({ description: "특정 유저의 팔로우 리스트" })
    @UsePipes(new ValidationPipe({ whitelist: false, transform: true }))
    @ZempieUseGuards(UserTokenCheckGuard)
    async followList(
        @Query() query: FollowListQueryDTO,
        @Param("user_id") user_id: number,
        @CurrentUser() user: User
    ): Promise<CustomQueryResult<FollowDto>> {
        if (isNaN(user_id)) {
            throw new BadRequestException();
        }
        if (query.search !== undefined) {
            await this.searchKeywordLogService.create(user ? user.id : null, query.search);
        }

        let joinInfo: CommunityJoin[] = [];
        const { limit, offset, search } = query;
        const list = await this.followService.findQuery(limit, offset, true, user_id, search);
        if (list.totalCount === 0) {
            return list;
        }
        list.result = await this.commonInfoService.setCommonInfo(list.result, user);

        for (const item of list.result) {
            joinInfo = await this.communityJoinService.findbyUserId(item.id);
            const users = await this.userService.findByIds(joinInfo.map(item => item.user_id));
            const communityInfo: ReturnCommunityJoinDto[] = joinInfo.map(item => {
                const userInfo = users.find(us => us.id === item.user_id) ?? { uid: null, email: null, name: null, channel_id: null, picture: null };
                return {
                    id: item.user_id,
                    uid: userInfo.uid,
                    email: userInfo.email,
                    name: userInfo.name,
                    // nickName: userInfo.na
                    channel_id: userInfo.channel_id,
                    profile_img: userInfo.picture,
                    createdAt: item.createdAt,
                    community_id: item.community_id,
                    status: item.status,
                    state: item.state
                };
            });
            item.community = communityInfo;
        }

        return list;
    }

    @UseInterceptors(ClassSerializerInterceptor)
    @Get("/:user_id/list/follower")
    @ApiResponse({ status: 200, description: "정상", type: CustomQueryResultResponseType(FollowDto) })
    @ApiResponse({ status: 400, description: "잘못된 유저 id 일 경우" })
    @ApiOperation({ description: "특정 유저의 팔로워 리스트" })
    @UsePipes(new ValidationPipe({ whitelist: false, transform: true }))
    @ZempieUseGuards(UserTokenCheckGuard)
    async followwerList(
        @Query() query: FollowListQueryDTO,
        @Param("user_id") user_id: number,
        @CurrentUser() user: User
    ): Promise<CustomQueryResult<FollowDto>> {
        if (isNaN(user_id)) {
            throw new BadRequestException();
        }
        if (query.search !== undefined) {
            await this.searchKeywordLogService.create(user ? user.id : null, query.search);
        }

        let joinInfo: CommunityJoin[] = [];
        const { limit, offset, search } = query;
        const list = await this.followService.findQuery(limit, offset, false, user_id, search);

        if (list.totalCount === 0) {
            return list;
        }
        list.result = await this.commonInfoService.setCommonInfo(list.result, user);
        for (const item of list.result) {
            joinInfo = await this.communityJoinService.findbyUserId(item.id);
            const users = await this.userService.findByIds(joinInfo.map(item => item.user_id));
            const communityInfo: ReturnCommunityJoinDto[] = joinInfo.map(item => {
                const userInfo = users.find(us => us.id === item.user_id) ?? { uid: null, email: null, name: null, channel_id: null, picture: null };
                return {
                    id: item.user_id,
                    uid: userInfo.uid,
                    email: userInfo.email,
                    name: userInfo.name,
                    // nickName: userInfo.na
                    channel_id: userInfo.channel_id,
                    profile_img: userInfo.picture,
                    createdAt: item.createdAt,
                    community_id: item.community_id,
                    status: item.status,
                    state: item.state
                };
            });
            item.community = communityInfo;
        }

        return list;
    }
}
