import { BadRequestException, Body, ClassSerializerInterceptor, Controller, Delete, Get, InternalServerErrorException, NotFoundException, Param, Post, Put, Query, UseInterceptors, UsePipes, ValidationPipe } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { CurrentUser } from "src/auth/user-auth-decorator";
import { UserAuthGuard } from "src/auth/user-auth.guard";
import { ChannelPostService } from "src/channel-post/channel-post.service";
import { ChannelPostType } from "src/channel-post/enum/channelposttype.enum";
import { PortfolioPostService } from "src/portfolio/portfolio-post/portfolio-post.service";
import { PostedAtService } from "src/posted_at/posted_at.service";
import { PostFunctionType } from "src/posts/enum/post-posttype.enum";
import { Posts } from "src/posts/posts.entity";
import { PostsService } from "src/posts/posts.service";
import { User } from "src/user/user.entity";
import { UserService } from "src/user/user.service";
import { ZempieUseGuards } from "src/util/decorators/ZempieUseGaurd";
import { ChoiceLogService } from "./choice/choice-log/choice-log.service";
import { ChoiceService } from "./choice/choice.service";
import { ChoiceDto } from "./choice/dto/choice.dto";
import { CreateChoiceDto } from "./choice/dto/create-choice.dto";
import { CreatePollDto } from "./dto/create-poll.dto";
import { PollDto, PostsPollDto } from "./dto/poll.dto";
import { UpdatePollDto, UpdatePostsPollDto } from "./dto/update-poll.dto";
import { PollLogicService } from "./poll.logic.service";
import { PollService } from "./poll.service";

@Controller("api/v1/poll")
@ApiTags("api/v1/poll")
export class PollController {
    constructor(
        private pollService: PollService, private postsService: PostsService,
        private choiceService: ChoiceService, private choiceLogService: ChoiceLogService,
        private userService: UserService,
        private postedAtService: PostedAtService,
        private channelPostService: ChannelPostService,
        private portfoliPostService: PortfolioPostService,
        private pollLogicService: PollLogicService,
    ) { }

    // @Get()
    // async findPolls() {
    //     return await this.pollService.findAll();
    // }

    // @Get(":id")
    // async findPoll(@Param("id") id: string): Promise<PollDto> {
    //     const poll = await this.pollService.findOne(id);
    //     if (!poll) {
    //         throw new Error("NOT EXIST");
    //     }
    //     return poll;
    // }

    // @Get("findPollsByPostingId/:community_post_id")
    // async findPollsByPostingId(@Param("community_post_id") postingId: string) {
    //     const polls = await this.pollService.findBypostingId(postingId);
    //     return polls;
    // }

    // @Put(":id")
    // async update(@Param("id") postId: string) {
    //     return await this.pollService.update(postId);
    // }

    @Post()
    @ApiOperation({
        description: "투표 - 포스팅 작성"
    })
    @ZempieUseGuards(UserAuthGuard)
    @UseInterceptors(ClassSerializerInterceptor)
    @UsePipes(new ValidationPipe({ whitelist: false, transform: true }))
    async create(@CurrentUser() user: User, @Body() data: CreatePollDto): Promise<PostsPollDto> {
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

    @Put("/:post_id")
    @ApiOperation({
        description: "투표 - 포스팅 수정"
    })
    @ZempieUseGuards(UserAuthGuard)
    @UseInterceptors(ClassSerializerInterceptor)
    @UsePipes(new ValidationPipe({ whitelist: false, transform: true }))
    async update(
        @CurrentUser() user: User,
        @Param("post_id") post_id: string,
        @Body() data: UpdatePostsPollDto
    ): Promise<PostsPollDto> {
        const postInfo = await this.postsService.findOne(post_id);
        if (postInfo === null) {
            throw new NotFoundException("일치하는 포스팅이 없습니다.")
        } else if (postInfo.user_id !== user.id) {
            throw new NotFoundException("일치하는 포스팅이 없습니다.")
        } else if (postInfo.funtion_type !== PostFunctionType.POLL) {
            throw new NotFoundException("일치하는 포스팅이 없습니다.");
        }

        return await this.pollLogicService.updatePost(postInfo, data, user)
    }

    @Post("/:post_id")
    @ApiOperation({
        description: "투표 결과"
    })
    @ZempieUseGuards(UserAuthGuard)
    @UseInterceptors(ClassSerializerInterceptor)
    @UsePipes(new ValidationPipe({ whitelist: false, transform: true }))
    async pollResult(
        @CurrentUser() user: User,
        @Param("post_id") post_id: string, @Query("choice_id") choice_id: string) {
        let pollInfo = await this.pollService.findOneByPostId(post_id);
        if (pollInfo === null) {
            throw new NotFoundException("일치하는 게시글이 없습니다.")
        }
        if (choice_id != undefined && user !== null) {
            const info = await this.choiceLogService.findOne(user.id, choice_id)
            if (info === null) {
                await this.choiceLogService.create(user.id, choice_id);
                const cnt = await this.choiceLogService.countByChoiceId(choice_id);
                await this.choiceService.update(choice_id, { voted_cnt: cnt })
                pollInfo = await this.pollService.findOneByPostId(post_id);
            }
        }
        return new PollDto({ ...pollInfo.get({ plain: true }), choices: pollInfo.choices.map(item => new ChoiceDto({ ...item.get({ plain: true }) })) })
    }

    @Delete("poll/:post_id")
    @ApiOperation({
        description: "투표 - 포스팅 삭제"
    })
    @ZempieUseGuards(UserAuthGuard)
    @UseInterceptors(ClassSerializerInterceptor)
    @UsePipes(new ValidationPipe({ whitelist: false, transform: true }))
    async delete(@Param("post_id") post_id: string, @CurrentUser() user: User) {
        const info = await this.postsService.findOne(post_id);
        if (info === null) {
            throw new NotFoundException("일치하는 포스팅이 없습니다.");
        } else if (info.user_id !== user.id) {
            throw new NotFoundException("일치하는 포스팅이 없습니다.");
        } else if (info.funtion_type !== PostFunctionType.POLL) {
            throw new NotFoundException("일치하는 포스팅이 없습니다.");
        }
        return await this.pollLogicService.delete(info, user)
    }
}
