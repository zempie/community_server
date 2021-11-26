import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { ChannelPostService } from "src/channel-post/channel-post.service";
import { ChannelPostType } from "src/channel-post/enum/channelposttype.enum";
import { PortfolioPostService } from "src/portfolio/portfolio-post/portfolio-post.service";
import { PostedAtService } from "src/posted_at/posted_at.service";
import { Posts } from "src/posts/posts.entity";
import { PostsService } from "src/posts/posts.service";
import { User } from "src/user/user.entity";
import { UserService } from "src/user/user.service";
import { ChoiceLogService } from "./choice/choice-log/choice-log.service";
import { ChoiceService } from "./choice/choice.service";
import { ChoiceDto } from "./choice/dto/choice.dto";
import { CreateChoiceDto } from "./choice/dto/create-choice.dto";
import { CreatePollDto } from "./dto/create-poll.dto";
import { PollDto, PostsPollDto } from "./dto/poll.dto";
import { UpdatePostsPollDto } from "./dto/update-poll.dto";
import { PollService } from "./poll.service";

@Injectable()
export class PollLogicService {
    constructor(
        private pollService: PollService,
        private postsService: PostsService,
        private choiceService: ChoiceService,
        private choiceLogService: ChoiceLogService,
        private postedAtService: PostedAtService,
        private channelPostService: ChannelPostService,
        private portfoliPostService: PortfolioPostService,
        private userService: UserService,
    ) {
    }

    async createPoll(data: CreatePollDto) {
        const duration = data.duration;
        const pollData: CreateChoiceDto[] = data.pollData;
        if (pollData.length < 2) {
            throw new BadRequestException("투표항목을 2개 이상 넣어주세요.")
        }
        // const userId = user.id;
        const userInfo = await this.userService.findOneByUid(data.user_uid)
        delete data.duration;
        delete data.pollData;
        const transaction = await this.postsService.sequelize().transaction();
        try {
            const newPost = await this.postsService.create({ ...data, user_id: userInfo.id }, transaction);
            const newPoll = await this.pollService.create({ postsId: newPost.id, end_time: new Date(duration).getTime() }, transaction);
            const newChoices: ChoiceDto[] = await (await this.choiceService.create(pollData.map(item => ({ pollId: newPoll.id, title: item.title })), transaction)).map(item => new ChoiceDto({ ...item.get({ plain: true }) as ChoiceDto }))
            await transaction.commit();
            const retrunData: PostsPollDto = new PostsPollDto({
                ...newPost.get({ plain: true }) as Posts,
                user_uid: userInfo.uid,
                poll: new PollDto({ ...newPoll.get({ plain: true }) as PollDto, choices: newChoices })
            })
            return retrunData
        } catch (error) {
            console.error(error);
            transaction.rollback()
            throw new InternalServerErrorException("database error");
        }
    }

    async updatePost(postInfo: Posts, data: UpdatePostsPollDto, user: User) {
        const pollInfo = await this.pollService.findOneByPostId(postInfo.id);
        if (pollInfo === null) {
            throw new NotFoundException("일치하는 투표정보가 없습니다.")
        }
        const transaction = await this.postsService.sequelize().transaction();
        let updatePostInfo = postInfo;
        let updatePollInfo = pollInfo
        try {
            if (data.postsData) {
                updatePostInfo = await this.postsService.update(postInfo.id, { ...data.postsData }, transaction)
            }
            if (data.addChoice && data.addChoice.length > 0) {
                await this.choiceService.create(data.addChoice.map(item => ({ pollId: pollInfo.id, title: item.title })), transaction)
            }
            if (data.delChoice && data.delChoice.length > 0) {
                await this.choiceLogService.delete(data.delChoice, transaction)
                await this.choiceService.delete(data.delChoice, transaction)
            }
            if (data.pollData) {
                updatePollInfo = await this.pollService.update(pollInfo.id, data.pollData, transaction);
            }
            await transaction.commit();
            const retrunData: PostsPollDto = new PostsPollDto({
                ...updatePostInfo.get({ plain: true }) as Posts,
                user_uid: user.uid,
                poll: new PollDto({ ...updatePollInfo.get({ plain: true }) as PollDto, choices: updatePollInfo.choices.map(item => new ChoiceDto({ ...item.get({ plain: true }) })) })
            })
            return retrunData

        } catch (error) {
            console.error(error);
            transaction.rollback();
            throw new InternalServerErrorException("database error");
        }
    }
    

    async delete(info: Posts, user: User) {
        const transaction = await this.postsService.sequelize().transaction();
        const pollInfo = await this.pollService.findOneByPostId(info.id);
        const postedInfo = await this.postedAtService.findByPostsId(info.id);
        try {
            await this.postedAtService.deleteByPostId(info.id, transaction);
            await this.postsService.delete(info.id, transaction);
            await this.channelPostService.deleteCommunityPost(info.id, user.channel_id, ChannelPostType.USER);
            if (postedInfo.community && postedInfo.community.length > 0) {
                await this.channelPostService.deleteCommunityPost(
                    info.id,
                    postedInfo.community.map(item => item.id),
                    ChannelPostType.COMMUNITY,
                    transaction
                );
            }
            if (postedInfo.portfolio_ids && postedInfo.portfolio_ids.length > 0) {
                await this.portfoliPostService.delete(info.id, user.channel_id, postedInfo.portfolio_ids);
            }

            await this.choiceLogService.deleteByChoiceId(pollInfo.choices.map(item => item.id), transaction)
            await this.choiceService.delete(pollInfo.choices.map(item => item.id), transaction)
            if (pollInfo !== undefined && pollInfo !== null) {
                await this.pollService.delete(pollInfo.id, transaction);
            }

        } catch (error) {
            console.error(error);
            transaction.rollback();
            throw new InternalServerErrorException();
        }
        transaction.commit();
        return true
    }
}