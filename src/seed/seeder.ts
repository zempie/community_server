import { Inject, Injectable, Logger } from "@nestjs/common";
import * as dotenv from "dotenv";
import * as faker from 'faker'
import * as randomEmail from "random-email";
import { Op } from "sequelize";
import { ChannelState } from "src/community/community-channel/channelstate.enum";
import { CommunityChannel } from "src/community/community-channel/community-channel.entity";
import { CommunityJoin } from "src/community/community-join/community-join.entity";
import { JoinState } from "src/community/community-join/enum/joinstate.enum";
import { JoinStatus } from "src/community/community-join/enum/joinststus.enum";
import { Community } from "src/community/community.entity";
import { Follow } from "src/follow/follow.entity";
import { Choice } from "src/poll/choice/choice.entity";
import { Poll } from "src/poll/poll.entity";
import { PostedAt } from "src/posted_at/posted_at.entity";
import { PostFunctionType, PostType } from "src/posts/enum/post-posttype.enum";
import { Visibility } from "src/posts/enum/post-visibility.enum";
import { Posts } from "src/posts/posts.entity";
import { User } from "src/user/user.entity";
import * as moment from 'moment'
import { ChoiceLog } from "src/poll/choice/choice-log/choice-log.entity";
import { Comment } from "src/comment/comment.entity";
import { CommentType } from "src/comment/enum/commenttype.enum";
import { ChannelPost } from "src/channel-post/channel-post.entity";
import { ChannelPostType } from "src/channel-post/enum/channelposttype.enum";
import { GamePost } from "src/game/game-post/game-post.entity";
import { PortfolioPost } from "src/portfolio/portfolio-post/portfolio-post.entity";
import { Sequelize } from "sequelize";
import { Block } from "src/block/block.entity";
import { BlockType } from "src/block/enum/blocktype.enum";
import { Portfolio } from "src/portfolio/portfolio.entity";
import { Game } from "src/game/game.entity";
dotenv.config();
const SECRET_KEY = process.env.SECRET_KEY;

@Injectable()
export class Seeder {
    constructor(
        private readonly logger: Logger,
        @Inject("UserRepository")
        private readonly userRepository: typeof User,
        @Inject("CommunityRepository")
        private readonly communityRepository: typeof Community,
        @Inject("CommunityChannelRepository")
        private readonly communityChannelRepository: typeof CommunityChannel,
        @Inject("CommunityJoinRepository")
        private readonly communityJoinRepository: typeof CommunityJoin,
        @Inject("FollowRepository")
        private readonly followRepository: typeof Follow,
        @Inject("PostsRepository")
        private readonly postsRepository: typeof Posts,
        @Inject("PostedAtRepository")
        private readonly postedAtRepository: typeof PostedAt,
        @Inject("PollRepository")
        private readonly pollRepository: typeof Poll,
        @Inject("ChoiceRepository")
        private readonly choiceRepository: typeof Choice,
        @Inject("ChoiceLogRepository")
        private readonly choiceLogRepository: typeof ChoiceLog,
        @Inject("CommentRepository")
        private readonly commentRepository: typeof Comment,
        @Inject("ChannelPostRepository")
        private readonly channelPostRepository: typeof ChannelPost,
        @Inject("GamePostRepository")
        private readonly gamePostRepository: typeof GamePost,
        @Inject("GameRepository")
        private readonly gameRepository: typeof Game,
        @Inject("PortfolioPostRepository")
        private readonly portfolioPostRepository: typeof PortfolioPost,
        @Inject("PortfolioRepository")
        private readonly portfolioRepository: typeof Portfolio,
        @Inject("BlockRepository")
        private readonly blockRepository: typeof Block,
    ) {

    }
    async seed() {
        await this.createCommunity();
        const allCommuniyu = await this.communityRepository.findAll();
        for await (const com of allCommuniyu) {
            await this.createChannel(com.id);
        }
        for await (const com of allCommuniyu) {
            await this.createCommuityMember(com.id);
        }
        for await (const com of allCommuniyu) {
            await this.createCommunityBlock(com.id);
        }
        const allUsers = await this.userRepository.findAll();
        for await (const user of allUsers) {
            await this.createFollow(user.id)
            const count = faker.datatype.number({ min: 2, max: 5 })
            for await (const num of new Array(count)) {
                await this.createPortfolio(user.id)
            }
        }
        const allJoinUsers = await this.communityJoinRepository.findAll();
        for await (const user of allJoinUsers) {
            const allChannel = await this.communityChannelRepository.findAll({
                where: {
                    community_id: user.community_id
                }
            })
            for await (const channel of allChannel) {
                const count = faker.datatype.number({ min: 2, max: 5 })
                for await (const num of new Array(count)) {
                    await this.createPosts(user.user_id, user.community_id, channel.id)
                    const userInfo = await this.userRepository.findOne({ where: { id: user.user_id } });
                    const gameInfo = await this.gameRepository.findOne({
                        order: Sequelize.literal('rand()')
                    })
                    const portfolioInfo = await this.portfolioRepository.findOne({
                        where: {
                            user_id: user.user_id
                        },
                        order: Sequelize.literal('rand()')
                    })
                    await this.createPostsAllTimeLine(user.user_id, user.community_id, channel.id, gameInfo.id, portfolioInfo.id, userInfo.channel_id)
                }
            }
        }
        for await (const user of allJoinUsers) {
            const allChannel = await this.communityChannelRepository.findAll({
                where: {
                    community_id: user.community_id
                }
            })
            for await (const channel of allChannel) {
                const count = faker.datatype.number({ min: 1, max: 3 })
                for await (const num of new Array(count)) {
                    await this.createPollPost(user.user_id, user.community_id, channel.id)
                }
            }
        }

        const allPosts = await this.postsRepository.findAll();

        for await (const po of allPosts) {
            const count = faker.datatype.number({ min: 1, max: 5 })
            const randomIndexs = this.selectIndex(allUsers.length - 1, count);
            for await (const num of randomIndexs) {
                const user = allUsers[num];
                await this.createComment(po.id, user.id, user.uid)
            }
        }

        const allComments = await this.commentRepository.findAll({
            where: {
                type: CommentType.COMMENT
            }
        })

        for await (const po of allComments) {
            const count = faker.datatype.number({ min: 1, max: 5 })
            const randomIndexs = this.selectIndex(allUsers.length - 1, count);
            for await (const num of randomIndexs) {
                const user = allUsers[num];
                await this.createReplyComment(po.post_id, po.id, user.id, user.uid)
            }
        }
    }

