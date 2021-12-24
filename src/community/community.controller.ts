import {
    BadRequestException,
    Body,
    Controller,
    ForbiddenException,
    Get,
    HttpException,
    HttpStatus,
    InternalServerErrorException,
    Param,
    Post,
    Put,
    Query,
    UsePipes,
    ValidationPipe
} from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { CurrentUser } from "../auth/user-auth-decorator";
import { UserAuthGuard, UserTokenCheckGuard } from "../auth/user-auth.guard";
import { BlockService } from "../block/block.service";
import { BlockType } from "../block/enum/blocktype.enum";
import { FollowService } from "../follow/follow.service";
import { User } from "../user/user.entity";
import { UserService } from "../user/user.service";
import { ChannelState } from "./community-channel/channelstate.enum";
import { CommunityChannelService } from "./community-channel/community-channel.service";
import { CommunityChannelBaseDto, CommunityChannelDto } from "./community-channel/dto/community-channel.dto";
import { CreateCommunityChannelDto } from "./community-channel/dto/create-community-channel.dto";
import { ReturnCommunityChannelDto } from "./community-channel/dto/returnchannel.dto";
import { UpdateCommunityChannelDto } from "./community-channel/dto/update-community-channel.dto";
import { CommunityJoinService } from "./community-join/community-join.service";
import { CommunityJoinBlockUserDto, CommunityJoinUserDto } from "./community-join/dto/community-join.dto";
import { JoinState } from "./community-join/enum/joinstate.enum";
import { JoinStatus } from "./community-join/enum/joinststus.enum";
import { CommunityService } from "./community.service";
import { ReturnCommunityDto, ReturnCommunityUidDto } from "./dto/return-community.dto";
import { CreateCommunityDto } from "./dto/create-community.dto";
import { CommunityState } from "./enum/communitystate.enum";
import { PostsService } from "src/posts/posts.service";
import { BaseQuery } from "src/abstract/base-query";
import { CommonInfoService } from "src/commoninfo/commoninfo.service";
import { ReturnCommunityJoinDto } from "./community-join/dto/return-community-join";
import { CommunityListDto } from "./dto/community-list.dto";
import { LikeService } from "src/like/like.service";
import { ZempieUseGuards } from "src/util/decorators/ZempieUseGaurd";
import { ReturnUser } from "src/user/dto/return-user.dto";
import { CommunityChannersQuery, CommunityChannersSort, CommunityDto } from "./dto/community.dto";
import { CustomQueryResult, CustomQueryResultResponseType } from "src/util/pagination-builder";
import { NotFoundException } from "@nestjs/common";
import { UserDto } from "src/user/dto/user.dto";
import { BlockDto } from "src/block/dto/block.dto";
import { SuccessReturnModel } from "src/abstract/base-model";
import { HashtagLogService } from "src/hashtag-log/hashtag-log.service";
import { Community } from "./community.entity";
import { ChannelPostService } from "src/channel-post/channel-post.service";
import { UpdateCommunityDto } from "./dto/update-community.dto";
import { FcmService } from "src/fcm/fcm.service";
import { FcmEnumType } from "src/fcm/fcm.enum";
import { CommunityVisitLogService } from "./community-visit-log/community-visit-log.service";
import { SearchKeywordLogService } from "src/search/search_keyword_log/search_keyword_log.service";
import { CommunityLogicService } from "./community.logic.service";
import { AdminFcmService } from "src/admin/fcm/admin.fcm.service";

@Controller("api/v1/community")
@ApiTags("api/v1/community")
export class CommunityController {
    constructor(
        private communityService: CommunityService,
        private communitychannelService: CommunityChannelService,
        private communityjoinService: CommunityJoinService,
        // private blockService: CommunityBlockService,
        private followService: FollowService,
        private blockService: BlockService,
        private userService: UserService,
        // private postsService: PostsService,
        // private likeService: LikeService,
        private commonInfoService: CommonInfoService,
        private hashtagLogService: HashtagLogService,
        private channelPostService: ChannelPostService,
        private fcmService: FcmService,
        private communityvisitLog: CommunityVisitLogService,
        private searchKeywordLogService: SearchKeywordLogService,
        private communityLogicService: CommunityLogicService,
        private adminFcmService: AdminFcmService
    ) { }

