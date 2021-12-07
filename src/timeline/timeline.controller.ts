import {
    BadRequestException,
    Controller,
    Get,
    HttpException,
    HttpStatus,
    NotFoundException,
    Param,
    Post,
    Query,
    UseGuards
} from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { Sequelize } from "sequelize";
import { Op } from "sequelize";
import { FindAndCountOptions } from "sequelize/types";
import { SuccessReturnModel } from "src/abstract/base-model";
import { CurrentUser } from "src/auth/user-auth-decorator";
import { UserAuthGuard, UserTokenCheckGuard } from "src/auth/user-auth.guard";
import { ChannelPostService } from "src/channel-post/channel-post.service";
import { ChannelTimelineService } from "src/channel-post/channel-timeline.service";
import { ChannelPostType } from "src/channel-post/enum/channelposttype.enum";
import { CommonInfoService } from "src/commoninfo/commoninfo.service";
import { CommunityJoinService } from "src/community/community-join/community-join.service";
import { JoinStatus } from "src/community/community-join/enum/joinststus.enum";
import { FollowService } from "src/follow/follow.service";
import { GameTimelineService } from "src/game/game-post/game-post-timeline.service";
import { GamePostService } from "src/game/game-post/game-post.service";
import { GameService } from "src/game/game.service";
import { LikeService } from "src/like/like.service";
import { PortfolioTimelineService } from "src/portfolio/portfolio-post/portfolio-post-timeline.service";
import { PortfolioPostService } from "src/portfolio/portfolio-post/portfolio-post.service";
import { PortfolioService } from "src/portfolio/portfolio.service";
import { PostedAtDto } from "src/posted_at/dto/posted_at.dto";
import { PostedAtService } from "src/posted_at/posted_at.service";
import { PostsDto } from "src/posts/dto/posts.dto";
import { PostType } from "src/posts/enum/post-posttype.enum";
import { Visibility } from "src/posts/enum/post-visibility.enum";
import { Posts } from "src/posts/posts.entity";
import { PostsService } from "src/posts/posts.service";
import { SearchKeywordLogService } from "src/search/search_keyword_log/search_keyword_log.service";
import { UserDto } from "src/user/dto/user.dto";
import { User } from "src/user/user.entity";
import { UserService } from "src/user/user.service";
import { ZempieUseGuards } from "src/util/decorators/ZempieUseGaurd";
import { CustomQueryResult, CustomQueryResultResponseType } from "src/util/pagination-builder";
import { TimelineHashTagQueryDto } from "./dto/timeline-hashtag-query.dto";
import { TimelineListQueryDTO } from "./dto/timeline-sort.dto";
import { TimeLineMediaFilter, TimeLineSort } from "./enum/timeline-sort.enum";

@Controller("api/v1/timeline")
@ApiTags("api/v1/timeline")
export class TimelineController {
    constructor(
        private postService: PostsService,
        private communityJoinService: CommunityJoinService,
        private channelTimelineService: ChannelTimelineService,
        private gamePostTimeLineService: GameTimelineService,
        private userService: UserService,
        private followService: FollowService,
        private gameService: GameService,
        private channelPostService: ChannelPostService,
        private commoninfoService: CommonInfoService,
        private postedAtService: PostedAtService,
        private likeService: LikeService,
        private gamePostService: GamePostService,
        private portfolioPostService: PortfolioPostService,
        private searchKeywordLogService: SearchKeywordLogService
    ) { }

    @Get("posts")
    @ApiOperation({ description: "특정 해쉬태그 포스트 검색" })
    @ApiResponse({ status: 200, schema: CustomQueryResultResponseType(PostsDto) })
    @ZempieUseGuards(UserTokenCheckGuard)
    async postHashTagSearch(
        @Query() query: TimelineHashTagQueryDto,
        @CurrentUser() user: User
    ): Promise<CustomQueryResult<PostsDto>> {
        let whereIn: any = {
            visibility: Visibility.PUBLIC,
            // hashtags: { [Op.like]: `%${query.hashtag}%` },
            hashtags: { [Op.regexp]: Sequelize.literal(`'(${query.hashtag})'`) }
            // like_cnt: { [Op.gte]: 30 }
        };
        const inputWhere: FindAndCountOptions = {
            where: whereIn,
            limit: query.limit,
            offset: query.offset,
            order: [["createdAt", "DESC"]]
        };
        await this.searchKeywordLogService.create(user ? user.id : null, query.hashtag);
        const list = await this.postService.find(inputWhere);
        const postedAtInfos = await this.postedAtService.findByPostsId(list.result.map(item => item.id));
        const likeList =
            user !== null
                ? await this.likeService.findByPostIds(
                    list.result.map(item => item.id),
                    user.id,
                    true
                )
                : [];
        return {
            ...list,
            result: list.result.map(item => {
                const findPostedAtInfo = postedAtInfos.find(pa => pa.posts_id === item.id);
                const likeData = likeList.find(li => li.post_id === item.id);
                return new PostsDto({
                    ...item,
                    liked: likeData !== undefined ? true : false,
                    posted_at: new PostedAtDto({ ...findPostedAtInfo.get({ plain: true }) }),
                    is_pinned: null
                });
            })
        };
    }

