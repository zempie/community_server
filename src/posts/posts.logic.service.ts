import { BadRequestException, ForbiddenException, HttpException, HttpStatus, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { BlockService } from "src/block/block.service";
import { BlockType } from "src/block/enum/blocktype.enum";
import { ChannelPostService } from "src/channel-post/channel-post.service";
import { ChannelPostType } from "src/channel-post/enum/channelposttype.enum";
import { CommentService } from "src/comment/comment.service";
import { CommentDto } from "src/comment/dto/comment.dto";
import { CreateCommentDto, UpdateReCommentDto } from "src/comment/dto/create-comment.dto";
import { CommentType } from "src/comment/enum/commenttype.enum";
import { CommonInfoService } from "src/commoninfo/commoninfo.service";
import { CommunityChannelService } from "src/community/community-channel/community-channel.service";
import { FcmEnumType } from "src/fcm/fcm.enum";
import { FcmService } from "src/fcm/fcm.service";
import { CommunityService } from "src/community/community.service";
import { GamePostService } from "src/game/game-post/game-post.service";
import { HashtagLogService } from "src/hashtag-log/hashtag-log.service";
import { PortfolioPostService } from "src/portfolio/portfolio-post/portfolio-post.service";
import { UpdatePostedAtDto } from "src/posted_at/dto/update-posted_at.dto";
import { PostedAtService } from "src/posted_at/posted_at.service";
import { User } from "src/user/user.entity";
import { UserService } from "src/user/user.service";
import { CreatePostsDto } from "./dto/create-posts.dto";
import { PostOutDto } from "./dto/posts.dto";
import { UpdatePostsDto } from "./dto/update-posts.dto";
import { PostStatus } from "./enum/post-status.enum";
import { Visibility } from "./enum/post-visibility.enum";
import { Posts } from "./posts.entity";
import { PostsService } from "./posts.service";

@Injectable()
export class PostsLogicService {
    constructor(
        private postsService: PostsService,
        private postedAtService: PostedAtService,
        private channelPostService: ChannelPostService,
        private gamePostService: GamePostService,
        private portfoliPostService: PortfolioPostService,
        private hashTagLogService: HashtagLogService,
        private commentService: CommentService,
        private commonInfoService: CommonInfoService,
        private userService: UserService,
        private channelService: CommunityChannelService,
        private blockService: BlockService,
        private fcmService: FcmService,
        private communityService: CommunityService
    ) {

    }

    async createPost(data: CreatePostsDto) {
        const userInfo = await this.userService.findOneByUid(data.user_uid);
        if (userInfo === null) {
            throw new ForbiddenException();
        }
        if (data.community && data.visibility === Visibility.FOLLOWER) {
            for await (const co of data.community) {
                const channelInfo = await this.channelService.findChannelWithCommu(co.id, co.channel_id);
                if (!channelInfo) {
                    throw new HttpException("NOT_FOUND", HttpStatus.NOT_FOUND);
                }
                const blockCheck = await this.blockService.findBlockedUser(userInfo.id, co.id, BlockType.COMMUNITYBLOCK);
                if (blockCheck !== null) {
                    throw new BadRequestException("블럭당한 커뮤니티입니다.");
                }
            }
        }
        const transaction = await this.postsService.sequelize().transaction();
        try {
            const post = await this.postsService.create(
                {
                    ...data,
                    user_id: userInfo.id,
                    channel_id: userInfo.channel_id,
                    status: data.scheduled_for ? PostStatus.DRAFT : PostStatus.ACTIVE
                },
                transaction
            );
            await this.postedAtService.create(
                {
                    posts_id: post.id,
                    channel_id: userInfo.channel_id,
                    game_id: data.game_id,
                    community: data.community,
                    portfolio_ids: data.portfolio_ids
                },
                transaction
            );

            await this.channelPostService.create(
                {
                    community_id: null,
                    channel_id: userInfo.channel_id,
                    post_id: post.id,
                    type: ChannelPostType.USER,
                    visibility: post.visibility
                },
                transaction
            );

            if (data.community !== undefined && data.community.length > 0) {
                await this.channelPostService.create(
                    data.community.map(item => ({
                        channel_id: item.channel_id,
                        community_id: item.id,
                        post_id: post.id,
                        type: ChannelPostType.COMMUNITY,
                        visibility: post.visibility
                    })),
                    transaction
                );
                await this.communityService.setPostCnt(data.community.map(item => item.id), true, transaction)
            }
            if (data.portfolio_ids !== undefined && Array.isArray(data.portfolio_ids) === true && data.portfolio_ids.length > 0) {
                await this.portfoliPostService.create(
                    data.portfolio_ids.map(item => ({
                        channel_id: userInfo.channel_id,
                        portfolio_id: item,
                        post_id: post.id
                    })),
                    transaction
                );
            }

            if (data.game_id !== undefined) {
                await this.gamePostService.create(
                    {
                        game_id: data.game_id,
                        post_id: post.id
                    },
                    transaction
                );
            }

            await this.hashTagLogService.create(userInfo.id, data.hashtags);
            await transaction.commit();

            if (data.user_tagId) {
                for (const item of data.user_tagId) {
                    const authorTokenInfo = await this.fcmService.getTokenByUserId(item["id"]);
                    await this.fcmService.sendFCM(
                        authorTokenInfo,
                        "Mentioned you in the post",
                        `${userInfo.name} mentioned you in the post ${post.content}`,
                        FcmEnumType.USER,
                        post.id
                    ).catch(err => {
                        console.error(err);
                    })
                }
            }

            const newInfo = await this.postsService.findOne(post.id);
            if (data.community !== undefined && data.community.length > 0) {
                newInfo.posted_at.community = data.community.map(item => ({
                    id: item.id,
                    channel_id: item.channel_id
                }));
            }
            if (data.portfolio_ids !== undefined && Array.isArray(data.portfolio_ids) === true && data.portfolio_ids.length > 0) {
                newInfo.posted_at.portfolio_ids = data.portfolio_ids;
            }
            return newInfo;
        } catch (error) {
            console.error(error);
            transaction.rollback();
            throw new InternalServerErrorException();
        }
    }

    async updatePost(post: Posts, user: User, data: UpdatePostsDto) {
        const transaction = await this.postsService.sequelize().transaction();
        const postedInfo = await this.postedAtService.findByPostsId(post.id);
        const updatePostedData: UpdatePostedAtDto = { channel_id: user.channel_id, posts_id: post.id };
        try {
            if (data.community !== undefined) {
                updatePostedData.community = data.community;
                if (postedInfo.community !== undefined && postedInfo.community.length > 0) {
                    await this.channelPostService.deleteCommunityPost(
                        post.id,
                        postedInfo.community.map(item => item.id),
                        ChannelPostType.COMMUNITY,
                        transaction
                    );
                    await this.communityService.setPostCnt(postedInfo.community.map(item => item.id), false, transaction)
                }
                await this.channelPostService.create(
                    data.community.map(item => ({
                        type: ChannelPostType.COMMUNITY,
                        post_id: post.id,
                        channel_id: item.channel_id,
                        community_id: item.id,
                        visibility: post.visibility
                    }))
                );
                await this.communityService.setPostCnt(data.community.map(item => item.id), true, transaction)
            }
            if (data.game_id !== undefined) {
                updatePostedData.game_id = data.game_id;
                if (postedInfo.game_id !== undefined) {
                    await this.gamePostService.delete(post.id, postedInfo.game_id, transaction);
                }
                await this.gamePostService.create({ game_id: data.game_id, post_id: post.id }, transaction);
            }
            if (data.portfolio_ids !== undefined) {
                updatePostedData.portfolio_ids = data.portfolio_ids;
                if (postedInfo.portfolio_ids !== undefined && Array.isArray(postedInfo.portfolio_ids) === true && postedInfo.portfolio_ids.length > 0) {
                    await this.portfoliPostService.delete(
                        post.id,
                        user.channel_id,
                        postedInfo.portfolio_ids,
                        transaction
                    );
                }
                if (data.portfolio_ids !== undefined && Array.isArray(data.portfolio_ids) && data.portfolio_ids.length > 0) {
                    await this.portfoliPostService.create(
                        data.portfolio_ids.map(item => ({
                            channel_id: user.channel_id,
                            portfolio_id: item,
                            post_id: post.id
                        })),
                        transaction
                    );
                }
            }
            await this.postedAtService.update(postedInfo.id, updatePostedData, transaction);
            await this.postsService.update(post.id, data);
            await transaction.commit();
            await this.hashTagLogService.create(user.id, data.hashtags);

            const newInfo = await this.postsService.findOne(post.id);
            if (data.community !== undefined && data.community.length > 0) {
                newInfo.posted_at.community = data.community.map(item => ({
                    id: item.id,
                    channel_id: item.channel_id
                }));
            }
            if (data.portfolio_ids !== undefined && Array.isArray(data.portfolio_ids) === true && data.portfolio_ids.length > 0) {
                newInfo.posted_at.portfolio_ids = data.portfolio_ids;
            }
            return newInfo;
        } catch (error) {
            console.error(error);
            transaction.rollback();
            throw new InternalServerErrorException();
        }
    }

    async updateReply(comment_id, post_id, data: UpdateReCommentDto, user: User | null) {
        const comment = await this.commentService.update(comment_id, post_id, {
            content: data.content,
            attatchment_files: data.attatchment_files
        });
        const rData = new CommentDto({ ...comment.get({ plain: true }), is_read: true });
        const result = await this.commonInfoService.setCommentInfo([rData], user);
        return result[0];
    }

    async deletePost(post: Posts, user: User) {
        const transaction = await this.postsService.sequelize().transaction();
        const postedInfo = await this.postedAtService.findByPostsId(post.id);
        try {
            await this.postedAtService.deleteByPostId(post.id, transaction);
            await this.postsService.delete(post.id, transaction);
            await this.channelPostService.deleteCommunityPost(post.id, user.channel_id, ChannelPostType.USER);
            if (postedInfo.community && Array.isArray(postedInfo.community) === true && postedInfo.community.length > 0) {
                await this.channelPostService.deleteCommunityPost(
                    post.id,
                    postedInfo.community.map(item => item.id),
                    ChannelPostType.COMMUNITY,
                    transaction
                );
                await this.communityService.setPostCnt(postedInfo.community.map(item => item.id), false, transaction)
            }
            if (postedInfo.portfolio_ids && postedInfo.portfolio_ids.length > 0) {
                await this.portfoliPostService.delete(post.id, user.channel_id, postedInfo.portfolio_ids);
            }
            await transaction.commit();
            return { success: true };
        } catch (error) {
            console.error(error);
            transaction.rollback();
            throw new InternalServerErrorException();
        }
    }
    async outPost(post: Posts, user: User, data: PostOutDto) {
        const existCommunity = await this.communityService.findOne(data.community_id);
        if (existCommunity === null) throw new NotFoundException("일치하는 커뮤니티가 없습니다.");

        const existChannelPost = await this.channelPostService.findCommunityPost(
            post.id,
            data.community_id,
            ChannelPostType.COMMUNITY
        );
        if (existChannelPost === null) throw new NotFoundException("일치하는 포스팅이 없습니다.");

        const postedData = await this.postedAtService.findByPostsId(post.id);
        if (postedData === null) throw new InternalServerErrorException();
        const transaction = await this.postsService.sequelize().transaction();
        try {
            await this.postedAtService.update(
                postedData.id,
                {
                    posts_id: post.id,
                    channel_id: user.channel_id,
                    community: postedData.community.filter(item => item.id !== data.community_id)
                },
                transaction
            );
            await this.channelPostService.deleteCommunityPost(
                post.id,
                data.community_id,
                ChannelPostType.COMMUNITY,
                transaction
            );
            await this.communityService.setPostCnt(data.community_id, true, transaction)
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

    async createComment(post_id: string, data: CreateCommentDto, user?: User) {
        const postInfo = await this.postsService.findOne(post_id);
        if (postInfo === null) {
            throw new NotFoundException();
        } else if (data.attatchment_files === undefined && data.content === undefined) {
            throw new BadRequestException();
        }
        const writerInfo = await this.userService.findOne(data.user_id);
        if (writerInfo === null) {
            throw new NotFoundException();
        }
        const comment = await this.commentService.createWidhPostId(post_id, {
            ...data,
            content: data.content,
            user_id: data.user_id,
            user_uid: writerInfo.uid,
            type: CommentType.COMMENT
        });

        const authorTokenInfo = await this.fcmService.getTokenByUserId(postInfo.user_id);
        await this.fcmService.sendFCM(
            authorTokenInfo,
            "Comments",
            `${writerInfo.name} commented on ${postInfo.content}
            ${comment.content}`,
            FcmEnumType.USER,
            post_id
        );

        await this.postsService.commentCnt(post_id, true);
        const rData = new CommentDto({ ...comment.get({ plain: true }), is_read: true });
        const result = await this.commonInfoService.setCommentInfo([rData], user);
        return result[0];
    }

    async createReply(post_id: string, data: CreateCommentDto, user?: User) {
        const postInfo = await this.postsService.findOne(post_id);
        if (postInfo === null) {
            throw new NotFoundException();
        } else if (data.attatchment_files === undefined && data.content === undefined) {
            throw new BadRequestException();
        }
        const parentComment = await this.commentService.findOne(data.parent_id);
        if (parentComment === null) {
            throw new NotFoundException();
        }
        //TODO:내가 해당 커뮤니티에 블락인지 체크
        const existComment = await this.commentService.findOne(data.parent_id);
        if (!existComment) {
            throw new HttpException("NOT_FOUND", HttpStatus.NOT_FOUND);
        }
        const comment = await this.commentService.createWidhPostId(post_id, {
            ...data,
            content: data.content,
            parent_id: data.parent_id,
            user_id: data.user_id,
            type: CommentType.REPLY
        });
        const rData = new CommentDto({ ...comment.get({ plain: true }), is_read: true });
        const result = await this.commonInfoService.setCommentInfo([rData], user);
        return result[0];
    }
}