    @Get("/list")
    @ApiResponse({ status: 200, description: "성공 반환", type: [ReturnCommunityUidDto] })
    @ApiOperation({ description: "커뮤니티 보기, query - 대문자로 검색" })
    @ZempieUseGuards(UserTokenCheckGuard)
    async findCommunities(
        @CurrentUser() user: User,
        @Query() query: CommunityListDto
    ): Promise<ReturnCommunityUidDto[]> {
        
        const communityInfos = await this.communityService.findAll(query);
        const joinInfos = user !== null ? await this.communityjoinService.findbyUserId(user.id) : [];
        const result: ReturnCommunityUidDto[] = [];
        for await (const item of communityInfos.result) {
            const joinUser = joinInfos.find(commu => commu.community_id === item.id);
            const ownerInfo = await this.userService.findOne(item.owner_id);
            const managerInfo = await this.userService.findOne(item.manager_id);
            const submangerInfo = await this.userService.findOne(item.submanager_id);
            if (query.posting !== undefined) {
                await this.searchKeywordLogService.create(user ? user.id : null, query.posting);
            } else if (query.hashtag !== undefined) {
                await this.searchKeywordLogService.create(user ? user.id : null, query.hashtag);
            } else if (query.gametitle !== undefined) {
                await this.searchKeywordLogService.create(user ? user.id : null, query.gametitle);
            }

            result.push(
                new ReturnCommunityUidDto({
                    ...item,
                    owner_uid: ownerInfo ? ownerInfo.uid : null,
                    manager_uid: managerInfo ? managerInfo.uid : null,
                    submanager_uid: submangerInfo ? submangerInfo.uid : null,
                    is_private: item.state === CommunityState.PRIVATE ? true : false,
                    is_subscribed: joinUser !== undefined ? true : false,
                    is_certificated: item.is_certificated
                })
            );
        }
        return result;
    }

    @Get("/:community_id")
    @ApiResponse({ status: 200, description: "성공 반환" })
    @ApiOperation({ description: "커뮤니티 메인(블락 유저 진입 블락 정보 리턴)" })
    @ZempieUseGuards(UserTokenCheckGuard)
    @ApiResponse({ status: 404, description: "일치하는 커뮤니티 없음" })
    async communityMain(@CurrentUser() user: User, @Param("community_id") community_id: string) {
        if (user !== null) {
            await this.communityvisitLog.create(community_id, user.id);
        }

        const info = await this.communityService.findOne(community_id);
        if (info === null) {
            throw new NotFoundException();
        }

        const joinInfo = user !== null ? await this.communityjoinService.exist(user.id, info.id) : null;

        const re_info = new CommunityDto({
            ...info.get({ plain: true }),
            is_subscribed: joinInfo !== null ? (joinInfo.state === JoinState.ACTIVE ? true : false) : false,
            is_private: info.state === CommunityState.PRIVATE ? true : false,
        });
        if (user !== null) {
            const blockInfo = await this.blockService.findBlockedUser(user.id, community_id, BlockType.COMMUNITYBLOCK);
            if (blockInfo === null) {
                await this.communityService.addvisitCnt(community_id);
            } else {
                re_info.user_block = [new BlockDto({ ...blockInfo.get({ plain: true }) })];
            }
        }

        return re_info;
    }

    @Get("/:community_id/channels")
    @ApiOperation({ description: "해당 커뮤니티가 가진 채널 보기" })
    @ApiResponse({ status: 200, description: "정상반환", type: CustomQueryResultResponseType(CommunityChannelDto) })
    async communityChannels(
        @Param("community_id") community_id: string,
        @Query() query: CommunityChannersQuery
    ): Promise<CustomQueryResult<CommunityChannelDto>> {
        const inputSort = query.sort ? query.sort : CommunityChannersSort.ALPHABETIC;
        const list = await this.communitychannelService.findbyCommunityId(community_id, [
            inputSort === CommunityChannersSort.ALPHABETIC ? "title" : "sort",
            "ASC"
        ]);
        const totalCnt = list.totalCount;
        const page = (query.offset ? query.offset : 0) / (query.limit ? query.limit : 10) + 1;
        return {
            ...list,
            result: list.result.map((item, index) => ({
                ...item,
                sort: page * (index = 1)
            }))
        };
    }