    @Get(":community_id/post")
    @ApiOperation({ description: "전체 커뮤니티 타임라인" })
    @ApiResponse({ status: 200, schema: CustomQueryResultResponseType(PostsDto) })
    @ZempieUseGuards(UserTokenCheckGuard)
    async communityTimeLines(
        @Param("community_id") community_id: string,
        @Query() query: TimelineListQueryDTO,
        @CurrentUser() user: User
    ): Promise<CustomQueryResult<PostsDto>> {
        let whereIn: any = {
            community_id: community_id
            // type: ChannelPostType.COMMUNITY,
            // visibility: Visibility.PUBLIC,
            // like_cnt: { [Op.gte]: 30 }
        };
        let whereInclude: any = [];
        const inputWhere: FindAndCountOptions = {
            where: whereIn,
            limit: query.limit,
            offset: query.offset,
            order: [["createdAt", "DESC"]],
            include: whereInclude
        };

        if (query.sort && query.sort === TimeLineSort.POPULAR) {
            inputWhere.order = [["like_cnt", "DESC"]];
        }

        if (query.media) {
            const setInfo = _setMediaFilter(whereIn, whereInclude, query.media);
            whereIn = setInfo.whereIn;
            inputWhere.include = setInfo.whereInclude;
        }

        const list = await this.channelTimelineService.find(inputWhere);
        const postInfo = await this.postService.findIds(list.result.map(item => item.post_id));
        const users = await this.userService.findByIds(postInfo.map(item => item.user_id));
        const setUsers = await this.commoninfoService.setCommonInfo(
            users.map(item => item.get({ plain: true }) as User),
            user
        );
        const postedAtInfos = await this.postedAtService.findByPostsId(postInfo.map(item => item.id));
        const likeList =
            user !== null
                ? await this.likeService.findByPostIds(
                    list.result.map(item => item.post_id),
                    user.id,
                    true
                )
                : [];
        return {
            ...list,
            result: list.result.map(item => {
                const findInfo = postInfo.find(po => po.id === item.post_id);
                const userInfo = setUsers.find(us => us.id === findInfo.user_id);
                const findPostedAtInfo = postedAtInfos.find(pa => pa.posts_id === findInfo.id);
                const likeData = likeList.find(li => li.post_id === item.post_id);
                return new PostsDto({
                    ...findInfo,
                    liked: likeData !== undefined ? true : false,
                    user: new UserDto({ ...userInfo }),
                    posted_at: new PostedAtDto({ ...findPostedAtInfo.get({ plain: true }) }),
                    is_pinned: item.is_pinned
                });
            })
        };
    }

    @Get(":community_id/channel/:channel_id")
    @ApiOperation({ description: "특정 커뮤니티 채널 타임라인" })
    @ApiResponse({ status: 200, schema: CustomQueryResultResponseType(PostsDto) })
    @ZempieUseGuards(UserTokenCheckGuard)
    async communityChannelTimeLines(
        @Param("community_id") community_id: string,
        @Param("channel_id") channel_id: string,
        @Query() query: TimelineListQueryDTO,
        @CurrentUser() user: User
    ): Promise<CustomQueryResult<PostsDto>> {
        let whereIn: any = {
            community_id: community_id,
            channel_id: channel_id,
            type: ChannelPostType.COMMUNITY,
            visibility: Visibility.PUBLIC
        };
        let whereInclude = [];
        const inputWhere: FindAndCountOptions = {
            where: whereIn,
            limit: query.limit,
            offset: query.offset,
            order: [["createdAt", "DESC"]],
            include: whereInclude
        };

        if (query.sort && query.sort === TimeLineSort.POPULAR) {
            inputWhere.order = [["like_cnt", "DESC"]];
        }

        if (query.media) {
            const setInfo = _setMediaFilter(whereIn, whereInclude, query.media);
            whereIn = setInfo.whereIn;
            inputWhere.include = setInfo.whereInclude;
        }
        const list = await this.channelTimelineService.find(inputWhere);
        const postInfo = await this.postService.findIds(list.result.map(item => item.post_id));

        const users = await this.userService.findByIds(postInfo.map(item => item.user_id));
        const setUsers = await this.commoninfoService.setCommonInfo(
            users.map(item => item.get({ plain: true }) as User),
            user
        );
        const postedAtInfos = await this.postedAtService.findByPostsId(postInfo.map(item => item.id));

        const likeList =
            user !== null
                ? await this.likeService.findByPostIds(
                    list.result.map(item => item.post_id),
                    user.id,
                    true
                )
                : [];

        return {
            ...list,
            result: list.result.map(item => {
                const findInfo = postInfo.find(po => po.id === item.post_id);
                const userInfo = setUsers.find(us => us.id === findInfo.user_id);
                const findPostedAtInfo = postedAtInfos.find(pa => pa.posts_id === findInfo.id);
                const likeData = likeList.find(li => li.post_id === item.post_id);
                return new PostsDto({
                    ...findInfo,
                    liked: likeData !== undefined ? true : false,
                    user: new UserDto({ ...userInfo }),
                    posted_at: new PostedAtDto({ ...findPostedAtInfo.get({ plain: true }) }),
                    is_pinned: item.is_pinned
                });
            })
        };
    }

