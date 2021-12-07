import { Inject, Injectable } from "@nestjs/common";
import { FindAndCountOptions, OrderItem } from "sequelize/types";
import { BaseService } from "src/abstract/base-service";
import { ChannelState } from "./channelstate.enum";
import { CommunityChannel } from "./community-channel.entity";
import { CreateCommunityChannelDto } from "./dto/create-community-channel.dto";
import { UpdateCommunityChannelDto } from "./dto/update-community-channel.dto";

@Injectable()
export class CommunityChannelService extends BaseService<CommunityChannel> {
    constructor(
        @Inject("CommunityChannelRepository")
        private readonly communityChannelRepository: typeof CommunityChannel
    ) {
        super(communityChannelRepository);
    }

    async findAll() {
        return await this.communityChannelRepository.findAll();
    }

    async findOne(channelId: string) {
        return await this.communityChannelRepository.findOne({
            where: {
                id: channelId
            }
        });
    }

    async findChannelWithCommu(communityId: string, channelId: string) {
        return await this.communityChannelRepository.findOne({
            where: {
                id: channelId,
                community_id: communityId
            }
        });
    }

    async findbyUserId(userId: string) {
        return await this.communityChannelRepository.findAndCountAll({
            where: {
                userId: userId
            }
        });
    }

    async myCommu(userId: string) {
        const find = await this.communityChannelRepository.findAndCountAll({
            where: {
                userId: userId
            },
            order: [["createdAt", "DESC"]]
        });

        return find;
    }

    async findbyCommunityId(communityId: string, order?: OrderItem) {
        const inputWhere: FindAndCountOptions = {
            where: {
                community_id: communityId
            }
        };
        if (order) {
            inputWhere.order = [order];
        }
        return super.find(inputWhere);
    }

    async create(data: CreateCommunityChannelDto) {
        return await this.communityChannelRepository.create(data);
    }

    async exist(userId: string, communityId: string) {
        return await this.communityChannelRepository.findOne({
            where: {
                userId: userId,
                community_id: communityId
            }
        });
    }

    async update(community_id: string, channel_id: string, data: UpdateCommunityChannelDto) {
        let type: ChannelState = ChannelState.PUBLIC;
        if (data.is_private === true) {
            type = ChannelState.PRIVATE;
        }
        await this.communityChannelRepository.update(
            { ...data, state: type },
            {
                where: {
                    id: channel_id,
                    community_id: community_id
                }
            }
        );

        return await this.findChannelWithCommu(community_id, channel_id);
    }

    async deleteWidhChannelId(community_id: string, channel_id: string) {
        const exist = await this.communityChannelRepository.findOne({
            where: {
                id: channel_id,
                community_id: community_id
            }
        });
        if (exist === null) {
            throw new Error();
        }
        await this.communityChannelRepository.destroy({
            where: {
                id: channel_id,
                community_id: community_id
            }
        });
        return true;
    }

    async deleteByCommunityId(community_id: string) {
        await this.communityChannelRepository.destroy({
            where: {
                community_id: [community_id]
            }
        });
        return true;
    }
}
