import {
    Body,
    Controller,
    Delete,
    ForbiddenException,
    HttpException,
    HttpStatus,
    Get,
    Param,
    Post,
    Put,
    Query,
    UsePipes,
    ValidationPipe,
    BadRequestException,
    ClassSerializerInterceptor,
    UseInterceptors,
    NotFoundException
} from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { Op } from "sequelize";
import { UserAuthGuard, UserTokenCheckGuard } from "src/auth/user-auth.guard";
import { CustomQueryResult } from "src/util/pagination-builder";
import { FollowService } from "src/follow/follow.service";
import { ReturnFollowDto, ReturnUnFollowDto } from "src/follow/return-follow.dto";
import { TagUsersDto } from "./dto/tag-users.dto";
import { User } from "./user.entity";
import { UserService } from "./user.service";
import { CommunityJoinService } from "src/community/community-join/community-join.service";
import { CommunityService } from "src/community/community.service";
import { CommunityChannersSort, CommunityDto } from "src/community/dto/community.dto";
import { BlockService } from "src/block/block.service";
import { PortfolioService } from "src/portfolio/portfolio.service";
import { CreatePortfolioDto } from "src/portfolio/dto/create-portfolio.dto";
import { PortfolioDto } from "src/portfolio/dto/portfolio.dto";
import { ZempieUseGuards } from "src/util/decorators/ZempieUseGaurd";
import { ReturnUser } from "./dto/return-user.dto";
import { BlockType } from "src/block/enum/blocktype.enum";
import { PostsService } from "src/posts/posts.service";
import { LikeService } from "src/like/like.service";
import { CommonInfoService } from "src/commoninfo/commoninfo.service";
import { CurrentUser } from "src/auth/user-auth-decorator";
import { HashtagLogService } from "src/hashtag-log/hashtag-log.service";
import { SuccessReturnModel } from "src/abstract/base-model";
import { UserSortDto } from "./dto/user-sort.dto";
import { FcmEnumType } from "src/fcm/fcm.enum";
import { FcmService } from "src/fcm/fcm.service";
import { SearchKeywordLogService } from "src/search/search_keyword_log/search_keyword_log.service";
import { NotificationService } from "src/notification/notification.service";
import { eNotificationType } from "src/notification/enum/notification.enum";



@Controller("api/v1/user")
@ApiTags("api/v1/user")
export class UserController {
    constructor(
        private userService: UserService,
        private followService: FollowService,
        private communityJoinService: CommunityJoinService,
        private communityService: CommunityService,
        private blockService: BlockService,
        private portfolioService: PortfolioService,
        private postsService: PostsService,
        private likeService: LikeService,
        private commonInfoService: CommonInfoService,
        private fcmService: FcmService,
        private notificationService: NotificationService,

    ) {}

    @Get(":user_id/totalPost")
    @ApiOperation({ description: "해당 유저의 포스팅 갯수" })
    async usertotalPost(@Param("user_id") user_id: number): Promise<Number> {
        const postsInfo = await this.postsService.findbyUserId(user_id);
        return postsInfo.count;
    }

    @UseInterceptors(ClassSerializerInterceptor)
    @Get(":user_id/list/userblock")
    @ApiOperation({ description: "해당 유저의 블락 리스트, user_id" })
    @ZempieUseGuards(UserAuthGuard)
    async userBlockList(@CurrentUser() user: User, @Param("user_id") user_id: number): Promise<ReturnUser[]> {
        const blockInfos = await this.blockService.findByUserId(user_id, BlockType.USERBLOCK);
        const result: ReturnUser[] = [];

        for await (const item of blockInfos) {
            const commonInfo = await this.commonInfoService.commonInfos(item.target_id, user.id);
            result.push({
                ...commonInfo
            });
        }

        return result;
    }

    @UseInterceptors(ClassSerializerInterceptor)
    @Get(":user_id/list/usermute")
    @ApiOperation({ description: "해당 유저의 뮤트 리스트, user_id" })
    @ZempieUseGuards(UserAuthGuard)
    async userMuteList(@CurrentUser() user: User, @Param("user_id") user_id: number): Promise<ReturnUser[]> {
        const muteInfos = await this.blockService.findByUserId(user_id, BlockType.MUTE);
        const result: ReturnUser[] = [];

        for await (const item of muteInfos) {
            const commonInfo = await this.commonInfoService.commonInfos(item.target_id, user.id);
            result.push({
                ...commonInfo
            });
        }

        return result;
    }

    @Get(":user_id/list/portfolio")
    @ApiOperation({ description: "해당 유저의 포트폴리오 리스트" })
    async userPortfolioList(@Param("user_id") user_id: number): Promise<PortfolioDto[]> {
        return await this.portfolioService.findByUserId(user_id);
    }

    @Get(":user_id/list/community") // TODO - 검색 키워드 저장 -> posting,hashtag,gametitle로 조건이 있을경우(각각 한개씩)
    @ApiOperation({ description: "해당 유저가 가입한 커뮤니티 리스트" })
    async userCommunityList(@Query() sort: UserSortDto, @Param("user_id") user_id: number): Promise<CommunityDto[]> {
        const joinInfo = await this.communityJoinService.findbyUserId(user_id);
        const commuIds = joinInfo.map(id => id.community_id);
        return await this.communityService.findByIds(commuIds, sort.sort);
    }