    @Get("channel/:channel_id")
    @ApiResponse({ status: 200, schema: CustomQueryResultResponseType(PostsDto) })
    @ApiOperation({ description: "유저 채널 타임라인, Query 대문자 입력" })
    @ZempieUseGuards(UserTokenCheckGuard)
    async timelineUserChannel(
        @CurrentUser() user: User,
        @Param("channel_id") channel_id: string,
        @Query() query: TimelineListQueryDTO
    ) {
        const userInfo = await this.userService.findOneByChannelId(channel_id);
        let orList = [];
        let whereIn: any = {
            // channel_id: channel_id,
            // type: ChannelPostType.USER,
            // visibility: Visibility.PUBLIC
            [Op.or]: orList
        };
        let whereInclude = [];
        let userChannelWhere: any = {
            channel_id: channel_id,
            type: ChannelPostType.USER,
            // visibility: Visibility.PUBLIC
            visibility: {
                [Op.not]: Visibility.PRIVATE
            }
        }
        if (user !== null && user.id === userInfo.id) {
            //본인 채널임.
            delete userChannelWhere["visibility"];
        }
        // else {
        //     const isFollow = user !== null ? await this.followService.findfollow(user.id, userInfo.id) : null;
        //     if (isFollow !== null) {
        //         userChannelWhere.visibility = {
        //             [Op.not]: Visibility.PRIVATE
        //         };
        //     }
        // }

        orList.push(userChannelWhere);

        const followers = await this.followService.followUserInfosByUser(userInfo.id);
        followers.forEach(item => {
            orList.push({
                channel_id: item.channel_id,
                type: ChannelPostType.USER,
                visibility: Visibility.PUBLIC
            });
        })

        // const communities = await this.communityJoinService.findbyUserId(userInfo.id);

        // communities.forEach(item => {
        //     orList.push({
        //         community_id: item.community_id,
        //         type: ChannelPostType.COMMUNITY,
        //         visibility: Visibility.PUBLIC
        //     });
        // })

        const inputWhere: FindAndCountOptions = {
            where: whereIn,
            limit: query.limit,
            offset: query.offset,
            order: [["createdAt", "DESC"]],
            include: whereInclude
        };

        if (query.media) {
            const setInfo = _setMediaFilter(whereIn, whereInclude, query.media);
            whereIn = setInfo.whereIn;
            inputWhere.include = setInfo.whereInclude;
        }

        const list = await this.channelTimelineService.find(inputWhere);
        const postInfo = await this.postService.findIds(list.result.map(item => item.post_id));
        const likeList =
            user !== null
                ? await this.likeService.findByPostIds(
                    list.result.map(item => item.post_id),
                    user.id,
                    true
                )
                : [];

        if (query.sort && query.sort === TimeLineSort.POPULAR) {
            return {
                ...list,
                result: list.result
                    .map(item => {
                        const likeData = likeList.find(li => li.post_id === item.post_id);
                        return new PostsDto({
                            ...postInfo.find(po => po.id === item.post_id),
                            liked: likeData !== undefined ? true : false,
                        });
                    })
                    .sort((a, b) => b.like_cnt - a.like_cnt)
            };
        }

        const users = await this.userService.findByIds(postInfo.map(item => item.user_id));
        const setUsers = await this.commoninfoService.setCommonInfo(
            users.map(item => item.get({ plain: true }) as User),
            user
        );
        const postedAtInfos = await this.postedAtService.findByPostsId(postInfo.map(item => item.id));

        return {
            ...list,
            result: list.result.map(item => {
                const findInfo = postInfo.find(po => po.id === item.post_id);
                const userInfo = findInfo !== undefined && setUsers.find(us => us.id === findInfo.user_id);
                const findPostedAtInfo =
                    findInfo !== undefined && postedAtInfos.find(pa => pa.posts_id === findInfo.id);
                const likeData = likeList.find(li => li.post_id === item.post_id);
                if (findInfo === undefined || findInfo === null) {
                    return new PostsDto({
                        content: "삭제된 포스팅입니다",
                        id: null
                    });
                }
                return new PostsDto({
                    ...findInfo,
                    liked: likeData !== undefined ? true : false,
                    user: new UserDto({ ...userInfo }),
                    posted_at: new PostedAtDto({ ...findPostedAtInfo.get({ plain: true }) }),
                });
            })
        };
    }

    @Post(":community_id/pin/:post_id")
    @ApiOperation({ description: "커뮤니티 타임라인 포스팅 핀 하기" })
    @ZempieUseGuards(UserAuthGuard)
    async timelinePostpin(
        @CurrentUser() user: User,
        @Param("community_id") community_id: string,
        @Param("post_id") post_id: string
    ): Promise<SuccessReturnModel> {
        const joinInfo = await this.communityJoinService.findwithCommunityId(user.id, community_id);
        const pinPosts = await this.channelTimelineService.findPinPosts(community_id, null, true);

        if (joinInfo === null || joinInfo.status !== (JoinStatus.MANAGER || JoinStatus.SUBMANAGER)) {
            throw new HttpException("BAD_REQUEST", HttpStatus.BAD_REQUEST);
        } else if (pinPosts.count >= 3) {
            throw new HttpException("BAD_REQUEST", HttpStatus.BAD_REQUEST);
        }
        const postInfo = await this.channelPostService.findCommunityPost(community_id, post_id, ChannelPostType.COMMUNITY)
        await this.channelPostService.setPin(postInfo.id, true);
        return { success: true };
    }

