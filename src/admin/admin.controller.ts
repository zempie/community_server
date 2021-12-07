import { BadGatewayException, BadRequestException, Body, ClassSerializerInterceptor, Controller, Delete, HttpException, HttpStatus, NotFoundException, Param, Post, Put, Query, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SuccessReturnModel } from 'src/abstract/base-model';
import { CurrentUser } from 'src/auth/user-auth-decorator';
import { AdminAuthGuard } from 'src/auth/user-auth.guard';
import { BlockService } from 'src/block/block.service';
import { BlockType } from 'src/block/enum/blocktype.enum';
import { ChannelPostService } from 'src/channel-post/channel-post.service';
import { ChannelTimelineService } from 'src/channel-post/channel-timeline.service';
import { ChannelPostType } from 'src/channel-post/enum/channelposttype.enum';
import { CommentService } from 'src/comment/comment.service';
import { CommentDto } from 'src/comment/dto/comment.dto';
import { CreateCommentDto, UpdateReCommentDto } from 'src/comment/dto/create-comment.dto';
import { UpdateCommentDto } from 'src/comment/dto/update-comment.dto';
import { CommentType } from 'src/comment/enum/commenttype.enum';
import { CommonInfoService } from 'src/commoninfo/commoninfo.service';
import { ChannelState } from 'src/community/community-channel/channelstate.enum';
import { CommunityChannelService } from 'src/community/community-channel/community-channel.service';
import { CommunityChannelBaseDto, CommunityChannelDto } from 'src/community/community-channel/dto/community-channel.dto';
import { CreateCommunityChannelDto } from 'src/community/community-channel/dto/create-community-channel.dto';
import { ReturnCommunityChannelDto } from 'src/community/community-channel/dto/returnchannel.dto';
import { UpdateCommunityChannelDto } from 'src/community/community-channel/dto/update-community-channel.dto';
import { CommunityJoinService } from 'src/community/community-join/community-join.service';
import { CommunityJoinUserDto } from 'src/community/community-join/dto/community-join.dto';
import { ReturnCommunityJoinDto } from 'src/community/community-join/dto/return-community-join';
import { CommunityLogicService } from 'src/community/community.logic.service';
import { CommunityService } from 'src/community/community.service';
import { CreateCommunityDto } from 'src/community/dto/create-community.dto';
import { ReturnCommunityDto } from 'src/community/dto/return-community.dto';
import { UpdateCommunityDto } from 'src/community/dto/update-community.dto';
import { FcmDto, FcmSaveQuery } from 'src/fcm/dto/fcm.dto';
import { GameTimelineService } from 'src/game/game-post/game-post-timeline.service';
import { GamePostService } from 'src/game/game-post/game-post.service';
import { CreatePollDto } from 'src/poll/dto/create-poll.dto';
import { PostsPollDto } from 'src/poll/dto/poll.dto';
import { UpdatePostsPollDto } from 'src/poll/dto/update-poll.dto';
import { PollLogicService } from 'src/poll/poll.logic.service';
import { PortfolioService } from 'src/portfolio/portfolio.service';
import { CreatePostsDto } from 'src/posts/dto/create-posts.dto';
import { PostOutDto } from 'src/posts/dto/posts.dto';
import { UpdatePostsDto } from 'src/posts/dto/update-posts.dto';
import { PostFunctionType } from 'src/posts/enum/post-posttype.enum';
import { Posts } from 'src/posts/posts.entity';
import { PostsLogicService } from 'src/posts/posts.logic.service';
import { PostsService } from 'src/posts/posts.service';
import { UserDto } from 'src/user/dto/user.dto';
import { User } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';
import { ZempieUseGuards } from 'src/util/decorators/ZempieUseGaurd';
import { AdminFcmService } from './fcm/admin.fcm.service';

@Controller('api/v1/admin')
@ApiTags("api/v1/admin")
export class AdminController {