    async createCommunity(cnt: number = 10) {
        this.logger.log("커뮤니티 생성 시작")
        const allUsers = await this.userRepository.findAll({
            where: {
                activated: 1
            }
        })
        for await (const num of new Array(cnt).map((_, i) => i)) {
            const randomIndexs = this.selectIndex(allUsers.length - 1, 3);

            const newCommunity = await this.communityRepository.create({
                owner_id: allUsers[randomIndexs[0]].id,
                manager_id: allUsers[randomIndexs[1]].id,
                submanager_id: allUsers[randomIndexs[2]].id,
                name: faker.random.words(10),
                // url: "httts://www.naver.com",
                description: faker.random.words(50),
                profile_img: "https://cataas.com/cat/says/zempie",
                banner_img: "https://cataas.com/cat/says/zempie"
            })

            await this.communityJoinRepository.create({
                community_id: newCommunity.id,
                user_id: allUsers[randomIndexs[0]].id,
                status: JoinStatus.OWNER
            })

            await this.communityJoinRepository.create({
                community_id: newCommunity.id,
                user_id: allUsers[randomIndexs[1]].id,
                status: JoinStatus.MANAGER
            })

            await this.communityJoinRepository.create({
                community_id: newCommunity.id,
                user_id: allUsers[randomIndexs[2]].id,
                status: JoinStatus.SUBMANAGER
            })
        }
        this.logger.log("커뮤니티 생성 종료")
    }

    async createChannel(communityId: string, cnt: number = 5) {
        this.logger.log("커뮤니티 채널 생성 시작")
        const allUsers = await this.userRepository.findAll({
            where: {
                activated: 1
            }
        })
        for await (const num of new Array(cnt).map((_, i) => i)) {
            const randomIndexs = this.selectIndex(allUsers.length - 1, 1);

            await this.communityChannelRepository.create({
                user_id: allUsers[randomIndexs[0]].id,
                community_id: communityId,
                title: faker.random.words(10),
                description: faker.random.words(50),
                profile_img: "https://cataas.com/cat/says/zempie",
                state: faker.datatype.number(1) === 0 ? ChannelState.PUBLIC : ChannelState.PRIVATE
            })

            await this.communityJoinRepository.create({
                community_id: communityId,
                user_id: allUsers[randomIndexs[0]].id,
                status: JoinStatus.SUBMANAGER
            })
        }
        this.logger.log("커뮤니티 채널 생성 종료")
    }

    async createCommuityMember(communityId: string, cnt: number = 10) {
        this.logger.log("커뮤니티 맴버 생성 시작")
        const notMemberUsers = await this.communityJoinRepository.findAll({
            where: {
                status: {
                    [Op.not]: JoinStatus.MEMBER
                }
            }
        })
        const notJoinUsers = await this.userRepository.findAll({
            where: {
                id: {
                    [Op.notIn]: notMemberUsers.map(item => item.id)
                }
            }
        })
        const randomIndexs = this.selectIndex(notJoinUsers.length - 1, cnt);
        for await (const num of randomIndexs) {
            const ne = notJoinUsers[num];
            await this.communityJoinRepository.create({
                community_id: communityId,
                user_id: ne.id,
                status: JoinStatus.MEMBER
            })
        }
        this.logger.log("커뮤니티 맴버 생성 종료")
    }