    @Post(":community_id/unpin/:post_id")
    @ApiOperation({ description: "커뮤니티 타임라인 포스팅 핀 해제 하기" })
    @ZempieUseGuards(UserAuthGuard)
    async timelinePostunpin(
        @CurrentUser() user: User,
        @Param("community_id") community_id: string,
        @Param("post_id") post_id: string
    ): Promise<SuccessReturnModel> {
        const joinInfo = await this.communityJoinService.findwithCommunityId(user.id, community_id);

        if (joinInfo === null || joinInfo.status !== (JoinStatus.MANAGER || JoinStatus.SUBMANAGER)) {
            throw new HttpException("BAD_REQUEST", HttpStatus.BAD_REQUEST);
        }

        const postInfo = await this.channelPostService.findCommunityPost(community_id, post_id, ChannelPostType.COMMUNITY)
        await this.channelPostService.setPin(postInfo.id, false);
        return { success: false };
    }

    @Get(":community_id/pin")
    @ApiOperation({ description: "커뮤니티 타임라인 포스팅에서 핀된 포스팅" })
    @ZempieUseGuards(UserTokenCheckGuard)
    async timelinePostspin(
        @CurrentUser() user: User,
        @Param("community_id") community_id: string
    ): Promise<{ result: PostsDto[] }> {
        let whereIn: any = {
            community_id: community_id,
            type: ChannelPostType.COMMUNITY,
            visibility: Visibility.PUBLIC,
            is_pinned: 1
        };
        const inputWhere: FindAndCountOptions = {
            where: whereIn,
            limit: 10,
            offset: 0,
            order: [["createdAt", "DESC"]]
        };
        const list = await this.channelTimelineService.find(inputWhere);
        const postInfo = await this.postService.findIds(list.result.map(item => item.post_id));
        const users = await this.userService.findByIds(postInfo.map(item => item.user_id));
        const setUsers = await this.commoninfoService.setCommonInfo(
            users.map(item => item.get({ plain: true }) as User),
            user
        );
        const postedAtInfos = await this.postedAtService.findByPostsId(postInfo.map(item => item.id));
        const likeList =
            user !== null
                ? await this.likeService.findByPostIds(
                    list.result.map(item => item.post_id),
                    user.id,
                    true
                )
                : [];
        return {
            result: list.result.map(item => {
                const findInfo = postInfo.find(po => po.id === item.post_id);
                const userInfo = setUsers.find(us => us.id === findInfo.user_id);
                const findPostedAtInfo = postedAtInfos.find(pa => pa.posts_id === findInfo.id);
                const likeData = likeList.find(li => li.post_id === item.post_id);
                return new PostsDto({
                    ...findInfo,
                    liked: likeData !== undefined ? true : false,
                    user: new UserDto({ ...userInfo }),
                    posted_at: new PostedAtDto({ ...findPostedAtInfo.get({ plain: true }) })
                });
            })
        };
    }

    @Post(":community_id/channel/:channel_id/pin/:post_id")
    @ApiOperation({ description: "특정 커뮤니티 채널 타임라인 포스팅 핀 하기" })
    @ZempieUseGuards(UserAuthGuard)
    async timelineCommunityChanenlpin(
        @CurrentUser() user: User,
        @Param("community_id") community_id: string,
        @Param("channel_id") channel_id: string,
        @Param("post_id") post_id: string
    ): Promise<SuccessReturnModel> {
        const joinInfo = await this.communityJoinService.findwithCommunityId(user.id, community_id);
        const pinPosts = await this.channelTimelineService.findPinPosts(community_id, channel_id, true);

        if (
            pinPosts.count >= 3 ||
            joinInfo === null ||
            joinInfo.status !== (JoinStatus.MANAGER || JoinStatus.SUBMANAGER)
        ) {
            throw new HttpException("BAD_REQUEST", HttpStatus.BAD_REQUEST);
        }

        const postInfo = await this.channelPostService.findCommunityChannelPost(post_id, community_id, channel_id, ChannelPostType.COMMUNITY)
        await this.channelPostService.setPin(postInfo.id, true);
        return { success: true };
    }

    @Post(":community_id/channel/:channel_id/unpin/:post_id")
    @ApiOperation({ description: "특정 커뮤니티 채널 타임라인 포스팅 핀 해제 하기" })
    @ZempieUseGuards(UserAuthGuard)
    async timelineCommunityChanenlunpin(
        @CurrentUser() user: User,
        @Param("community_id") community_id: string,
        @Param("channel_id") channel_id: string,
        @Param("post_id") post_id: string
    ): Promise<SuccessReturnModel> {
        const joinInfo = await this.communityJoinService.findwithCommunityId(user.id, community_id);

        if (joinInfo === null || joinInfo.status !== (JoinStatus.MANAGER || JoinStatus.SUBMANAGER)) {
            throw new HttpException("BAD_REQUEST", HttpStatus.BAD_REQUEST);
        }

        const postInfo = await this.channelPostService.findCommunityChannelPost(post_id, community_id, channel_id, ChannelPostType.COMMUNITY)
        await this.channelPostService.setPin(postInfo.id, true);
        return { success: false };
    }