    constructor(private adminFcmService: AdminFcmService, private userService: UserService) {

    }
    @Post("/token")
    @ApiResponse({ status: 200, description: "성공 반환" })
    @ApiOperation({ description: "유저 토큰 저장" })
    @ZempieUseGuards(AdminAuthGuard)
    async createUserToken(
        @CurrentUser() user: User,
        @Query() query: FcmSaveQuery
    ): Promise<FcmDto> {
        const newtoken = await this.adminFcmService.create(user.id, query.token);
        const userInfo = await this.userService.findOne(user.id);
        newtoken.token
        return new FcmDto({
            user: userInfo,
            ...newtoken.get({ plain: true })
        });
    }

    @Post("/token/remove")
    @ApiResponse({ status: 200, description: "성공 반환" })
    @ApiOperation({ description: "유저 토큰 삭제" })
    @ZempieUseGuards(AdminAuthGuard)
    async DeleteUserToken(@CurrentUser() user: User): Promise<SuccessReturnModel> {
        await this.adminFcmService.deletebyUserId(user.id);
        return { success: true };
    }
}

@Controller('api/v1/admin/community')
@ApiTags("api/v1/admin/community")
export class AdminCommunityController {

    constructor(
        private communityService: CommunityService,
        private communityLogicService: CommunityLogicService,
        private communityjoinService: CommunityJoinService,
        private userService: UserService,
        private communitychannelService: CommunityChannelService,
        private blockService: BlockService,
    ) { }

    @Post()
    @ApiResponse({ status: 200, description: "성공 반환", type: ReturnCommunityDto })
    @ApiOperation({ description: "커뮤니티 생성" })
    @ZempieUseGuards(AdminAuthGuard)
    async createCommunity(@CurrentUser() user: User, @Body() data: CreateCommunityDto): Promise<ReturnCommunityDto> {
        let managerId;
        if (!data.community_manager_id) {
            managerId = data.owner_id;
        } else {
            managerId = data.community_manager_id;
        }
        return await this.communityLogicService.createCommunity(data, managerId)
    }

    @Put(":community_id")
    @ApiResponse({ status: 200, description: "성공 반환", type: ReturnCommunityDto })
    @ApiOperation({ description: "커뮤니티 수정" })
    @ZempieUseGuards(AdminAuthGuard)
    async updateCommunity(
        // @CurrentUser() user: User,
        @Param("community_id") community_id: string,
        @Body() data: UpdateCommunityDto
    ) {
        const community = await this.communityService.findOne(community_id);
        if (community === null) {
            throw new NotFoundException();
        }
        return await this.communityLogicService.updateCommunity(community, data);
    }

    @Put(":community_id/channel/:removed_channel_id/remove/:combined_channel_id")
    @ApiOperation({ description: "채널 합치기" })
    @ZempieUseGuards(AdminAuthGuard)
    async channelCombine(
        @Param("community_id") community_id: string,
        @Param("removed_channel_id") removed_channel_id: string,
        @Param("combined_channel_id") combined_channel_id: string
    ): Promise<SuccessReturnModel> {
        const communityInfo = await this.communityService.findOne(community_id);
        if (communityInfo === null) {
            throw new NotFoundException();
        }

        return await this.communityLogicService.channelCombine(community_id, removed_channel_id, combined_channel_id);
    }

    @Post(":community_id/designation/manager")
    @ApiOperation({ description: "매니저 지정" })
    @ZempieUseGuards(AdminAuthGuard)
    async setManager(
        @Param("community_id") community_id: string,
        @Query("user_id") user_id: number
    ): Promise<CommunityJoinUserDto> {
        const communityInfo = await this.communityService.findOne(community_id);

        if (communityInfo === null) {
            throw new NotFoundException();
        }
        const userJoin = await this.communityjoinService.findwithCommunityId(user_id, community_id);
        if (userJoin === undefined) {
            throw new BadRequestException();
        }
        await this.communityLogicService.setManager(communityInfo, userJoin)

        const result = await this.communityjoinService.findwithCommunityId(user_id, communityInfo.id);

        const userInfo = await this.userService.findOne(userJoin.user_id);
        return new CommunityJoinUserDto({
            ...result.get({ plain: true }),
            user: userInfo
        });
    }