    async createCommunityBlock(communityId: string, cnt: number = 1) {
        this.logger.log("커뮤니티 블럭 생성 시작")
        const communityUsers = await this.communityJoinRepository.findAll({
            where: {
                community_id: communityId,
                status: JoinStatus.MEMBER
            }
        })
        for await (const num of new Array(cnt).map((_, i) => i)) {
            const randomIndexs = this.selectIndex(communityUsers.length - 1, 1);
            const targetUser = communityUsers[randomIndexs[0]];
            const communityInfo = await this.communityRepository.findOne({
                where: {
                    id: communityId
                }
            })
            const checkChannelOwner = await this.communityChannelRepository.findOne({
                where: {
                    user_id: targetUser.user_id,
                    community_id: communityId
                }
            })
            if (checkChannelOwner === null) {
                await this.blockRepository.create({
                    community_id: communityId,
                    user_id: communityInfo.owner_id,
                    target_id: targetUser.user_id,
                    reason: "dumy",
                    type: BlockType.COMMUNITYBLOCK
                })

                await this.communityJoinRepository.update({ state: faker.datatype.number(1) === 0 ? JoinState.BLOCK : JoinState.KICK }, {
                    where: {
                        id: targetUser.id
                    }
                })
            }
        }
        this.logger.log("커뮤니티 블럭 생성 종료")
    }

    async createFollow(userId: number, cnt: number = 12) {
        this.logger.log("팔로우 생성 시작")

        const allUsers = await this.userRepository.findAll({
            where: {
                id: {
                    [Op.not]: userId
                }
            },
            limit: cnt
        })
        for await (const user of allUsers) {
            await this.followRepository.create({
                user_id: userId,
                follow_id: user.id
            })
        }

        this.logger.log("팔로우 생성 종료")
    }

    async createPosts(userId: number, community_id: string, channel_id: string) {
        this.logger.log("커뮤니티 일반 포스팅 생성 시작");
        const visibilityNum = faker.datatype.number(2);
        const newPost = await this.postsRepository.create({
            user_id: userId,
            funtion_type: PostFunctionType.NONE,
            post_type: faker.datatype.number(1) === 0 ? PostType.BLOG : PostType.SNS,
            content: faker.random.words(100),
            visibility: visibilityNum === 0 ? Visibility.FOLLOWER : (visibilityNum === 1 ? Visibility.PUBLIC : Visibility.PRIVATE),
            hashtags: [faker.random.word(), faker.random.word(), faker.random.word()],
            read_cnt: faker.datatype.number(400),
            shared_cnt: faker.datatype.number(400),
            
        })
        await this.postedAtRepository.create({
            posts_id: newPost.id,
            community: [{ id: community_id, channel_id: channel_id }]
        })
        await this.channelPostRepository.create({
            community_id: community_id,
            channel_id: channel_id,
            post_id: newPost.id,
            type: ChannelPostType.COMMUNITY
        })
        this.logger.log("커뮤니티 포스팅 생성 종료");
    }

    async createPostsAllTimeLine(userId: number, community_id: string, channel_id: string, game_id: number, portfolio_id: string, myChannelId: string) {
        this.logger.log("커뮤니티 모든 타임라인 포스팅 생성 시작");
        const visibilityNum = faker.datatype.number(2);
        const newPost = await this.postsRepository.create({
            user_id: userId,
            funtion_type: PostFunctionType.NONE,
            post_type: faker.datatype.number(1) === 0 ? PostType.BLOG : PostType.SNS,
            content: faker.random.words(100),
            visibility: visibilityNum === 0 ? Visibility.FOLLOWER : (visibilityNum === 1 ? Visibility.PUBLIC : Visibility.PRIVATE),
            hashtags: [faker.random.word(), faker.random.word(), faker.random.word()],
            read_cnt: faker.datatype.number(400),
            shared_cnt: faker.datatype.number(400),
            
        })
        await this.postedAtRepository.create({
            posts_id: newPost.id,
            channel_id: myChannelId,
            game_id: game_id,
            portfolio_ids: [portfolio_id],
            community: [{ id: community_id, channel_id: channel_id }]
        })
        await this.channelPostRepository.create({
            community_id: community_id,
            channel_id: channel_id,
            post_id: newPost.id,
            type: ChannelPostType.COMMUNITY,
            is_pinned: faker.datatype.number(1) === 0 ? true : false
        })
        await this.channelPostRepository.create({
            channel_id: myChannelId,
            post_id: newPost.id,
            type: ChannelPostType.USER,
            is_pinned: faker.datatype.number(1) === 0 ? true : false
        })
        await this.gamePostRepository.create({
            game_id: game_id,
            post_id: newPost.id,
            is_pinned: faker.datatype.number(1) === 0 ? true : false
        })
        await this.portfolioPostRepository.create({
            channel_id: myChannelId,
            portfolio_id: portfolio_id,
            post_id: newPost.id,
            is_pinned: faker.datatype.number(1) === 0 ? true : false
        })
        this.logger.log("커뮤니티 모든 타임라인 포스팅 생성 종료");
    }