    @Get(":community_id/members")
    @ApiResponse({ status: 200, description: "성공 반환", type: [ReturnCommunityJoinDto] })
    @ApiOperation({ description: "해당 커뮤니티의 가입 멤버 리스트" })
    @ApiResponse({ status: 200, description: "정상", type: CustomQueryResultResponseType(ReturnCommunityJoinDto) })
    @ZempieUseGuards(UserTokenCheckGuard)
    async memberList(
        @CurrentUser() user: User,
        @Param("community_id") community_id: string,
        @Query() query: BaseQuery
    ): Promise<CustomQueryResult<ReturnCommunityJoinDto>> {
        const joinInfo = await this.communityjoinService.find({
            where: {
                community_id: community_id
            },
            order: [["createdAt", "DESC"]],
            limit: query.limit ? query.limit : 20,
            offset: query.offset ? query.offset : 0,
            raw: true,
            include:[{
                model:User,
                where:{
                    deleted_at : null
                }
            }]
        });
        const userIds = joinInfo.result.map(item => item.user_id);
        const users = await this.userService.findByIds(joinInfo.result.map(item => item.user_id));
        const postCnts = userIds.length > 0 ? await this.channelPostService.cntUserPostCommunity(community_id, userIds) : []

        const result: ReturnCommunityJoinDto[] = joinInfo.result.map(item => {
            const userInfo = users.find(us => us.id === item.user_id);
            const postCntInfo = userInfo !== undefined ? postCnts.find(ps => ps.user_id === userInfo.id) : { cnt: 0 }
            return {
                id: item.user_id,
                uid: userInfo ? userInfo.uid : null,
                email: userInfo ? userInfo.email : null,
                name: userInfo ? userInfo.name : null,
                // nickName: userInfo.na
                channel_id: userInfo ? userInfo.channel_id : null,
                profile_img: userInfo ? userInfo.picture : null,
                createdAt: item.createdAt,
                community_id: item.community_id,
                status: item.status,
                state: item.state,
                post_cnt: postCntInfo?.cnt ?? 0
            };
        });

        return {
            ...joinInfo,
            result: await this.commonInfoService.setCommonInfo(result, user)
        };
    }

    @Post(":community_id/designation/manager")
    @ApiOperation({ description: "매니저 지정" })
    @ZempieUseGuards(UserAuthGuard)
    async setManager(
        @CurrentUser() user: User,
        @Param("community_id") community_id: string,
        @Query("user_id") user_id: number
    ): Promise<CommunityJoinUserDto> {
        const communityInfo = await this.communityService.findOne(community_id);

        if (communityInfo === null) {
            throw new NotFoundException();
        }
        const userJoin = await this.communityjoinService.findwithCommunityId(user_id, community_id);
        if (user.id !== communityInfo.owner_id || userJoin === undefined) {
            throw new BadRequestException();
        }
        await this.communityLogicService.setManager(communityInfo, userJoin)

        const authorTokenInfo = await this.fcmService.getTokenByUserId(userJoin.user_id);
        await this.fcmService.sendFCM(
            authorTokenInfo,
            "Invite & Accept Community Manager",
            `${user.name} invited you to collaborate on the ${communityInfo.name} community`,
            FcmEnumType.USER,
            communityInfo.id
        );

        const result = await this.communityjoinService.findwithCommunityId(user.id, communityInfo.id);

        const userInfo = await this.userService.findOne(userJoin.user_id);
        return new CommunityJoinUserDto({
            ...result.get({ plain: true }),
            user: userInfo
        });
    }

    @Post()
    @ApiResponse({ status: 200, description: "성공 반환", type: ReturnCommunityDto })
    @ApiOperation({ description: "커뮤니티 생성" })
    @ZempieUseGuards(UserAuthGuard)
    async createCommunity(@CurrentUser() user: User, @Body() data: CreateCommunityDto): Promise<ReturnCommunityDto> {
        let managerId;
        if (!data.community_manager_id) {
            managerId = data.owner_id;
        } else {
            managerId = data.community_manager_id;
        }
        const result = await this.communityLogicService.createCommunity(data, managerId);
        await this.adminFcmService.sendFCM(
            "Report",
            `${user.name} created ${result.name} community`,
            FcmEnumType.ADMIN,
            result.id
        )
        return result;
    }