    @Post(":community_id/channel")
    @ApiResponse({ status: 200, description: "성공 반환", type: ReturnCommunityChannelDto })
    @ApiOperation({ description: "채널 생성" })
    @ZempieUseGuards(AdminAuthGuard)
    async createCommunityChannels(
        @Param("community_id") community_id: string,
        @Body() data: CreateCommunityChannelDto
    ): Promise<ReturnCommunityChannelDto> {
        const community = await this.communityService.findOne(community_id);

        if (community === null) {
            throw new NotFoundException();
        }
        return await this.communityLogicService.createCommunityChannels(data, community)
    }

    @Post(":community_id/channel/:channel_id")
    @ApiResponse({ status: 200, description: "성공 반환", type: CommunityChannelDto })
    @ApiOperation({ description: "채널 수정" })
    @ZempieUseGuards(AdminAuthGuard)
    async updateCommunityChannels(
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
        return await this.communityLogicService.updateCommunityChannels(community_id, channelInfo.id, data);
    }

    @Post(":community_id/channel/:channel_id/remove")
    @ApiResponse({ status: 200, description: "성공 반환", type: Boolean })
    @ApiOperation({ description: "채널 삭제" })
    @ZempieUseGuards(AdminAuthGuard)
    async Channeldelete(
        @Param("community_id") community_id: string,
        @Param("channel_id") channel_id: string
    ): Promise<SuccessReturnModel> {
        const community = await this.communityService.findOne(community_id);
        if (community === null) {
            throw new NotFoundException();
        }
        return await this.communityLogicService.channeldelete(community_id, channel_id)
    }

    @Post(":community_id/member/:user_id/block")
    @ApiResponse({ status: 200, description: "성공 반환", type: [ReturnCommunityJoinDto] })
    @ApiResponse({ status: 401, description: "관리자가 아닐 경우" })
    @ApiOperation({ description: "커뮤니티 유저 블락, user_id : 블락유저 아이디" })
    @ApiResponse({ status: 200, description: "블랙 해제", type: ReturnCommunityJoinDto })
    @ZempieUseGuards(AdminAuthGuard)
    async communityBlock(
        @Param("community_id") community_id: string,
        @Param("user_id") user_id: number
    ) {
        const community = await this.communityService.findOne(community_id);
        if(community === null){
            throw new NotFoundException("일치하는 커뮤니티가 없습니다.")
        }
        const joinInfo = await this.communityjoinService.findwithCommunityId(user_id, community_id);
        if (!joinInfo) {
            throw new NotFoundException("가입된 유저가 아닙니다.");
        }

        return await this.communityLogicService.communityBlock(community_id, user_id);
    }

    @Post(":community_id/member/:user_id/unblock")
    @ApiResponse({ status: 200, description: "성공 반환", type: Boolean })
    @ApiResponse({ status: 401, description: "관리자가 아닐 경우" })
    @ApiOperation({ description: "커뮤니티 유저 블락 해제" })
    @ApiResponse({ status: 200, description: "블랙 해제", type: ReturnCommunityJoinDto })
    @ZempieUseGuards(AdminAuthGuard)
    async userunBlock(
        @Param("community_id") community_id: string,
        @Param("user_id") user_id: number
    ): Promise<UserDto> {
        const community = await this.communityService.findOne(community_id);
        const userInfo = await this.userService.findOne(user_id);
        if (community === null || userInfo === null) {
            throw new NotFoundException();
        }

        return await this.communityLogicService.userUnBlock(userInfo, community_id);
    }