    async createPollPost(userId: number, community_id: string, channel_id: string) {
        this.logger.log("커뮤니티 투표 포스팅 생성 시작");
        const visibilityNum = faker.datatype.number(2);
        const newPost = await this.postsRepository.create({
            user_id: userId,
            funtion_type: PostFunctionType.POLL,
            post_type: faker.datatype.number(1) === 0 ? PostType.BLOG : PostType.SNS,
            content: faker.random.words(100),
            visibility: visibilityNum === 0 ? Visibility.FOLLOWER : (visibilityNum === 1 ? Visibility.PUBLIC : Visibility.PRIVATE),
            hashtags: [faker.random.word(), faker.random.word(), faker.random.word()],
            read_cnt: faker.datatype.number(400),
            shared_cnt: faker.datatype.number(400),
            
        })
        await this.postedAtRepository.create({
            posts_id: newPost.id,
            community: [{ id: community_id, channel_id: channel_id }]
        })
        await this.channelPostRepository.create({
            community_id: community_id,
            channel_id: channel_id,
            post_id: newPost.id,
            type: ChannelPostType.COMMUNITY,
            is_pinned: faker.datatype.number(1) === 0 ? true : false
        })
        const endDate = moment().add(1, "week");
        const newPoll = await this.pollRepository.create({
            postsId: newPost.id,
            duration: endDate.unix() - moment().unix(),
            end_time: moment().add(1, "week").unix()
        })
        const choiceMaxCnt = faker.datatype.number({ min: 2, max: 5 });
        const choices = [];
        for await (const a of new Array(choiceMaxCnt)) {
            const newChoice = await this.choiceRepository.create({
                pollId: newPoll.id,
                title: faker.random.word(),
            })
            choices.push(newChoice);
        }
        const communityUsers = await this.communityJoinRepository.findAll({
            where: {
                community_id: community_id
            }
        })
        for await (const user of communityUsers) {
            if (faker.datatype.number(1) === 0) {
                const num = faker.datatype.number(choices.length - 1)
                await this.choiceLogRepository.create({
                    user_id: user.user_id,
                    choice_id: choices[num].id
                })
            }
        }
        for await (const ch of choices) {
            const count = await this.choiceLogRepository.count({
                where: {
                    choice_id: ch.id
                }
            })
            await this.choiceRepository.update({ voted_cnt: count }, {
                where: {
                    id: ch.id
                }
            })
        }

        this.logger.log("커뮤니티 투표 생성 종료");
    }

    async createComment(postId: string, user_id: number, user_uid: string) {
        this.logger.log("커뮤니티 일반 댓글 생성 시작");
        const newComment = await this.commentRepository.create({
            user_id: user_id,
            user_uid: user_uid,
            post_id: postId,
            type: CommentType.COMMENT,
            content: faker.random.words(10),
        })
        this.logger.log("커뮤니티 일반 댓글 생성 종료");
    }

    async createReplyComment(postId: string, comment_id: string, user_id: number, user_uid: string) {
        this.logger.log("커뮤니티 대댓글 생성 시작");
        const newComment = await this.commentRepository.create({
            user_id: user_id,
            user_uid: user_uid,
            post_id: postId,
            type: CommentType.REPLY,
            content: faker.random.words(10),
            parent_id: comment_id
        })
        this.logger.log("커뮤니티 대댓글 생성 종료");
    }

    async createPortfolio(user_id: number) {
        this.logger.log("포트폴리오 생성 시작");
        await this.portfolioRepository.create({
            title: faker.random.words(10),
            description: faker.random.words(50),
            user_id: user_id
        })
        this.logger.log("포트폴리오 생성 종료");
    }

    selectIndex = (totalIndex, selectingNumber) => {
        let randomIndexArray = []
        for (let i = 0; i < selectingNumber; i++) {   //check if there is any duplicate index
            const randomNum = Math.floor(Math.random() * totalIndex)
            if (randomIndexArray.indexOf(randomNum) === -1) {
                randomIndexArray.push(randomNum)
            } else { //if the randomNum is already in the array retry
                i--
            }
        }
        return randomIndexArray
    }


}