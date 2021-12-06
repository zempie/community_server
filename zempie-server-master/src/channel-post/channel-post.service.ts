import { Inject, Injectable } from "@nestjs/common";
import { QueryTypes } from "sequelize";
import { FindOptions, Op, Transaction } from "sequelize";
import { BaseService } from "src/abstract/base-service";
import { Visibility } from "src/posts/enum/post-visibility.enum";
import { TimelineListQueryDTO } from "src/timeline/dto/timeline-sort.dto";
import { ChannelPost } from "./channel-post.entity";
import { CreateChannelPostDto } from "./dto/create-channelpost.dto";
import { ChannelPostType } from "./enum/channelposttype.enum";

@Injectable()
export class ChannelPostService extends BaseService<ChannelPost> {
    constructor(
        @Inject("ChannelPostRepository")
        private readonly channelPostRepository: typeof ChannelPost
    ) {
        super(channelPostRepository);
    }

    async findaaa() {
        return await this.channelPostRepository.findAll();
    }

    async update(id: string, type: Visibility) {
        await this.channelPostRepository.update({ visibility: type }, { where: { post_id: id } });
    }

    async updateChannelId(community_id: string, channel_id: string, change_channel_id: string) {
        await this.channelPostRepository.update(
            {
                channel_id: change_channel_id
            },
            {
                where: {
                    community_id: community_id,
                    channel_id: channel_id
                }
            }
        );
    }

    async create(data: CreateChannelPostDto[], transaction?: Transaction);
    async create(data: CreateChannelPostDto, transaction?: Transaction);
    async create(data: CreateChannelPostDto | CreateChannelPostDto[], transaction?: Transaction) {
        if (Array.isArray(data)) {
            return await this.channelPostRepository.bulkCreate(data, { transaction });
        } else {
            return await this.channelPostRepository.create(data, { transaction });
        }
    }

    async findAll(channel_id: string, query: TimelineListQueryDTO) {
        const options: FindOptions = {
            where: { channel_id: channel_id },
            order: [["createdAt", "ASC"]],
            limit: query.limit ? query.limit : 5,
            offset: query.offset ? query.offset : 0,
            raw: true
        };
        return await this.channelPostRepository.findAll({
            ...options
        });
    }

    async countCommunityPin(community_id: string, type: ChannelPostType) {
        const postcnt = await this.channelPostRepository.findAndCountAll({
            where: {
                community_id: community_id,
                channel_id: null,
                type: type,
                is_pinned: true
            }
        });
        return postcnt.count;
    }

    async countCommunityChannelPin(community_id: string, channel_id: string, type: ChannelPostType) {
        const postcnt = await this.channelPostRepository.findAndCountAll({
            where: {
                community_id: community_id,
                channel_id: channel_id,
                type: type,
                is_pinned: true
            }
        });

        return postcnt.count;
    }

    async countUserChannelPin(channel_id: string, type: ChannelPostType) {
        const postcnt = await this.channelPostRepository.findAndCountAll({
            where: {
                community_id: null,
                channel_id: channel_id,
                type: type,
                is_pinned: true
            }
        });
        return postcnt.count;
    }

    async setPin(id: string, state: boolean) {
        await this.channelPostRepository.update(
            { is_pinned: state },
            {
                where: {
                    id: id
                }
            }
        );
        return true;
    }

    async findCommunityChannelPost(post_id: string, community_id: string, channel_id: string, type: ChannelPostType) {
        return await this.channelPostRepository.findOne({
            where: {
                post_id: post_id,
                community_id: community_id,
                channel_id: channel_id,
                type: type
            }
        });
    }

    async findUserChannelPost(post_id: string, channel_id: string, type: ChannelPostType) {
        return await this.channelPostRepository.findOne({
            where: {
                post_id: post_id,
                community_id: null,
                channel_id: channel_id,
                type: type
            }
        });
    }

    async findCommunityPost(post_id: string, community_id: string, type: ChannelPostType) {
        return await this.channelPostRepository.findOne({
            where: {
                post_id: post_id,
                community_id: community_id,
                channel_id: null,
                type: type
            }
        });
    }

    async findOneBychannelIdPostId(channel_id: string, post_id: string, type?: ChannelPostType, transaction?: Transaction) {
        return await this.channelPostRepository.findOne({
            where: {
                post_id: post_id,
                channel_id: channel_id,
                type
            },
            transaction: transaction
        });
    }

    async deleteCommunityPost(post_id: string, community_id: string, type: ChannelPostType, transaction?: Transaction);
    async deleteCommunityPost(
        post_id: string,
        community_ids: string[],
        type: ChannelPostType,
        transaction?: Transaction
    );
    async deleteCommunityPost(
        post_id: string,
        params: string | string[],
        type: ChannelPostType,
        transaction?: Transaction
    ) {
        if (Array.isArray(params)) {
            return await this.channelPostRepository.destroy({
                where: {
                    post_id: post_id,
                    community_id: {
                        [Op.in]: params
                    },
                    type: type
                },
                transaction
            });
        } else {
            return await this.channelPostRepository.destroy({
                where: {
                    post_id: post_id,
                    community_id: params,
                    type: type
                },
                transaction
            });
        }
    }

    async cntUserPostCommunity(community_id: string, userIds: number[]): Promise<{ user_id: number, cnt: number }[]> {
        return await this.channelPostRepository.sequelize.query(`
            SELECT p.user_id as user_id, count(p.id) as cnt from channel_post cp 
            left join posts p on cp.post_id = p.id where p.deletedAt is not null and p.user_id in(:userIds) and cp.community_id = :community_id and cp.deletedAt is not null
        `, {
            replacements: {
                community_id: community_id,
                userIds: userIds
            },
            type: QueryTypes.SELECT,
            raw: true
        })
    }
}