    @Post(":user_id/follow")
    @ApiOperation({ description: "유저 팔로우 하기, user_id: 팔로우 할 유저 아이디" })
    @ZempieUseGuards(UserAuthGuard)
    async followUser(@CurrentUser() user: User, @Param("user_id") user_id: number): Promise<ReturnFollowDto> {
        const userInfo = await this.userService.findOne(user_id);
        if (userInfo === null) {
            throw new NotFoundException("일치하는 유저가 없습니다.");
        }
        const checkBlock = await this.blockService.findBlockedUserByMe(user.id, user_id, BlockType.USERBLOCK);
        if (checkBlock !== null) {
            throw new BadRequestException("블락 처리한 유저는 팔로우 할 수 없습니다.");
        }
        const checkFollow = await this.followService.findfollow(user.id, user_id);

        if (checkFollow.length === 0) {
            const follow = await this.followService.create({
                user_id: user.id,
                follow_id: user_id
            });
            const authorTokenInfo = await this.fcmService.getTokenByUserId(user_id);
            await this.fcmService.sendFCM(
                authorTokenInfo,
                "Follow",
                `${user.name} followed you.`,
                FcmEnumType.USER,
                follow.id
            );

           const result = await this.notificationService.create({
                user_id:user.id,
                target_user_id: user_id,
                content:'',
                target_id:userInfo.uid,
                type:eNotificationType.follow
                
            })
        }

        return new ReturnFollowDto({
            ...(await this.commonInfoService.commonInfos(user_id, user.id))
        });
    }

    @Post(":user_id/unfollow")
    @ApiOperation({ description: "팔로우 취소, user_id: 팔로우 취소 할 유저 아이디" })
    @ZempieUseGuards(UserAuthGuard)
    async unfollowUser(@CurrentUser() user: User, @Param("user_id") user_id: number): Promise<ReturnUnFollowDto> {
        await this.followService.deletefollow(user.id, user_id);

        return new ReturnUnFollowDto({
            ...(await this.commonInfoService.commonInfos(user_id, user.id))
        });
    }

    @Post(":user_id/portfolio")
    @ApiOperation({ description: "포트폴리오 생성" })
    @ZempieUseGuards(UserAuthGuard)
    async createPortfolio(
        @CurrentUser() user: User,
        @Param("user_id") user_id: number,
        @Body() data: CreatePortfolioDto
    ) {
        if (user.id !== Number(user_id)) {
            throw new HttpException("BAD_REQUEST", HttpStatus.BAD_REQUEST);
        }
        return await this.portfolioService.create({
            ...data,
            user_id: user_id
        });
    }

    @Delete(":user_id/portfolio/:portfolio_id/delete")
    @ApiOperation({ description: "포트폴리오 삭제" })
    @ZempieUseGuards(UserAuthGuard)
    async deletePortfolio(
        @CurrentUser() user: User,
        @Param("user_id") user_id: number,
        @Param("portfolio_id") portfolio_id: string
    ): Promise<SuccessReturnModel> {
        if (user.id !== Number(user_id)) {
            throw new HttpException("BAD_REQUEST", HttpStatus.BAD_REQUEST);
        }
        await this.portfolioService.delete(portfolio_id);
        return { success: true };
    }

    @Get("/mine")
    @ZempieUseGuards(UserAuthGuard)
    async mine(@CurrentUser() user: User) {
        const User = await this.userService.findOne(user.id);
        if (!User) {
            throw new ForbiddenException();
        }
        return User;
    }
}

@Controller("api/v1/tag")
@ApiTags("api/v1/tag")
export class TagController {
    constructor(
        private userService: UserService,
        private hashtagLogService: HashtagLogService,
        private searchKeywordLogService: SearchKeywordLogService
    ) {}

    @Get("users")
    @ApiOperation({ description: "태그를 위한 유저 검색" })
    @UsePipes(new ValidationPipe({ whitelist: false, transform: true }))
    @ZempieUseGuards(UserTokenCheckGuard)
    async findUsersForTag(@CurrentUser() user: User, @Query() query: TagUsersDto): Promise<CustomQueryResult<User>> {
        if (query.search === undefined) {
            return {
                result: [],
                pageInfo: {
                    hasNextPage: false
                },
                totalCount: 0
            };
        }

        await this.searchKeywordLogService.create(user ? user.id : null, query.search);
        return await this.userService.find({
            where: {
                name: { [Op.like]: `%${query.search}%` }
            },
            limit: query.limit ? query.limit : 5,
            offset: query.offset ? query.offset : 0
        });
    }

    @Get("all/count")
    @ApiOperation({ description: "전체 유저가 사용한 각 해시태그의 사용 횟수" })
    async tagCountAll(): Promise<{ text: string; cnt: number }[]> {
        const list = (await this.hashtagLogService.countList()) as any;
        return list.map(item => ({ text: item.text, cnt: item.cnt }));
    }

    @Get("count/:user_id")
    @ApiOperation({ description: "해당 유저가 사용한 각 해시태그의 사용 횟수" })
    async tagCountByUserId(@Param("user_id") user_id: string): Promise<{ text: string; cnt: number }[]> {
        if (isNaN(Number(user_id))) {
            throw new NotFoundException();
        }
        const list = (await this.hashtagLogService.countList(Number(user_id))) as any;
        return list.map(item => ({ text: item.text, cnt: item.cnt }));
    }
}