    @Post(":community_id/remove")
    @ApiResponse({ status: 200, description: "성공 반환", type: Boolean })
    @ApiResponse({ status: 401, description: "권한 없음" })
    @ApiOperation({ description: "해당 커뮤니티 삭제" })
    @ZempieUseGuards(AdminAuthGuard)
    @UsePipes(new ValidationPipe({ whitelist: false, transform: true }))
    async delete(@Param("community_id") community_id: string): Promise<SuccessReturnModel> {
        const community = await this.communityService.findOne(community_id);
        if (community === null) {
            throw new NotFoundException();
        }
        await this.communityService.delete(community_id);
        return { success: true }
    }

    @Post(":community_id/member/:user_id/kick")
    @ApiResponse({ status: 200, description: "성공 반환", type: CommunityJoinUserDto })
    @ApiResponse({ status: 404, description: "가입한 유저가 없을 경우" })
    @ApiOperation({ description: "해당 커뮤니티의 멤버를 커뮤니티에서 강퇴" })
    @ZempieUseGuards(AdminAuthGuard)
    async CommunityKick(
        @Param("user_id") user_id: number,
        @Param("community_id") community_id: string,
    ): Promise<CommunityJoinUserDto> {
        const joinUser = await this.communityjoinService.exist(user_id, community_id);
        if (!joinUser) {
            throw new HttpException("NOT_FOUND", HttpStatus.NOT_FOUND);
        }

        return await this.communityLogicService.communityKick(user_id, community_id, joinUser);
    }

    @Post(":community_id/member/:user_id/unkick")
    @ApiResponse({ status: 200, description: "성공 반환", type: CommunityJoinUserDto })
    @ApiResponse({ status: 404, description: "가입한 유저가 없거나, 강퇴된 유저가 아닌 경우" })
    @ApiOperation({ description: "강퇴 해제" })
    @ZempieUseGuards(AdminAuthGuard)
    async CommunityunKick(
        @Param("user_id") user_id: number,
        @Param("community_id") community_id: string,
    ): Promise<CommunityJoinUserDto> {
        const joinUser = await this.communityjoinService.exist(user_id, community_id);
        const kickedUser = await this.blockService.findBlockedUser(user_id, community_id, BlockType.KICK);
        if (!joinUser || !kickedUser) {
            throw new HttpException("NOT_FOUND", HttpStatus.NOT_FOUND);
        }
        return await this.communityLogicService.communityUnKick(kickedUser, joinUser)
    }
}

@Controller("api/v1/admin/post")
@ApiTags("api/v1/admin/post")
export class AdminPostController {
    constructor(
        private postsService: PostsService,
        private postsLogicService: PostsLogicService,
        private userService: UserService,
        private commentService: CommentService,
        private commonInfoService: CommonInfoService
    ) { }

    @Post()
    @ApiOperation({ description: "포스팅 작성" })
    @ZempieUseGuards(AdminAuthGuard)
    async create(@Body() data: CreatePostsDto): Promise<Posts> {
        return await this.postsLogicService.createPost(data);
    }

    @Put("/:post_id")
    @ApiOperation({ description: "포스팅 수정" })
    @ZempieUseGuards(AdminAuthGuard)
    async updatPost(@Param("post_id") post_id: string, @Body() data: UpdatePostsDto) {
        const post = await this.postsService.findOne(post_id);
        if (post === null) {
            throw new NotFoundException("일치하는 포스팅이 없습니다.");
        }
        const writer = await this.userService.findOne(post.user_id);

        return await this.postsLogicService.updatePost(post, writer, data);
    }

    @Post(":post_id/comment")
    @ApiOperation({
        description: "댓글 작성"
    })
    @ApiResponse({ status: 200, description: "작성", type: CommentDto })
    @ZempieUseGuards(AdminAuthGuard)
    async createComment(
        @Param("post_id") post_id: string,
        @Body() data: CreateCommentDto
    ): Promise<CommentDto> {
        return await this.postsLogicService.createComment(post_id, data)
    }

    @Post(":post_id/recomment")
    @ApiOperation({
        description: "대댓글 작성"
    })
    @ZempieUseGuards(AdminAuthGuard)
    async createReply(
        @CurrentUser() user: User,
        @Param("post_id") post_id: string,
        @Body() data: CreateCommentDto
    ): Promise<CommentDto> {
        return await this.postsLogicService.createReply(post_id, data);
    }