    @Put(":community_id")
    @ApiResponse({ status: 200, description: "성공 반환", type: ReturnCommunityDto })
    @ApiOperation({ description: "커뮤니티 수정" })
    @ZempieUseGuards(UserAuthGuard)
    async updateCommunity(
        @CurrentUser() user: User,
        @Param("community_id") community_id: string,
        @Body() data: UpdateCommunityDto
    ): Promise<ReturnCommunityDto> {
        const community = await this.communityService.findOne(community_id);
        if (community === null) {
            throw new NotFoundException();
        } else if (user.id !== Number(community.owner_id) && user.id !== Number(community.manager_id)) {
            throw new HttpException("BAD_REQUEST", HttpStatus.BAD_REQUEST);
        }
        return await this.communityLogicService.updateCommunity(community, data);
    }

    @Post(":community_id/channel")
    @ApiResponse({ status: 200, description: "성공 반환", type: ReturnCommunityChannelDto })
    @ApiOperation({ description: "채널 생성" })
    @ZempieUseGuards(UserAuthGuard)
    //     state가 private인 경우에는 관리자에게만 보이고, 관리자만 작성이 가능
    //     일반 유저는 작성 불가능
    async createCommunityChannels(
        @CurrentUser() user: User,
        @Param("community_id") community_id: string,
        @Body() data: CreateCommunityChannelDto
    ): Promise<ReturnCommunityChannelDto> {
        const community = await this.communityService.findOne(community_id);
        if (community === null) {
            throw new NotFoundException();
        } else if (user.id !== Number(community.owner_id) && user.id !== Number(community.manager_id)) {
            throw new HttpException("BAD_REQUEST", HttpStatus.BAD_REQUEST);
        }
        return await this.communityLogicService.createCommunityChannels(data, community, user.id)
    }

    @Get(":community_id/channel/:channel_id")
    @ApiResponse({ status: 200, description: "성공 반환", type: CommunityChannelDto })
    @ApiOperation({ description: "채널 정보" })
    async communityChannel(
        @Param("community_id") community_id: string,
        @Param("channel_id") channel_id: string
    ): Promise<CommunityChannelBaseDto> {
        const channel = await this.communitychannelService.findOne(channel_id);
        if (channel === null) {
            throw new NotFoundException();
        } else if (channel.community_id !== community_id) {
            throw new NotFoundException();
        }
        return new CommunityChannelBaseDto({ ...channel.get({ plain: true }) });
    }

    @Post(":community_id/channel/:channel_id")
    @ApiResponse({ status: 200, description: "성공 반환", type: CommunityChannelDto })
    @ApiOperation({ description: "채널 수정" })
    @ZempieUseGuards(UserAuthGuard)
    async updateCommunityChannels(
        @CurrentUser() user: User,
        @Param("community_id") community_id: string,
        @Param("channel_id") channel_id: string,
        @Body() data: UpdateCommunityChannelDto
    ): Promise<CommunityChannelBaseDto> {
        const community = await this.communityService.findOne(community_id);
        if (community === null) {
            throw new NotFoundException("일치하는 커뮤니티가 없습니다.");
        }
        const channelInfo = await this.communitychannelService.findOne(channel_id);

        if (channelInfo === null) {
            throw new NotFoundException("일치하는 채널이 없습니다.");
        }
        if (user.id !== Number(community.owner_id) && user.id !== Number(community.manager_id)) {
            throw new HttpException("BAD_REQUEST", HttpStatus.BAD_REQUEST);
        }
        return await this.communityLogicService.updateCommunityChannels(community_id, channelInfo.id, data);
    }

