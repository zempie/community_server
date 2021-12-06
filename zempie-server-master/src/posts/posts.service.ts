import { Inject, Injectable } from "@nestjs/common";
import { Posts } from "./posts.entity";
import { CreatePosts } from "./dto/create-posts.dto";
// import { UpdatePostsDto } from "./dto/update-posts.dto";
import { Poll } from "src/poll/poll.entity";
import { PostedAt } from "src/posted_at/posted_at.entity";
import { Transaction } from "sequelize/types";
import { FindOptions, Op } from "sequelize";
import { CommunityListDto } from "src/community/dto/community-list.dto";
import { TimeLineSort } from "src/timeline/enum/timeline-sort.enum";
import { TimelineListQueryDTO } from "src/timeline/dto/timeline-sort.dto";
import { BaseService } from "src/abstract/base-service";

@Injectable()
export class PostsService extends BaseService<Posts> {
    constructor(
        @Inject("PostsRepository")
        private readonly postsRepository: typeof Posts
    ) {
        super(postsRepository);
    }

    async findAll(query: CommunityListDto) {
        const options: FindOptions = {
            where: {},
            order: [["createdAt", "ASC"]],
            limit: query.limit ? query.limit : 5,
            offset: query.offset ? query.offset : 0,
            raw: true
        };
        if (query.posting !== undefined) {
            options.where = {
                content: { [Op.like]: `%${query.posting}%` }
            };
        } else if (query.hashtag !== undefined || query.hashtag !== null) {
            options.where = {
                hashtags: { [Op.like]: `%${query.hashtag}%` }
            };
        }
        return await super.find({ ...options });
    }

    async findTimeline(query: TimelineListQueryDTO, ids: string[]) {
        const options: FindOptions = {
            where: { id: ids },
            order: [["createdAt", "ASC"]],
            limit: query.limit ? query.limit : 5,
            offset: query.offset ? query.offset : 0,
            raw: true
        };
        if (query.sort === TimeLineSort.POPULAR) {
            options.where["like_cnt"] = { [Op.gte]: 30 };
        }
        return await this.postsRepository.findAll({
            ...options
        });
    }

    async findIds(ids: string[]) {
        return await this.postsRepository.findAll({
            where: {
                id: {
                    [Op.in]: ids
                }
            },
            raw: true
        });
    }

    async findbyUserId(user_id: number) {
        return this.postsRepository.findAndCountAll({
            where: {
                user_id: user_id
            }
        });
    }

    async findOne(id: string) {
        return (
            (await this.postsRepository.findOne({
                where: {
                    id: id
                },
                include: [Poll, PostedAt]
            })) ?? null
        );
    }

    async findRetweetOne(post_id: string, user_id: number) {
        return await this.postsRepository.findOne({
            where: {
                retweet_id: post_id,
                user_id: user_id,
                is_retweet: true
            }
        });
    }

    // async setRetweet(id: string, state: boolean) {
    //     return await this.postsRepository.update(
    //         { is_retweet: state },
    //         {
    //             where: {
    //                 id: id
    //             }
    //         }
    //     );
    // }

    async commentCnt(id: string, state: boolean) {
        // true +1, false -1
        if (state === true) {
            await this.postsRepository.increment({ comment_cnt: 1 }, { where: { id: id } });
        } else {
            await this.postsRepository.increment({ comment_cnt: -1 }, { where: { id: id } });
        }
        return await this.findOne(id);
    }

    async likeCnt(id: string, state: boolean) {
        // true +1, false -1
        if (state === true) {
            await this.postsRepository.increment({ like_cnt: 1 }, { where: { id: id } });
        } else {
            await this.postsRepository.increment({ like_cnt: -1 }, { where: { id: id } });
        }
        return await this.findOne(id);
    }

    async shareCnt(id: string, state: boolean) {
        // true +1, false -1
        if (state === true) {
            await this.postsRepository.increment({ shared_cnt: 1 }, { where: { id: id } });
        } else {
            await this.postsRepository.increment({ shared_cnt: -1 }, { where: { id: id } });
        }
        return await this.findOne(id);
    }

    async findBycommunityId(community_id: string) {
        return await this.postsRepository.findAndCountAll({
            where: {
                communityId: community_id
            }
            // include: [Community, User]
        });
    }

    async create(data: CreatePosts, transaction?: Transaction) {
        return await this.postsRepository.create(
            {
                ...data,
                post_type: data.post_state,
                content: data.post_contents
            },
            { raw: true, transaction }
        );
    }

    async update(id: string, data: Partial<CreatePosts>, transaction?: Transaction) {
        const Posts = await this.findOne(id);
        if (!Posts) {
            throw new Error("NOT EXIST");
        }
        await this.postsRepository.update(
            {
                ...data,
                post_type: data.post_state,
                content: data.post_contents
            },
            {
                where: {
                    id
                },
                transaction
            }
        );

        return await this.findOne(id);
    }

    async delete(id: string, transaction?: Transaction) {
        await this.postsRepository.destroy({
            where: {
                id: id
            },
            transaction
        });
        return true;
    }

    sequelize() {
        return this.postsRepository.sequelize;
    }
}