    @Put(":post_id/recomment/:comment_id")
    @ApiOperation({
        description: "대댓글 수정"
    })
    @ZempieUseGuards(AdminAuthGuard)
    async updateReply(
        @Param("post_id") post_id: string,
        @Param("comment_id") comment_id: string,
        @Body() data: UpdateReCommentDto
    ): Promise<CommentDto> {
        const existComment = await this.commentService.findOne(comment_id);
        if (!existComment) {
            throw new HttpException("NOT_FOUND", HttpStatus.NOT_FOUND);
        } else if (existComment.type !== CommentType.COMMENT) {
            throw new BadGatewayException();
        }
        return await this.postsLogicService.updateReply(comment_id, post_id, data, null);
    }

    @Post(":post_id/out")
    @ApiOperation({
        description: "포스팅 내보내기"
    })
    @ZempieUseGuards(AdminAuthGuard)
    async postOut(@Param("post_id") post_id: string, @Body() data: PostOutDto): Promise<PostOutDto> {
        if (data.report_reason === "5" && (data.report_text === undefined || data.report_text === null)) {
            throw new BadRequestException("report_text가 필요합니다");
        }
        const post = await this.postsService.findOne(post_id);
        if (post === null) {
            throw new NotFoundException("일치하는 포스팅이 없습니다.");
        }
        const writer = await this.userService.findOne(post.user_id);

        return await this.postsLogicService.outPost(post, writer, data);
    }

    @Post(":post_id/comment/:comment_id")
    @ApiOperation({
        description: "댓글 수정"
    })
    @ZempieUseGuards(AdminAuthGuard)
    async updateComment(
        @Param("post_id") post_id: string,
        @Param("comment_id") comment_id: string,
        @Body() data: UpdateCommentDto
    ): Promise<CommentDto> {
        const existComment = await this.commentService.findOne(comment_id);
        if (!existComment) {
            throw new HttpException("NOT_FOUND", HttpStatus.NOT_FOUND);
        } else if (existComment.type !== CommentType.COMMENT) {
            throw new BadGatewayException();
        }
        return await this.postsLogicService.updateReply(comment_id, post_id, data, null);
    }

    @Post(":post_id/comment/:comment_id/pin")
    @ApiOperation({
        description: "댓글 핀"
    })
    @ZempieUseGuards(AdminAuthGuard)
    async commentPin(@Param("comment_id") comment_id: string, @Param("post_id") post_id: string): Promise<CommentDto> {
        const post = await this.postsService.findOne(post_id);
        if (post === null) {
            throw new NotFoundException("일치하는 포스팅이 없습니다.");
        }
        const info = await this.commentService.setFin(comment_id, post_id, true);
        const rData = new CommentDto({ ...info.get({ plain: true }), is_read: true });
        const result = await this.commonInfoService.setCommentInfo([rData], null);
        return result[0];
    }

    @Post(":post_id/comment/:comment_id/pin")
    @ApiOperation({
        description: "댓글 핀 해제"
    })
    @ZempieUseGuards(AdminAuthGuard)
    async commentunPin(
        @Param("comment_id") comment_id: string,
        @Param("post_id") post_id: string
    ): Promise<CommentDto> {
        const post = await this.postsService.findOne(post_id);
        if (post === null) {
            throw new NotFoundException("일치하는 포스팅이 없습니다.");
        }
        const info = await this.commentService.setFin(comment_id, post_id, false);
        const rData = new CommentDto({ ...info.get({ plain: true }), is_read: true });
        const result = await this.commonInfoService.setCommentInfo([rData], null);
        return result[0];
    }

