import {
    BadRequestException,
    Body,
    Controller,
    Delete,
    ForbiddenException,
    Get,
    HttpException,
    HttpStatus,
    InternalServerErrorException,
    NotFoundException,
    Param,
    Post,
    Put,
    Query
} from "@nestjs/common";
import { ApiNotFoundResponse, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { PostsService } from "./posts.service";
import { CreatePosts, CreatePostsDto } from "./dto/create-posts.dto";
import { Posts } from "./posts.entity";
import { LikeService } from "src/like/like.service";
import { LikeDto } from "src/like/dto/like.dto";
import { CreateCommentDto, UpdateReCommentDto } from "src/comment/dto/create-comment.dto";
import { CommentService } from "src/comment/comment.service";
import { PostedAtService } from "src/posted_at/posted_at.service";
import { CommunityChannelService } from "src/community/community-channel/community-channel.service";
import { CommentDto } from "src/comment/dto/comment.dto";
import { UpdateCommentDto } from "src/comment/dto/update-comment.dto";
import { ReportService } from "src/report/report.service";
import { User } from "src/user/user.entity";
import { UserAuthGuard, UserTokenCheckGuard } from "src/auth/user-auth.guard";
import { CurrentUser } from "src/auth/user-auth-decorator";
import { CommentType } from "src/comment/enum/commenttype.enum";
import { LikeType } from "src/like/enum/liketype.enum";
import { ReturnLikeDto } from "src/like/dto/return-like.dto";
import { CreateReportPostDto } from "src/report/dto/create-report.dto";
import { ReportDto } from "src/report/dto/report.dto";
import { targetType } from "src/report/enum/reporttargettype.enum";
import { CommentListDto } from "../comment/dto/comment-list.dto";
import { BaseQuery } from "src/abstract/base-query";
import { LikeListDto } from "src/like/dto/like-list.dto";
import { UserService } from "src/user/user.service";
import { ZempieUseGuards } from "src/util/decorators/ZempieUseGaurd";
import { ChannelPostService } from "src/channel-post/channel-post.service";
import { PortfolioPostService } from "src/portfolio/portfolio-post/portfolio-post.service";
import { PostOutDto, PostsDto } from "./dto/posts.dto";
import { ChannelPostType } from "src/channel-post/enum/channelposttype.enum";
import { BadGatewayException } from "@nestjs/common";
import { PostStatus } from "./enum/post-status.enum";
import { PostFunctionType, PostType } from "./enum/post-posttype.enum";
import { UserDto } from "src/user/dto/user.dto";
import { SuccessReturnModel } from "src/abstract/base-model";
import { CustomQueryResult, CustomQueryResultResponseType } from "src/util/pagination-builder";
import { Visibility } from "./enum/post-visibility.enum";
import { CommunityJoinService } from "src/community/community-join/community-join.service";
import { HashtagLogService } from "src/hashtag-log/hashtag-log.service";
import { BlockService } from "src/block/block.service";
import { BlockType } from "src/block/enum/blocktype.enum";
import { FollowService } from "src/follow/follow.service";
import { UpdatePostsDto } from "./dto/update-posts.dto";
import { UpdatePostedAtDto } from "src/posted_at/dto/update-posted_at.dto";
import { GamePostService } from "src/game/game-post/game-post.service";
import { CommonInfoService } from "src/commoninfo/commoninfo.service";
import { CommunityService } from "src/community/community.service";
import { FcmService } from "src/fcm/fcm.service";
import { FcmEnumType } from "src/fcm/fcm.enum";
import { PostsViewLogService } from "./posts_view_log/posts_view_log_service";
import { LikeLogService } from "src/like/like_log/like_log.service";
import { PostsLogicService } from "./posts.logic.service";
import { AdminFcmService } from "src/admin/fcm/admin.fcm.service";

@Controller("api/v1/post")
@ApiTags("api/v1/post")
export class PostsController {
    constructor(
        private postsService: PostsService,
        private likeService: LikeService,
        private commentService: CommentService,
        private postedAtService: PostedAtService,
        private channelService: CommunityChannelService,
        private reportService: ReportService,
        private userService: UserService,
        private channelPostService: ChannelPostService,
        private portfoliPostService: PortfolioPostService,
        private communityJoinService: CommunityJoinService,
        private communityService: CommunityService,
        private hashTagLogService: HashtagLogService,
        private blockService: BlockService,
        private followService: FollowService,
        private gamePostService: GamePostService,
        private commonInfoService: CommonInfoService,
        private fcmService: FcmService,
        private postsviewLogService: PostsViewLogService,
        private likeLogService: LikeLogService,
        private postsLogicService: PostsLogicService,
        private adminFcmService: AdminFcmService
    ) { }

    @Get(":post_id")
    @ApiOperation({ description: "해당 포스팅 보기" })
    @ApiResponse({ status: 200, description: "성공반환", type: PostsDto })
    @ApiResponse({ status: 404, description: "일치하는 데이터가 없음", type: NotFoundException })
    @ZempieUseGuards(UserTokenCheckGuard)
    async findPost(@CurrentUser() user: User, @Param("post_id") post_id: string): Promise<PostsDto> {
        const postInfo = await this.postsService.findOne(post_id);
        if (user !== null) {
            await this.postsviewLogService.create(post_id, user.id);
        }
        if (postInfo === null) {
            throw new NotFoundException();
        } else if (postInfo.visibility !== Visibility.PUBLIC && user === null) {
            throw new NotFoundException();
        } else if (postInfo.visibility === Visibility.FOLLOWER) {
            const isFollow = await this.followService.findfollow(user.id, postInfo.user_id);
            if (isFollow === null) {
                throw new NotFoundException();
            }
        } else if (postInfo.visibility === Visibility.PRIVATE && postInfo.user_id !== user.id) {
            throw new NotFoundException();
        }
        const userInfo = await this.userService.findOne(postInfo.user_id);
        const like = user !== null ? await this.likeService.likePostByUserId(post_id, user.id) : null;

        return new PostsDto({
            ...postInfo.get({ plain: true }),
            user: new UserDto({ ...userInfo }),
            liked: like != null ? true : false,
            is_pinned: null
        });
    }

    @Get(":post_id/like/list")
    @ApiOperation({ description: "해당 포스팅 좋아요 리스트" })
    async Likelist(@Query() query: BaseQuery, @Param("post_id") post_id: string): Promise<LikeListDto[]> {
        const likeInfo = await this.likeService.list(query, post_id);
        const userInfos = await this.userService.findByIds(likeInfo.map(item => item.user_id));

        const result: LikeListDto[] = [];
        for await (const item of likeInfo) {
            const userInfo = userInfos.find(us => us.id === item.user_id);
            if (userInfo !== undefined) {
                result.push({
                    id: item.id,
                    post_id: item.post_id,
                    user: userInfo
                } as LikeListDto);
            }
        }

        return result;
    }

    @Post(":post_id/comment")
    @ApiOperation({
        description: "댓글 작성"
    })
    @ApiResponse({ status: 200, description: "작성", type: CommentDto })
    @ZempieUseGuards(UserAuthGuard)
    async createComment(
        @CurrentUser() user: User,
        @Param("post_id") post_id: string,
        @Body() data: CreateCommentDto
    ): Promise<CommentDto> {
        return await this.postsLogicService.createComment(post_id, data, user)
    }

    @Post(":post_id/recomment")
    @ApiOperation({
        description: "대댓글 작성"
    })
    @ZempieUseGuards(UserAuthGuard)
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
    @ZempieUseGuards(UserAuthGuard)
    async updateReply(
        @CurrentUser() user: User,
        @Param("post_id") post_id: string,
        @Param("comment_id") comment_id: string,
        @Body() data: UpdateReCommentDto
    ): Promise<CommentDto> {
        const existComment = await this.commentService.findOne(comment_id);
        if (!existComment) {
            throw new HttpException("NOT_FOUND", HttpStatus.NOT_FOUND);
        } else if (existComment.type !== CommentType.COMMENT) {
            throw new BadGatewayException();
        } else if (existComment.user_id !== user.id) {
            throw new NotFoundException();
        }
        return await this.postsLogicService.updateReply(comment_id, post_id, data, user)
    }

    @Post("/:post_id/like")
    @ApiOperation({
        description: "포스팅 좋아요 누르기"
    })
    @ZempieUseGuards(UserAuthGuard)
    async like(@CurrentUser() user: User, @Param("post_id") post_id: string): Promise<ReturnLikeDto> {
        const exist = await this.likeService.likePostByUserId(post_id, user.id);
        let post = await this.postsService.findOne(post_id);
        const log = await this.likeLogService.checkExist(user.id, post_id, LikeType.POST);
        if (log === null) {
            await this.likeLogService.create(user.id, post_id, LikeType.POST);
        }
        if (exist !== null) {
            return new ReturnLikeDto({
                ...exist.get({ plain: true }),
                is_read: user.id === post.user_id ? true : false
            });
        }

        post = await this.postsService.likeCnt(post_id, true);
        const like = await this.likeService.createPostLike(post_id, {
            user_id: user.id,
            type: LikeType.POST
        });

        const authorTokenInfo = await this.fcmService.getTokenByUserId(post.user_id);
        if (post.like_cnt === 1) {
            await this.fcmService.sendFCM(
                authorTokenInfo,
                "Likes",
                `${user.name} liked your posting`,
                FcmEnumType.USER,
                post_id
            );
        } else {
            await this.fcmService.sendFCM(
                authorTokenInfo,
                "Likes",
                `recent liked ${user.name} and ${post.like_cnt - 1} others liked your posting`,
                FcmEnumType.USER,
                post_id
            );
        }

        return new ReturnLikeDto({
            ...like.get({ plain: true }),
            is_read: user.id === post.user_id ? true : false
        });
    }

    @Post("/:post_id/unlike")
    @ApiOperation({
        description: "포스팅 좋아요 취소"
    })
    @ZempieUseGuards(UserAuthGuard)
    async unlike(@CurrentUser() user: User, @Param("post_id") post_id: string): Promise<SuccessReturnModel> {
        const existLike = await this.likeService.existPostlike(user.id, post_id);
        if (existLike === null) {
            return { success: false };
        }
        if (user.id !== existLike.user_id) {
            throw new HttpException("BAD_REQUEST", HttpStatus.BAD_REQUEST);
        }
        const setcount = await this.postsService.likeCnt(post_id, false);
        if (!setcount) {
            return { success: false };
        }
        await this.likeService.deletePostlike(post_id);
        return { success: true };
    }

    @Post()
    @ApiOperation({ description: "포스팅 작성" })
    @ZempieUseGuards(UserAuthGuard)
    async create(@CurrentUser() user: User, @Body() data: CreatePostsDto): Promise<Posts> {
        return await this.postsLogicService.createPost(data);
    }

    @Put("/:post_id")
    @ApiOperation({ description: "포스팅 수정" })
    @ZempieUseGuards(UserAuthGuard)
    async updatPost(@CurrentUser() user: User, @Param("post_id") post_id: string, @Body() data: UpdatePostsDto) {
        const post = await this.postsService.findOne(post_id);
        if (data.community !== undefined) {
            for await (const co of data.community) {
                const channelInfo = await this.channelService.findChannelWithCommu(co.id, co.channel_id);
                if (!channelInfo) {
                    throw new HttpException("NOT_FOUND", HttpStatus.NOT_FOUND);
                }
                const blockCheck = await this.blockService.findBlockedUser(user.id, co.id, BlockType.COMMUNITYBLOCK);
                if (blockCheck !== null) {
                    throw new BadRequestException("블럭당한 커뮤니티입니다.");
                }
            }
        }
        if (post === null) {
            throw new NotFoundException("일치하는 포스팅이 없습니다.");
        } else if (post.user_id !== user.id) {
            throw new NotFoundException("일치하는 포스팅이 없습니다.");
        }
        return await this.postsLogicService.updatePost(post, user, data);
    }

    @Delete(":post_id")
    @ApiOperation({ description: "포스팅 삭제" })
    @ZempieUseGuards(UserAuthGuard)
    @ApiResponse({ status: 200, description: "성공" })
    async deletePost(@CurrentUser() user: User, @Param("post_id") post_id: string): Promise<SuccessReturnModel> {
        const post = await this.postsService.findOne(post_id);
        if (post === null) {
            throw new NotFoundException();
        } else if (user.id !== post.user_id) {
            throw new HttpException("BAD_REQUEST", HttpStatus.BAD_REQUEST);
        } else if (post.funtion_type !== PostFunctionType.NONE) {
            throw new BadRequestException();
        }
        return await this.postsLogicService.deletePost(post, user)
    }

    @Post(":post_id/out")
    @ApiOperation({ description: "포스팅 내보내기" })
    @ApiResponse({ status: 200, description: "완료", type: PostOutDto })
    @ZempieUseGuards(UserAuthGuard)
    async postOut(
        @CurrentUser() user: User,
        @Param("post_id") post_id: string,
        @Body() data: PostOutDto
    ): Promise<PostOutDto> {
        if (data.report_reason === "5" && (data.report_text === undefined || data.report_text === null)) {
            throw new BadRequestException("report_text가 필요합니다");
        }
        const existPost = await this.postsService.findOne(post_id);
        if (existPost === null) throw new NotFoundException("일치하는 포스팅이 없습니다.");
        const existCommunity = await this.communityService.findOne(data.community_id);
        if (existCommunity === null) throw new NotFoundException("일치하는 커뮤니티가 없습니다.");
        const existJoin = await this.communityJoinService.findwithCommunityId(user.id, data.community_id);
        if (existJoin === null) throw new ForbiddenException();
        if (existCommunity.owner_id !== user.id) throw new ForbiddenException();

        const existChannelPost = await this.channelPostService.findCommunityPost(
            post_id,
            data.community_id,
            ChannelPostType.COMMUNITY
        );
        if (existChannelPost === null) throw new NotFoundException("일치하는 포스팅이 없습니다.");

        const postedData = await this.postedAtService.findByPostsId(post_id);
        if (postedData === null) throw new InternalServerErrorException();
        const transaction = await this.postsService.sequelize().transaction();
        try {
            await this.postedAtService.update(
                postedData.id,
                {
                    posts_id: post_id,
                    channel_id: user.channel_id,
                    community: postedData.community.filter(item => item.id !== data.community_id)
                },
                transaction
            );
            await this.channelPostService.deleteCommunityPost(
                post_id,
                data.community_id,
                ChannelPostType.COMMUNITY,
                transaction
            );
            await this.communityService.setPostCnt(data.community_id, false, transaction)
            transaction.commit();
            return {
                ...data,
                created_at: new Date().getTime()
            };
        } catch (error) {
            console.error(error);
            transaction.rollback();
            throw new InternalServerErrorException();
        }
    }

    @Post(":post_id/comment/:comment_id/like")
    @ApiOperation({ description: "댓글 좋아요" })
    @ApiResponse({ status: 200, description: "좋아요", type: LikeDto })
    @ZempieUseGuards(UserAuthGuard)
    async CommentLike(
        @CurrentUser() user: User,
        @Param("comment_id") comment_id: string,
        @Param("post_id") post_id: string
    ): Promise<LikeDto> {
        const existComment = await this.commentService.findWithpostId(comment_id, post_id);
        const log = await this.likeLogService.checkExist(user.id, comment_id, LikeType.COMMENT);
        if (existComment === null) {
            throw new NotFoundException();
        }
        if (log === null) {
            await this.likeLogService.create(user.id, comment_id, LikeType.COMMENT);
        }
        const checkLike = await this.likeService.likeCommentByUserId(post_id, comment_id, user.id);
        const authorTokenInfo = await this.fcmService.getTokenByUserId(existComment.user_id);

        await this.fcmService.sendFCM(
            authorTokenInfo,
            "Comments Likes",
            `${user.name} liked commented on ${existComment.content}`,
            FcmEnumType.USER,
            comment_id
        );

        if (checkLike === null) {
            await this.commentService.setLikeCnt(comment_id, post_id, true);
            const like = this.likeService.createCommentLike({
                user_id: user.id,
                comment_id: comment_id,
                post_id: post_id,
                type: LikeType.COMMENT,
                state: true // true - 좋아요
            });
            return new LikeDto({
                ...like,
                is_read: user.id === existComment.user_id ? true : false,
                is_liked: true
            });
        } else {
            return new LikeDto({
                ...checkLike.get({ plain: true }),
                is_read: user.id === existComment.user_id ? true : false,
                is_liked: true
            });
        }
    }

    @Post(":post_id/comment/:comment_id/unlike")
    @ApiOperation({ description: "댓글 좋아요 취소" })
    @ApiResponse({ status: 200, description: "처리완료", type: SuccessReturnModel })
    @ZempieUseGuards(UserAuthGuard)
    async CommentunLike(
        @CurrentUser() user: User,
        @Param("comment_id") comment_id: string,
        @Param("post_id") post_id: string
    ): Promise<SuccessReturnModel> {
        const existLike = await this.likeService.existCommentlike(user.id, comment_id, true);
        if (existLike === null) {
            return { success: false };
        } else if (user.id !== existLike.user_id) {
            throw new HttpException("BAD_REQUEST", HttpStatus.BAD_REQUEST);
        }
        await this.commentService.setLikeCnt(comment_id, post_id, false);
        const deleteLike = await this.likeService.deleteCommentlike(comment_id, post_id, true);
        if (!deleteLike) {
            return { success: false };
        }
        return { success: true };
    }

    @Post(":post_id/comment/:comment_id/dislike")
    @ApiOperation({ description: "댓글 싫어요" })
    @ApiResponse({ status: 200, description: "처리완료", type: LikeDto })
    @ZempieUseGuards(UserAuthGuard)
    async CommentdisLike(
        @CurrentUser() user: User,
        @Param("comment_id") comment_id: string,
        @Param("post_id") post_id: string
    ): Promise<LikeDto> {
        const checkLike = await this.likeService.existCommentlike(user.id, comment_id, false);
        if (checkLike === null) {
            await this.commentService.setdisLikeCnt(comment_id, post_id, true);
            const info = await this.likeService.createCommentdisLike({
                user_id: user.id,
                comment_id: comment_id,
                post_id: post_id,
                type: LikeType.COMMENT,
                state: false // false - 싫어요
            });
            return new LikeDto({
                ...info,
                is_liked: false,
                is_read: user.id === checkLike.user_id ? true : false
            });
        } else {
            return new LikeDto({
                ...checkLike,
                is_liked: false,
                is_read: user.id === checkLike.user_id ? true : false
            });
        }
    }

    @Post(":post_id/comment/:comment_id/undislike")
    @ApiOperation({ description: "댓글싫어요 취소" })
    @ApiResponse({ status: 200, description: "처리완료", type: SuccessReturnModel })
    @ZempieUseGuards(UserAuthGuard)
    async CommentundisLike(
        @CurrentUser() user: User,
        @Param("comment_id") comment_id: string,
        @Param("post_id") post_id: string
    ): Promise<SuccessReturnModel> {
        const existLike = await this.likeService.existCommentlike(user.id, comment_id, false);
        if (existLike !== null) {
            await this.commentService.setdisLikeCnt(comment_id, post_id, false);
            const deleteLike = await this.likeService.deleteCommentlike(comment_id, post_id, false);
            if (!deleteLike) {
                return { success: false };
            }
            return { success: true };
        } else {
            return { success: false };
        }
    }

    @Post(":post_id/comment/:comment_id/pin")
    @ApiOperation({ description: "댓글 핀" })
    @ApiResponse({ status: 200, description: "처리완료", type: CommentDto })
    @ZempieUseGuards(UserAuthGuard)
    async CommentPinTrue(
        @CurrentUser() user: User,
        @Param("comment_id") comment_id: string,
        @Param("post_id") post_id: string
    ): Promise<CommentDto> {
        const existPost = await this.postsService.findOne(post_id);
        if (user.id !== existPost.user_id) {
            throw new HttpException("BAD_REQUEST", HttpStatus.BAD_REQUEST);
        }
        const info = await this.commentService.setFin(comment_id, post_id, true);
        const rData = new CommentDto({ ...info.get({ plain: true }), is_read: true });
        const result = await this.commonInfoService.setCommentInfo([rData], user);
        return result[0];
    }

    @Post(":post_id/comment/:comment_id/unpin")
    @ApiOperation({ description: "댓글 핀 해제" })
    @ApiResponse({ status: 200, description: "처리완료", type: CommentDto })
    @ZempieUseGuards(UserAuthGuard)
    async CommentPinFalse(
        @CurrentUser() user: User,
        @Param("comment_id") comment_id: string,
        @Param("post_id") post_id: string
    ): Promise<CommentDto> {
        const existPost = await this.postsService.findOne(post_id);
        if (user.id !== existPost.user_id) {
            throw new HttpException("BAD_REQUEST", HttpStatus.BAD_REQUEST);
        }
        const comment = await this.commentService.setFin(comment_id, post_id, false);
        const rData = new CommentDto({ ...comment.get({ plain: true }), is_read: true });
        const result = await this.commonInfoService.setCommentInfo([rData], user);
        return result[0];
    }

    @Post(":post_id/comment/:comment_id")
    @ApiOperation({
        description: "댓글 수정"
    })
    @ApiResponse({ status: 200, description: "수정 완료", type: CommentDto })
    @ZempieUseGuards(UserAuthGuard)
    async update(
        @CurrentUser() user: User,
        @Param("comment_id") comment_id: string,
        @Param("post_id") post_id: string,
        @Body() data: UpdateCommentDto
    ): Promise<CommentDto> {
        const existComment = await this.commentService.findWithpostId(comment_id, post_id);
        if (existComment === null) {
            throw new NotFoundException();
        }
        if (existComment.user_id !== user.id) {
            throw new HttpException("BAD_REQUEST", HttpStatus.BAD_REQUEST);
        }
        const updateInfo = await this.commentService.update(comment_id, post_id, data);
        const rData = new CommentDto({ ...updateInfo.get({ plain: true }), is_read: true });
        const result = await this.commonInfoService.setCommentInfo([rData], user);
        return result[0];
    }

    @Delete(":post_id/comment/:comment_id")
    @ApiOperation({
        description: "댓글 삭제"
    })
    @ApiResponse({ status: 200, description: "삭제 완료", type: SuccessReturnModel })
    @ZempieUseGuards(UserAuthGuard)
    async delete(
        @CurrentUser() user: User,
        @Param("comment_id") comment_id: string,
        @Param("post_id") post_id: string
    ): Promise<SuccessReturnModel> {
        const existComment = await this.commentService.findWithpostId(comment_id, post_id);
        if (existComment === null) {
            throw new NotFoundException();
        }
        if (existComment.user_id !== user.id) {
            throw new ForbiddenException();
        }
        await this.postsService.commentCnt(post_id, false);
        return { success: await this.commentService.deleteWidhPostId(comment_id, post_id) };
    }

    @Post(":post_id/report")
    @ApiOperation({ description: "포스팅 신고" })
    @ApiResponse({ status: 200, description: "신고완료", type: ReportDto })
    @ApiNotFoundResponse()
    @ZempieUseGuards(UserAuthGuard)
    async reportPosting(
        @CurrentUser() user: User,
        @Param("post_id") post_id: string,
        @Body() data: CreateReportPostDto
    ): Promise<ReportDto> {
        const postInfo = await this.postsService.findOne(data.post_id);
        if (postInfo === null) {
            throw new NotFoundException();
        }
        const check = await this.reportService.existPostreport(user.id, post_id);
        if (check !== null) {
            throw new BadRequestException("이미 신고한적이 있습니다.");
        }
        const result = await this.reportService.createPostreport({
            ...data,
            user_id: user.id,
            targetType: targetType.POST
        });
        const writerInfo = await this.userService.findOne(postInfo.user_id);
        await this.adminFcmService.sendFCM(
            "Report",
            `${writerInfo.name} reported for this ${data.report_reason}`,
            FcmEnumType.ADMIN,
            result.id
        )
        return result
    }

    @Post(":post_id/retweet")
    @ApiOperation({ description: "포스팅 리트윗" })
    @ZempieUseGuards(UserAuthGuard)
    async PostRetweet(@CurrentUser() user: User, @Param("post_id") post_id: string): Promise<SuccessReturnModel> {
        const checkPost = await this.postsService.findRetweetOne(post_id, user.id);
        const postInfo = await this.postsService.findOne(post_id);

        if (checkPost !== null) {
            throw new BadRequestException("이미 리트윗한 포스팅입니다");
        }
        const transaction = await this.postsService.sequelize().transaction();
        const inputData: CreatePosts = {
            post_state: PostType.SNS,
            visibility: Visibility.FOLLOWER,
            user_id: user.id,
            channel_id: user.channel_id,
            status: PostStatus.ACTIVE,
            is_retweet: true,
            retweet_id: post_id,
            post_contents: ""
        };
        try {
            const post = await this.postsService.create(
                {
                    ...inputData
                },
                transaction
            );
            await this.postedAtService.create(
                {
                    posts_id: post.id,
                    channel_id: user.channel_id
                },
                transaction
            );
            await this.channelPostService.create(
                {
                    community_id: null,
                    channel_id: user.channel_id,
                    post_id: post.id,
                    type: ChannelPostType.USER,
                    visibility: post.visibility
                },
                transaction
            );
            await transaction.commit();

            const authorTokenInfo = await this.fcmService.getTokenByUserId(postInfo.user_id);
            if (postInfo.is_retweet === false) {
                await this.fcmService.sendFCM(
                    authorTokenInfo,
                    "Retweet",
                    `${user.name} Retweeted ${post.content}`,
                    FcmEnumType.USER,
                    post_id
                );
            } else {
                await this.fcmService.sendFCM(
                    authorTokenInfo,
                    "Retweet",
                    `${user.name} Retweeted your retweet ${post.content}`,
                    FcmEnumType.USER,
                    post_id
                );
            }

            return { success: true };
        } catch (error) {
            console.error(error);
            transaction.rollback();
            throw new InternalServerErrorException();
        }
    }

    @Post(":post_id/unretweet")
    @ApiOperation({ description: "포스팅 리트윗 해제" })
    @ZempieUseGuards(UserAuthGuard)
    async PostunRetweet(@CurrentUser() user: User, @Param("post_id") post_id: string): Promise<SuccessReturnModel> {
        const post = await this.postsService.findRetweetOne(post_id, user.id);
        if (post === null) {
            return { success: false };
        } else {
            const transaction = await this.postsService.sequelize().transaction();
            try {
                await this.postedAtService.deleteByPostId(post.id, transaction);
                const channelPost = await this.channelPostService.findOneBychannelIdPostId(
                    user.channel_id,
                    post.id,
                    ChannelPostType.USER,
                    transaction
                );
                await this.channelPostService.delete(channelPost.id);
                await this.postsService.delete(post.id, transaction);
                await transaction.commit();
                return { success: true };
            } catch (error) {
                console.error(error);
                transaction.rollback();
                throw new InternalServerErrorException();
            }
        }
    }

    @Get(":post_id/comment/list")
    @ApiOperation({ description: "댓글 리스트" })
    @ApiResponse({ status: 200, description: "정상", type: CustomQueryResultResponseType(CommentDto) })
    @ZempieUseGuards(UserTokenCheckGuard)
    async CommentList(
        @CurrentUser() user: User,
        @Param("post_id") post_id: string,
        @Query() query: CommentListDto
    ): Promise<CustomQueryResult<CommentDto>> {
        const postInfo = await this.postsService.findOne(post_id);
        if (postInfo === null) {
            throw new NotFoundException();
        }
        const result = await this.commentService.list(query, post_id, user?.id ?? undefined);
        result.result = result.result.map(item => {
            if (item.is_private === true) {
                if (user !== null && postInfo.user_id === user.id) {
                    return item;
                } else {
                    item.content = "비밀댓글입니다.";
                    item.attatchment_files = null;
                    return item;
                }
            }
            return item;
        });
        return {
            ...result,
            result: await this.commonInfoService.setCommentInfo(result.result, user)
        };
    }
}