    @Get(":community_id/channel/:channel_id/pin")
    @ApiOperation({ description: "특정 커뮤니티 채널 핀된 타임라인" })
    @ApiResponse({ status: 200, schema: CustomQueryResultResponseType(PostsDto) })
    @ZempieUseGuards(UserTokenCheckGuard)
    async communityChannelTimePineLines(
        @Param("community_id") community_id: string,
        @Param("channel_id") channel_id: string,
        @CurrentUser() user: User
    ): Promise<{ result: PostsDto[] }> {
        let whereIn: any = {
            community_id: community_id,
            channel_id: channel_id,
            type: ChannelPostType.COMMUNITY,
            visibility: Visibility.PUBLIC,
            is_pinned: 1
        };
        let whereInclude = [];
        const inputWhere: FindAndCountOptions = {
            where: whereIn,
            limit: 10,
            offset: 0,
            order: [["createdAt", "DESC"]],
            include: whereInclude
        };

        const list = await this.channelTimelineService.find(inputWhere);
        const postInfo = await this.postService.findIds(list.result.map(item => item.post_id));

        const users = await this.userService.findByIds(postInfo.map(item => item.user_id));
        const setUsers = await this.commoninfoService.setCommonInfo(
            users.map(item => item.get({ plain: true }) as User),
            user
        );
        const postedAtInfos = await this.postedAtService.findByPostsId(postInfo.map(item => item.id));

        const likeList =
            user !== null
                ? await this.likeService.findByPostIds(
                    list.result.map(item => item.post_id),
                    user.id,
                    true
                )
                : [];

        return {
            result: list.result.map(item => {
                const findInfo = postInfo.find(po => po.id === item.post_id);
                const userInfo = setUsers.find(us => us.id === findInfo.user_id);
                const findPostedAtInfo = postedAtInfos.find(pa => pa.posts_id === findInfo.id);
                const likeData = likeList.find(li => li.post_id === item.post_id);
                return new PostsDto({
                    ...findInfo,
                    liked: likeData !== undefined ? true : false,
                    user: new UserDto({ ...userInfo }),
                    posted_at: new PostedAtDto({ ...findPostedAtInfo.get({ plain: true }) })
                });
            })
        };
    }

    @Post("channel/:channel_id/pin/:post_id")
    @ApiOperation({ description: "유저 채널 타임라인 포스팅 핀 하기" })
    @ZempieUseGuards(UserAuthGuard)
    async timelineUserChanenlpin(
        @CurrentUser() user: User,
        @Param("channel_id") channel_id: string,
        @Param("post_id") post_id: string
    ): Promise<SuccessReturnModel> {
        const userInfo = await this.userService.findOneByChannelId(channel_id);
        const pinPosts = await this.channelTimelineService.findPinPosts(null, channel_id, true);

        if (pinPosts.count >= 3 || userInfo.id !== user.id) {
            throw new HttpException("BAD_REQUEST", HttpStatus.BAD_REQUEST);
        }
        const postInfo = await this.channelPostService.findOneBychannelIdPostId(channel_id, post_id, ChannelPostType.USER)
        await this.channelPostService.setPin(postInfo.id, true);
        return { success: true };
    }

    @Post("channel/:channel_id/unpin/:post_id")
    @ApiOperation({ description: "유저 채널 타임라인 포스팅 핀 해제 하기" })
    @ZempieUseGuards(UserAuthGuard)
    async timelineUserChanenlunpin(
        @CurrentUser() user: User,
        @Param("channel_id") channel_id: string,
        @Param("post_id") post_id: string
    ): Promise<SuccessReturnModel> {
        const userInfo = await this.userService.findOneByChannelId(channel_id);

        if (userInfo.id !== user.id) {
            throw new HttpException("BAD_REQUEST", HttpStatus.BAD_REQUEST);
        }
        const postInfo = await this.channelPostService.findOneBychannelIdPostId(channel_id, post_id, ChannelPostType.USER)
        await this.channelPostService.setPin(postInfo.id, false);
        return { success: false };
    }