    @Delete(":post_id")
    @ApiOperation({ description: "포스팅 삭제" })
    @ZempieUseGuards(AdminAuthGuard)
    @ApiResponse({ status: 200, description: "성공" })
    async deletePost(@Param("post_id") post_id: string): Promise<SuccessReturnModel> {
        const post = await this.postsService.findOne(post_id);
        if (post === null) {
            throw new NotFoundException();
        } else if (post.funtion_type !== PostFunctionType.NONE) {
            throw new BadRequestException();
        }
        const writerUser = await this.userService.findOne(post.user_id);
        return await this.postsLogicService.deletePost(post, writerUser)
    }
}

@Controller("api/v1/admin/poll")
@ApiTags("api/v1/admin/poll")
export class AdminPollController {
    constructor(
        private postsService: PostsService,
        private pollLogicService: PollLogicService,
        private userService: UserService
    ) { }

    @Post()
    @ApiOperation({
        description: "투표 - 포스팅 작성"
    })
    @ZempieUseGuards(AdminAuthGuard)
    @UseInterceptors(ClassSerializerInterceptor)
    @UsePipes(new ValidationPipe({ whitelist: false, transform: true }))
    async create(@CurrentUser() user: User, @Body() data: CreatePollDto): Promise<PostsPollDto> {
        return await this.pollLogicService.createPoll(data)
    }

    @Put("/:post_id")
    @ApiOperation({
        description: "투표 - 포스팅 수정"
    })
    @ZempieUseGuards(AdminAuthGuard)
    @UseInterceptors(ClassSerializerInterceptor)
    @UsePipes(new ValidationPipe({ whitelist: false, transform: true }))
    async update(@Param("post_id") post_id: string, @Body() data: UpdatePostsPollDto): Promise<PostsPollDto> {
        const postInfo = await this.postsService.findOne(post_id);
        if (postInfo === null) {
            throw new NotFoundException("일치하는 포스팅이 없습니다.");
        } else if (postInfo.funtion_type !== PostFunctionType.POLL) {
            throw new NotFoundException("일치하는 포스팅이 없습니다.");
        }
        const writer = await this.userService.findOne(postInfo.user_id);
        return await this.pollLogicService.updatePost(postInfo, data, writer);
    }

    @Delete("poll/:post_id")
    @ApiOperation({
        description: "투표 - 포스팅 삭제"
    })
    @ZempieUseGuards(AdminAuthGuard)
    @UseInterceptors(ClassSerializerInterceptor)
    @UsePipes(new ValidationPipe({ whitelist: false, transform: true }))
    async delete(@Param("post_id") post_id: string) {
        const info = await this.postsService.findOne(post_id);
        if (info === null) {
            throw new NotFoundException("일치하는 포스팅이 없습니다.");
        } else if (info.funtion_type !== PostFunctionType.POLL) {
            throw new NotFoundException("일치하는 포스팅이 없습니다.");
        }
        const writerUser = await this.userService.findOne(info.user_id)
        return await this.pollLogicService.delete(info, writerUser)
    }
}

@Controller("api/v1/admin/timeline")
@ApiTags("api/v1/admin/timeline")
export class AdminTimelineController {
    constructor(
        private channelTimelineService: ChannelTimelineService,
        private channelPostService: ChannelPostService,
        private gamePostService: GamePostService,
        private gamePostTimeLineService: GameTimelineService
    ) { }

    @Post(":community_id/pin/:post_id")
    @ApiOperation({ description: "커뮤니티 타임라인 포스팅 핀 하기" })
    @ZempieUseGuards(AdminAuthGuard)
    async timelinePostpin(
        @Param("community_id") community_id: string,
        @Param("post_id") post_id: string
    ): Promise<SuccessReturnModel> {
        const pinPosts = await this.channelTimelineService.findPinPosts(community_id, null, true);
        if (pinPosts.count >= 3) {
            throw new HttpException("BAD_REQUEST", HttpStatus.BAD_REQUEST);
        }
        const postInfo = await this.channelPostService.findCommunityPost(
            community_id,
            post_id,
            ChannelPostType.COMMUNITY
        );
        await this.channelPostService.setPin(postInfo.id, true);
        return { success: true };
    }