    @Post(":community_id/channel/:channel_id/remove")
    @ApiResponse({ status: 200, description: "성공 반환", type: Boolean })
    @ApiOperation({ description: "채널 삭제" })
    @ZempieUseGuards(UserAuthGuard)
    async Channeldelete(
        @CurrentUser() user: User,
        @Param("community_id") community_id: string,
        @Param("channel_id") channel_id: string
    ): Promise<SuccessReturnModel> {
        const community = await this.communityService.findOne(community_id);
        if (community === null) {
            throw new NotFoundException();
        }
        else if (user.id !== Number(community.owner_id) && user.id !== Number(community.manager_id)) {
            throw new ForbiddenException("해당 커뮤니티에 권한이 없습니다.");
        }
        const result = await this.communityLogicService.channeldelete(community_id, channel_id)
        await this.adminFcmService.sendFCM(
            "Report",
            `${user.name} created ${community.name} community`,
            FcmEnumType.ADMIN,
            community.id
        )
        return result
    }

    @Get(":community_id/members/block")
    @ApiOperation({ description: "해당 커뮤니티의 블락 리스트" })
    @ApiResponse({ status: 200, description: "정상", type: CustomQueryResultResponseType(CustomQueryResult) })
    @ZempieUseGuards(UserTokenCheckGuard)
    async findBlockBycommunityId(
        @CurrentUser() user: User,
        @Param("community_id") community_id: string,
        @Query() query: BaseQuery
    ): Promise<CustomQueryResult<CommunityJoinBlockUserDto>> {
        const JoinInfos = await this.communityjoinService.findCommunityBlockUser(
            community_id,
            JoinState.BLOCK,
            query.offset ? query.offset : 0,
            query.limit ? query.limit : 10
        );

        const result: CommunityJoinBlockUserDto[] = [];

        for await (const item of JoinInfos.result) {
            const commonInfo = user !== null ? await this.commonInfoService.commonInfos(item.user_id, user.id) : null;
            const userInfo = await this.userService.findOne(item.user_id);
            if (commonInfo !== null) {
                delete commonInfo.user;
            }
            result.push(
                new CommunityJoinBlockUserDto({
                    id: userInfo.id,
                    uid: userInfo.uid,
                    email: userInfo.email,
                    name: userInfo.name,
                    ...(commonInfo as any),
                    community_id: item.community_id,
                    status: item.status,
                    state: item.state,
                    createdAt: item.createdAt as any
                })
            );
        }

        return {
            ...JoinInfos,
            result: result
        };
    }

    @Get(":community_id/members/kick")
    @ApiResponse({ status: 200, description: "성공 반환", type: [ReturnUser] })
    @ApiOperation({ description: "해당 커뮤니티의 강퇴 리스트" })
    @ZempieUseGuards(UserTokenCheckGuard)
    async findKickBycommunityId(
        @CurrentUser() user: User,
        @Param("community_id") community_id: string,
        @Query() query: BaseQuery
    ): Promise<ReturnUser[]> {
        const JoinInfos = await this.communityjoinService.findCommunityBlockUser(
            community_id,
            JoinState.KICK,
            query.offset ? query.offset : 0,
            query.limit ? query.limit : 10
        );
        const result: ReturnUser[] = [];

        for await (const item of JoinInfos.result) {
            const commonInfo = await this.commonInfoService.commonInfos(item.user_id, user.id);
            result.push({
                status: item.status,
                state: item.state,
                ...item,
                ...commonInfo
            });
        }

        return result;
    }

    @Put(":community_id/channel/:removed_channel_id/remove/:combined_channel_id")
    @ApiOperation({ description: "채널 합치기" })
    @ZempieUseGuards(UserAuthGuard)
    async channelCombine(
        @Param("community_id") community_id: string,
        @Param("removed_channel_id") removed_channel_id: string,
        @Param("combined_channel_id") combined_channel_id: string,
        @CurrentUser() user: User
    ): Promise<SuccessReturnModel> {
        const communityInfo = await this.communityService.findOne(community_id);
        if (communityInfo === null) {
            throw new NotFoundException();
        } else if (
            communityInfo.owner_id !== user.id &&
            communityInfo.manager_id !== user.id &&
            communityInfo.submanager_id !== user.id
        ) {
            throw new NotFoundException();
        }

        return await this.communityLogicService.channelCombine(community_id, removed_channel_id, combined_channel_id)
    }