    @Get("channel/:channel_id/pin")
    @ApiResponse({ status: 200, schema: CustomQueryResultResponseType(PostsDto) })
    @ApiOperation({ description: "유저 채널 핀된 타임라인, Query 대문자 입력" })
    @ZempieUseGuards(UserTokenCheckGuard)
    async timelineUserPinChannel(@CurrentUser() user: User, @Param("channel_id") channel_id: string) {
        // const userInfo = await this.userService.findOneByChannelId(channel_id);
        let whereIn: any = {
            channel_id: channel_id,
            type: ChannelPostType.USER,
            visibility: Visibility.PUBLIC,
            is_pinned: 1
        };
        let whereInclude = [];

        const inputWhere: FindAndCountOptions = {
            where: whereIn,
            limit: 10,
            offset: 0,
            order: [["createdAt", "DESC"]],
            include: whereInclude
        };

        const list = await this.channelPostService.find(inputWhere);
        const postInfo = await this.postService.findIds(list.result.map(item => item.post_id));
        const likeList =
            user !== null
                ? await this.likeService.findByPostIds(
                    list.result.map(item => item.post_id),
                    user.id,
                    true
                )
                : [];

        const users = await this.userService.findByIds(postInfo.map(item => item.user_id));
        const setUsers = await this.commoninfoService.setCommonInfo(
            users.map(item => item.get({ plain: true }) as User),
            user
        );
        const postedAtInfos = await this.postedAtService.findByPostsId(postInfo.map(item => item.id));

        return {
            result: list.result.map(item => {
                const findInfo = postInfo.find(po => po.id === item.post_id);
                const userInfo = findInfo !== undefined && setUsers.find(us => us.id === findInfo.user_id);
                const findPostedAtInfo =
                    findInfo !== undefined && postedAtInfos.find(pa => pa.posts_id === findInfo.id);
                const likeData = likeList.find(li => li.post_id === item.post_id);
                if (findInfo === undefined || findInfo === null) {
                    return new PostsDto({
                        content: "삭제된 포스팅입니다",
                        id: null
                    });
                }
                return new PostsDto({
                    ...findInfo,
                    liked: likeData !== undefined ? true : false,
                    user: new UserDto({ ...userInfo }),
                    posted_at: new PostedAtDto({ ...findPostedAtInfo.get({ plain: true }) })
                });
            })
        };
    }

    @Get("game/:game_id")
    @ApiOperation({ description: "특정 게임의 타임라인" })
    @ApiResponse({ status: 200, schema: CustomQueryResultResponseType(PostsDto) })
    @ZempieUseGuards(UserTokenCheckGuard)
    async gamePostTimelines(
        @Param("game_id") game_id: string,
        @Query() query: TimelineListQueryDTO,
        @CurrentUser() user: User
    ): Promise<CustomQueryResult<PostsDto>> {
        let whereIn: any = {
            game_id: game_id,
            like_cnt: { [Op.gte]: 30 }
        };
        const gameInfo = await this.gameService.findOne(game_id);
        if (gameInfo === null) {
            throw new NotFoundException();
        } else if (user !== null && user.id === gameInfo.user_id) {
            //본인 채널임.
            delete whereIn["visibility"];
        } else {
            const isFollow = user !== null ? await this.followService.findfollow(user.id, gameInfo.user_id) : null;
            if (isFollow !== null) {
                whereIn.visibility = {
                    [Op.not]: Visibility.PRIVATE
                };
            }
        }
        let whereInclude = [];
        const inputWhere: FindAndCountOptions = {
            where: whereIn,
            limit: query.limit,
            offset: query.offset,
            order: [["createdAt", "DESC"]],
            include: whereInclude
        };

        if (query.sort && query.sort === TimeLineSort.POPULAR) {
            inputWhere.order = [["like_cnt", "DESC"]];
        }

        if (query.media) {
            const setInfo = _setMediaFilter(whereIn, whereInclude, query.media);
            whereIn = setInfo.whereIn;
            inputWhere.include = setInfo.whereInclude;
        }
        const list = await this.gamePostTimeLineService.find(inputWhere);
        const postInfo = await this.postService.findIds(list.result.map(item => item.post_id));

        const users = await this.userService.findByIds(postInfo.map(item => item.user_id));
        const setUsers = await this.commoninfoService.setCommonInfo(
            users.map(item => item.get({ plain: true }) as User),
            user
        );
        const postedAtInfos = await this.postedAtService.findByPostsId(postInfo.map(item => item.id));

        const likeList =
            user !== null
                ? await this.likeService.findByPostIds(
                    list.result.map(item => item.post_id),
                    user.id,
                    true
                )
                : [];

        return {
            ...list,
            result: list.result.map(item => {
                const findInfo = postInfo.find(po => po.id === item.post_id);
                const userInfo = setUsers.find(us => us.id === findInfo.user_id);
                const findPostedAtInfo = postedAtInfos.find(pa => pa.posts_id === findInfo.id);
                const likeData = likeList.find(li => li.post_id === item.post_id);
                return new PostsDto({
                    ...findInfo,
                    liked: likeData !== undefined ? true : false,
                    user: new UserDto({ ...userInfo }),
                    posted_at: new PostedAtDto({ ...findPostedAtInfo.get({ plain: true }) }),
                    is_pinned: item.is_pinned
                });
            })
        };
    }

    @Post(":game_id/pin/:post_id")
    @ApiOperation({ description: "게임 타임라인 포스팅 핀 하기" })
    @ZempieUseGuards(UserAuthGuard)
    async timelineGamepin(
        @CurrentUser() user: User,
        @Param("game_id") game_id: string,
        @Param("post_id") post_id: string
    ): Promise<SuccessReturnModel> {
        const gameInfo = await this.gameService.findOne(game_id);
        const pinPosts = await this.gamePostTimeLineService.findPinPost(game_id, true);

        if (pinPosts.count >= 3 || user.id !== gameInfo.user_id) {
            throw new HttpException("BAD_REQUEST", HttpStatus.BAD_REQUEST);
        }
        await this.gamePostService.setPin(game_id, post_id, true);
        return { success: true };
    }