    @Post(":community_id/unpin/:post_id")
    @ApiOperation({ description: "커뮤니티 타임라인 포스팅 핀 해제 하기" })
    @ZempieUseGuards(AdminAuthGuard)
    async timelinePostunpin(
        @Param("community_id") community_id: string,
        @Param("post_id") post_id: string
    ): Promise<SuccessReturnModel> {
        const postInfo = await this.channelPostService.findCommunityPost(
            community_id,
            post_id,
            ChannelPostType.COMMUNITY
        );
        await this.channelPostService.setPin(postInfo.id, false);
        return { success: false };
    }

    @Post(":community_id/channel/:channel_id/pin/:post_id")
    @ApiOperation({ description: "특정 커뮤니티 채널 타임라인 포스팅 핀 하기" })
    @ZempieUseGuards(AdminAuthGuard)
    async timelineCommunityChanenlpin(
        @Param("community_id") community_id: string,
        @Param("channel_id") channel_id: string,
        @Param("post_id") post_id: string
    ): Promise<SuccessReturnModel> {
        const pinPosts = await this.channelTimelineService.findPinPosts(community_id, channel_id, true);
        if (pinPosts.count >= 3) {
            throw new HttpException("BAD_REQUEST", HttpStatus.BAD_REQUEST);
        }

        const postInfo = await this.channelPostService.findCommunityChannelPost(
            post_id,
            community_id,
            channel_id,
            ChannelPostType.COMMUNITY
        );
        await this.channelPostService.setPin(postInfo.id, true);
        return { success: true };
    }

    @Post(":community_id/channel/:channel_id/pin/:post_id")
    @ApiOperation({ description: "특정 커뮤니티 채널 타임라인 포스팅 핀 해제 하기" })
    @ZempieUseGuards(AdminAuthGuard)
    async timelineCommunityChanenlunpin(
        @Param("community_id") community_id: string,
        @Param("channel_id") channel_id: string,
        @Param("post_id") post_id: string
    ): Promise<SuccessReturnModel> {
        const postInfo = await this.channelPostService.findCommunityChannelPost(
            post_id,
            community_id,
            channel_id,
            ChannelPostType.COMMUNITY
        );
        await this.channelPostService.setPin(postInfo.id, true);
        return { success: false };
    }

    @Post(":game_id/pin/:post_id")
    @ApiOperation({ description: "게임 타임라인 포스팅 핀 하기" })
    @ZempieUseGuards(AdminAuthGuard)
    async timelineGamepin(
        @Param("game_id") game_id: string,
        @Param("post_id") post_id: string
    ): Promise<SuccessReturnModel> {
        const pinPosts = await this.gamePostTimeLineService.findPinPost(game_id, true);

        if (pinPosts.count >= 3) {
            throw new HttpException("BAD_REQUEST", HttpStatus.BAD_REQUEST);
        }
        await this.gamePostService.setPin(game_id, post_id, true);
        return { success: true };
    }

    @Post(":game_id/unpin/:post_id")
    @ApiOperation({ description: "게임 타임라인 포스팅 핀 해제 하기" })
    @ZempieUseGuards(AdminAuthGuard)
    async timelineGameunpin(
        @Param("game_id") game_id: string,
        @Param("post_id") post_id: string
    ): Promise<SuccessReturnModel> {
        await this.gamePostService.setPin(game_id, post_id, false);
        return { success: false };
    }
}

@Controller("api/v1/admin/user")
@ApiTags("api/v1/admin/user")
export class AdminUserController {
    constructor(private portfolioService: PortfolioService) {
    }
    @Delete(":user_id/portfolio/:portfolio_id/delete")
    @ApiOperation({ description: "포트폴리오 삭제" })
    @ZempieUseGuards(AdminAuthGuard)
    async deletePortfolio(
        @Param("user_id") user_id: number,
        @Param("portfolio_id") portfolio_id: string
    ): Promise<SuccessReturnModel> {
        await this.portfolioService.delete(portfolio_id);
        return { success: true };
    }
}