    @Post(":community_id/member/:user_id/block")
    @ApiResponse({ status: 200, description: "성공 반환", type: [ReturnCommunityJoinDto] })
    @ApiResponse({ status: 401, description: "관리자가 아닐 경우" })
    @ApiOperation({ description: "커뮤니티 유저 블락, user_id : 블락유저 아이디" })
    @ApiResponse({ status: 200, description: "블랙 해제", type: ReturnCommunityJoinDto })
    @ZempieUseGuards(UserTokenCheckGuard)
    async communityBlock(
        @CurrentUser() user: User,
        @Param("community_id") community_id: string,
        @Param("user_id") user_id: number
    ) {
        const community = await this.communityService.findOne(community_id);
        const joinInfo = await this.communityjoinService.findwithCommunityId(user_id, community_id);
        if (!joinInfo) {
            throw new NotFoundException("가입된 유저가 아닙니다.");
        }

        if (user.id !== (community.owner_id || user.id !== community.manager_id) || joinInfo === null) {
            throw new HttpException("UNAUTHORIZED", HttpStatus.UNAUTHORIZED);
        }
        return await this.communityLogicService.communityBlock(community_id, user_id);
    }

    @Post(":community_id/member/:user_id/unblock")
    @ApiResponse({ status: 200, description: "성공 반환", type: Boolean })
    @ApiResponse({ status: 401, description: "관리자가 아닐 경우" })
    @ApiOperation({ description: "커뮤니티 유저 블락 해제" })
    @ApiResponse({ status: 200, description: "블랙 해제", type: ReturnCommunityJoinDto })
    @ZempieUseGuards(UserAuthGuard)
    async userunBlock(
        @CurrentUser() user: User,
        @Param("community_id") community_id: string,
        @Param("user_id") user_id: number
    ): Promise<UserDto> {
        const community = await this.communityService.findOne(community_id);
        const userInfo = await this.userService.findOne(user_id);
        if (community === null || userInfo === null) {
            throw new NotFoundException();
        }
        if (user.id !== Number(community.owner_id) && user.id !== Number(community.manager_id)) {
            throw new HttpException("UNAUTHORIZED", HttpStatus.UNAUTHORIZED);
        }
        return await this.communityLogicService.userUnBlock(userInfo, community_id);
    }

    @Post(":community_id/subscribe")
    @ApiResponse({ status: 200, description: "성공 반환", type: Boolean })
    @ApiResponse({ status: 400, description: "이미 가입했을 경우" })
    @ApiOperation({ description: "해당 커뮤니티 구독(가입개념)" })
    @ApiResponse({ status: 200, description: "성공", type: SuccessReturnModel })
    @ZempieUseGuards(UserAuthGuard)
    @UsePipes(new ValidationPipe({ whitelist: false, transform: true }))
    async subscribe(
        @CurrentUser() user: User,
        @Query("user_id") user_id: number,
        @Param("community_id") community_id: string
    ) {
        const data = { user_id, community_id };
        const exist = await this.communityjoinService.exist(user_id, community_id);
        if (exist) {
            throw new BadRequestException("이미 구독중입니다.");
        } else if (user.id !== Number(user_id)) {
            throw new HttpException("BAD_REQUEST", HttpStatus.BAD_REQUEST);
        }
        await this.communityService.setSubscribeCnt(community_id, true);
        return {
            success: await this.communityjoinService.createJoin({
                ...data,
                status: JoinStatus.MEMBER
            })
        };
    }

    @Post(":community_id/unsubscribe")
    @ApiResponse({ status: 200, description: "성공 반환", type: Boolean })
    @ApiResponse({ status: 400, description: "본인이 id가 아닐 경우" })
    @ApiResponse({ status: 404, description: "가입 정보가 없을 경우" })
    @ApiOperation({ description: "해당 커뮤니티 구독 취소" })
    @ApiResponse({ status: 200, description: "성공", type: SuccessReturnModel })
    @ZempieUseGuards(UserAuthGuard)
    @UsePipes(new ValidationPipe({ whitelist: false, transform: true }))
    async unsubscribe(
        @CurrentUser() user: User,
        @Query("user_id") user_id: number,
        @Param("community_id") community_id: string
    ): Promise<SuccessReturnModel> {
        const exist = await this.communityjoinService.exist(user_id, community_id);
        if (user.id !== Number(user_id)) {
            throw new HttpException("BAD_REQUEST", HttpStatus.BAD_REQUEST);
        }
        if (!exist) {
            throw new HttpException("NOT_FOUND", HttpStatus.NOT_FOUND);
        }
        await this.communityService.setSubscribeCnt(community_id, false);
        return {
            success: await this.communityjoinService.deletejoin(user_id, community_id)
        };
    }