    @Post(":game_id/unpin/:post_id")
    @ApiOperation({ description: "게임 타임라인 포스팅 핀 해제 하기" })
    @ZempieUseGuards(UserAuthGuard)
    async timelineGameunpin(
        @CurrentUser() user: User,
        @Param("game_id") game_id: string,
        @Param("post_id") post_id: string
    ): Promise<SuccessReturnModel> {
        const gameInfo = await this.gameService.findOne(game_id);

        if (user.id !== gameInfo.user_id) {
            throw new HttpException("BAD_REQUEST", HttpStatus.BAD_REQUEST);
        }
        await this.gamePostService.setPin(game_id, post_id, false);
        return { success: false };
    }

    @Get("game/:game_id/pin")
    @ApiOperation({ description: "특정 게임의 핀된 타임라인" })
    @ApiResponse({ status: 200, schema: CustomQueryResultResponseType(PostsDto) })
    @ZempieUseGuards(UserTokenCheckGuard)
    async gamePinedPostTimelines(
        @Param("game_id") game_id: string,
        @CurrentUser() user: User
    ): Promise<{ result: PostsDto[] }> {
        let whereIn: any = {
            game_id: game_id,
            is_pinned: 1
        };
        const gameInfo = await this.gameService.findOne(game_id);
        if (gameInfo === null) {
            throw new NotFoundException();
        }
        let whereInclude = [];
        const inputWhere: FindAndCountOptions = {
            where: whereIn,
            limit: 10,
            offset: 0,
            order: [["createdAt", "DESC"]],
            include: whereInclude
        };

        const list = await this.gamePostTimeLineService.find(inputWhere);
        const postInfo = await this.postService.findIds(list.result.map(item => item.post_id));

        const users = await this.userService.findByIds(postInfo.map(item => item.user_id));
        const setUsers = await this.commoninfoService.setCommonInfo(
            users.map(item => item.get({ plain: true }) as User),
            user
        );
        const postedAtInfos = await this.postedAtService.findByPostsId(postInfo.map(item => item.id));

        const likeList =
            user !== null
                ? await this.likeService.findByPostIds(
                    list.result.map(item => item.post_id),
                    user.id,
                    true
                )
                : [];

        return {
            result: list.result.map(item => {
                const findInfo = postInfo.find(po => po.id === item.post_id);
                const userInfo = setUsers.find(us => us.id === findInfo.user_id);
                const findPostedAtInfo = postedAtInfos.find(pa => pa.posts_id === findInfo.id);
                const likeData = likeList.find(li => li.post_id === item.post_id);
                return new PostsDto({
                    ...findInfo,
                    liked: likeData !== undefined ? true : false,
                    user: new UserDto({ ...userInfo }),
                    posted_at: new PostedAtDto({ ...findPostedAtInfo.get({ plain: true }) })
                });
            })
        };
    }
}

function _setMediaFilter(whereIn, whereInclude, media: TimeLineMediaFilter, isReleation?: boolean) {
    if (media === TimeLineMediaFilter.SNS || media === TimeLineMediaFilter.BLOG) {
        whereIn.post_type = media === TimeLineMediaFilter.SNS ? PostType.SNS : PostType.BLOG;
    } else {
        if (isReleation !== true) {
            whereIn.attatchment_files = {
                [Op.regexp]: Sequelize.literal(`'(${media})'`)
            };
        } else {
            whereInclude = [
                {
                    model: Posts,
                    through: {
                        where: {
                            attatchment_files: {
                                [Op.regexp]: Sequelize.literal(`'(${media})'`)
                            }
                        }
                    },
                    attributes: ["id"]
                }
            ];
        }
    }
    return { whereIn, whereInclude };
}

@Controller("api/v1/channel")
@ApiTags("api/v1/channel")
export class ChannelController {
    constructor(
        private postService: PostsService,
        private portfolioTimelineService: PortfolioTimelineService,
        private portfolioService: PortfolioService,
        private followService: FollowService,
        private commoninfoService: CommonInfoService,
        private postedAtService: PostedAtService,
        private userService: UserService,
        private likeService: LikeService,
        private portfolioPostService: PortfolioPostService,
        private channelPostService: ChannelPostService
    ) { }

    @Post(":channel_id/portfolio/:portfolio_id/pin/:post_id")
    @ApiOperation({ description: "포트폴리오 타임라인 포스팅 핀 하기" })
    @ZempieUseGuards(UserAuthGuard)
    async timelineGamepin(
        @CurrentUser() user: User,
        @Param("portfolio_id") portfolio_id: string,
        @Param("channel_id") channel_id: string,
        @Param("post_id") post_id: string
    ): Promise<SuccessReturnModel> {
        const portfolioInfo = await this.portfolioService.findOne(portfolio_id);
        const pinPosts = await this.portfolioTimelineService.findPinPosts(portfolio_id, channel_id, true);

        if (pinPosts.count >= 3 || user.id !== portfolioInfo.user_id) {
            throw new HttpException("BAD_REQUEST", HttpStatus.BAD_REQUEST);
        }

        await this.portfolioPostService.setPin(portfolio_id, channel_id, post_id, true);
        return { success: true };
    }