    @Post(":community_id/remove")
    @ApiResponse({ status: 200, description: "성공 반환", type: Boolean })
    @ApiResponse({ status: 401, description: "권한 없음" })
    @ApiOperation({ description: "해당 커뮤니티 삭제" })
    @ZempieUseGuards(UserAuthGuard)
    @UsePipes(new ValidationPipe({ whitelist: false, transform: true }))
    async delete(@CurrentUser() user: User, @Param("community_id") community_id: string): Promise<SuccessReturnModel> {
        const community = await this.communityService.findOne(community_id);

        if (community === null) {
            throw new NotFoundException();
        } else if (user.id !== community.manager_id && user.id !== community.submanager_id) {
            throw new HttpException("UNAUTHORIZED", HttpStatus.UNAUTHORIZED);
        } else {
            await this.communityService.delete(community_id);
            return { success: true }
        }
    }

    @Post(":community_id/member/:user_id/kick")
    @ApiResponse({ status: 200, description: "성공 반환", type: CommunityJoinUserDto })
    @ApiResponse({ status: 404, description: "가입한 유저가 없을 경우" })
    @ApiOperation({ description: "해당 커뮤니티의 멤버를 커뮤니티에서 강퇴" })
    @ZempieUseGuards(UserAuthGuard)
    async CommunityKick(
        @Param("user_id") user_id: number,
        @Param("community_id") community_id: string,
        @CurrentUser() user: User
    ): Promise<CommunityJoinUserDto> {
        const joinUser = await this.communityjoinService.exist(user_id, community_id);
        const isAdmin = await this.communityService.isAdmin(user.id, community_id);
        if (!joinUser) {
            throw new HttpException("NOT_FOUND", HttpStatus.NOT_FOUND);
        } else if (!isAdmin) {
            throw new ForbiddenException("해당 커뮤니티에 권한이 없습니다.");
        }

        return await this.communityLogicService.communityKick(user_id, community_id, joinUser);
    }

    @Post(":community_id/member/:user_id/unkick")
    @ApiResponse({ status: 200, description: "성공 반환", type: CommunityJoinUserDto })
    @ApiResponse({ status: 404, description: "가입한 유저가 없거나, 강퇴된 유저가 아닌 경우" })
    @ApiOperation({ description: "강퇴 해제" })
    @ZempieUseGuards(UserAuthGuard)
    async CommunityunKick(
        @Param("user_id") user_id: number,
        @Param("community_id") community_id: string,
        @CurrentUser() user: User
    ): Promise<CommunityJoinUserDto> {
        const joinUser = await this.communityjoinService.exist(user_id, community_id);
        const kickedUser = await this.blockService.findBlockedUser(user_id, community_id, BlockType.KICK);
        const isAdmin = await this.communityService.isAdmin(user.id, community_id);
        if (!joinUser || !kickedUser) {
            throw new HttpException("NOT_FOUND", HttpStatus.NOT_FOUND);
        } else if (!isAdmin) {
            throw new ForbiddenException("해당 커뮤니티에 권한이 없습니다.");
        }
        return await this.communityLogicService.communityUnKick(kickedUser, joinUser)
    }

    @Get("/:community_id/tag/count/")
    @ApiOperation({ description: "특정 커뮤니티 유저들이 사용한 각 해시태그의 사용 횟수" })
    async tagCountByCommunity(@Param("community_id") community_id: string): Promise<{ text: string; cnt: number }[]> {
        const communityInfo = await this.communityService.findOne(community_id);
        if (communityInfo === null) {
            throw new NotFoundException();
        }
        const jointList = await this.communityjoinService.findbyCommunityId(community_id);
        if (jointList === null) {
            throw new NotFoundException();
        } else if (jointList.length === 0) {
            return [];
        }
        const list = (await this.hashtagLogService.countList(jointList.map(item => item.user_id))) as any;

        return list.map(item => ({ text: item.text, cnt: item.cnt }));
    }
}