    @Post(":channel_id/portfolio/:portfolio_id/unpin/:post_id")
    @ApiOperation({ description: "포트폴리오 타임라인 포스팅 핀 해제 하기" })
    @ZempieUseGuards(UserAuthGuard)
    async timelineGameunpin(
        @CurrentUser() user: User,
        @Param("portfolio_id") portfolio_id: string,
        @Param("channel_id") channel_id: string,
        @Param("post_id") post_id: string
    ): Promise<SuccessReturnModel> {
        const portfolioInfo = await this.portfolioService.findOne(portfolio_id);

        if (user.id !== portfolioInfo.user_id) {
            throw new HttpException("BAD_REQUEST", HttpStatus.BAD_REQUEST);
        }

        await this.portfolioPostService.setPin(portfolio_id, channel_id, post_id, false);
        return { success: false };
    }

    @Get(":channel_id/portfolio/:portfolio_id")
    @ApiOperation({ description: "포트폴리오 타임라인, Query 대문자 입력" })
    @ApiResponse({ status: 200, schema: CustomQueryResultResponseType(PostsDto) })
    async timelinePortfolio(
        @Param("channel_id") channel_id: string,
        @Param("portfolio_id") portfolio_id: string,
        @Query() query: TimelineListQueryDTO,
        @CurrentUser() user: User
    ): Promise<CustomQueryResult<PostsDto>> {
        let whereIn: any = {
            channel_id: channel_id,
            portfolio_id: portfolio_id,
            like_cnt: { [Op.gte]: 30 }
        };

        let whereInclude = [];

        const portfolioInfo = await this.portfolioService.findOne(portfolio_id);
        if (portfolioInfo === null) {
            throw new NotFoundException();
        } else if (user !== null && user.id === portfolioInfo.user_id) {
            //본인 채널임.
            delete whereIn["visibility"];
        } else {
            const isFollow = user !== null ? await this.followService.findfollow(user.id, portfolioInfo.user_id) : null;
            if (isFollow !== null) {
                whereIn.visibility = {
                    [Op.not]: Visibility.PRIVATE
                };
            }
        }

        const inputWhere: FindAndCountOptions = {
            where: whereIn,
            limit: query.limit,
            offset: query.offset,
            order: [["createdAt", "DESC"]],
            include: whereInclude
        };

        if (query.sort && query.sort === TimeLineSort.POPULAR) {
            inputWhere.order = [["like_cnt", "DESC"]];
        }

        if (query.media) {
            const setInfo = _setMediaFilter(whereIn, whereInclude, query.media);
            whereIn = setInfo.whereIn;
            inputWhere.include = setInfo.whereInclude;
        }
        const list = await this.portfolioTimelineService.find(inputWhere);
        const postInfo = await this.postService.findIds(list.result.map(item => item.post_id));

        const users = await this.userService.findByIds(postInfo.map(item => item.user_id));
        const setUsers = await this.commoninfoService.setCommonInfo(
            users.map(item => item.get({ plain: true }) as User),
            user
        );
        const postedAtInfos = await this.postedAtService.findByPostsId(postInfo.map(item => item.id));

        const likeList =
            user !== null
                ? await this.likeService.findByPostIds(
                    list.result.map(item => item.post_id),
                    user.id,
                    true
                )
                : [];

        return {
            ...list,
            result: list.result.map(item => {
                const findInfo = postInfo.find(po => po.id === item.post_id);
                const userInfo = setUsers.find(us => us.id === findInfo.user_id);
                const findPostedAtInfo = postedAtInfos.find(pa => pa.posts_id === findInfo.id);
                const likeData = likeList.find(li => li.post_id === item.post_id);
                return new PostsDto({
                    ...findInfo,
                    liked: likeData !== undefined ? true : false,
                    user: new UserDto({ ...userInfo }),
                    posted_at: new PostedAtDto({ ...findPostedAtInfo.get({ plain: true }) }),
                    is_pinned: item.is_pinned
                });
            })
        };
    }

    @Post("/pin/:post_id")
    @ApiOperation({ description: "내 채널 포스팅 핀 하기" })
    @ZempieUseGuards(UserAuthGuard)
    async timelinePostpin(@CurrentUser() user: User, @Param("post_id") post_id: string): Promise<PostsDto> {
        const info = await this.channelPostService.findOneBychannelIdPostId(
            user.channel_id,
            post_id,
            ChannelPostType.USER
        );
        const cnt = await this.channelPostService.countUserChannelPin(user.channel_id, ChannelPostType.USER);
        if (info === null) {
            throw new NotFoundException();
        } else if (cnt >= 3) {
            throw new BadRequestException();
        }
        await this.channelPostService.setPin(post_id, true);
        const updateInfo = await this.postService.findOne(post_id);

        return new PostsDto({ ...updateInfo.get({ plain: true }), is_pinned: true });
    }

    @Post("/unpin/:post_id")
    @ApiOperation({ description: "내 채널 포스팅 핀 해제 하기" })
    @ZempieUseGuards(UserAuthGuard)
    async timelinePostunpin(
        @CurrentUser() user: User,
        @Param("community_id") community_id: string,
        @Param("post_id") post_id: string
    ): Promise<PostsDto> {
        const info = await this.channelPostService.findOneBychannelIdPostId(
            user.channel_id,
            post_id,
            ChannelPostType.USER
        );
        if (info === null) {
            throw new NotFoundException();
        }
        await this.channelPostService.setPin(post_id, false);
        const updateInfo = await this.postService.findOne(post_id);
        return new PostsDto({ ...updateInfo.get({ plain: true }), is_pinned: false });
    }
}
