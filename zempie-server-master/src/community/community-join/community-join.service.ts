import { Inject, Injectable } from "@nestjs/common";
import sequelize, { Transaction } from "sequelize";
import { BaseService } from "src/abstract/base-service";
import { CommunityJoin } from "./community-join.entity";
import { CreateCommunityJoinDto } from "./dto/create-community-join.dto";
import { UpdateCommunityJoinDto } from "./dto/update-community-join.dto";
import { JoinState } from "./enum/joinstate.enum";

@Injectable()
export class CommunityJoinService extends BaseService<CommunityJoin> {
    constructor(
        @Inject("CommunityJoinRepository")
        private readonly communityJoinRepository: typeof CommunityJoin
    ) {
        super(communityJoinRepository);
    }

    async findAll() {
        return await this.communityJoinRepository.findAll();
    }

    async findbyUserId(user_id: number) {
        return await this.communityJoinRepository.findAll({
            where: {
                user_id: user_id
            },
            raw: true
        });
    }

    async findwithCommunityId(user_id: number, communityId: string, transaction?:Transaction) {
        return await this.communityJoinRepository.findOne({
            where: {
                user_id: user_id,
                community_id: communityId
            },
            transaction
        });
    }

    async findbyCommunityId(communityId: string) {
        return await this.communityJoinRepository.findAll({
            where: {
                community_id: communityId
            }
        });
    }

    async createJoin(data: CreateCommunityJoinDto, transaction?:Transaction) {
        await this.communityJoinRepository.create(data,{transaction});
        return true;
    }

    async exist(userId: number, communityId: string) {
        return await this.communityJoinRepository.findOne({
            where: {
                user_id: userId,
                community_id: communityId
            }
        });
    }

    async CommunityBlockList(communityId: string) {
        return await this.communityJoinRepository.findAll({
            where: {
                community_id: communityId,
                state: JoinState.BLOCK
            }
        });
    }

    async userBlock(userId: number, communityId: string, state: boolean) {
        const find = await this.communityJoinRepository.findOne({
            where: {
                user_id: userId,
                community_id: communityId
            }
        });
        if (state === true) {
            await this.communityJoinRepository.update({ state: JoinState.BLOCK }, { where: { id: find.id } });
        } else {
            await this.communityJoinRepository.update({ state: JoinState.ACTIVE }, { where: { id: find.id } });
        }
        return await this.findOne(find.id);
    }

    async findCommunityBlockUser(community_id: string, state: JoinState, offset?: number, limit?: number) {
        return super.find({
            where: {
                community_id: community_id,
                state: state
            },
            raw: true,
            offset: offset,
            limit: limit
        });
    }

    async updateblockType(id: string, state: JoinState) {
        await this.communityJoinRepository.update({ state: state }, { where: { id: id } });
        return await this.findOne(id);
    }

    async updatecommunityblockType(user_id: number, community_id: string, state: JoinState) {
        await this.communityJoinRepository.update(
            { state: state },
            { where: { user_id: user_id, community_id: community_id } }
        );
        return await this.communityJoinRepository.findOne({
            where: { user_id: user_id, community_id: community_id }
        });
    }

    async update(id: string, data: UpdateCommunityJoinDto, transaction?:Transaction) {
        const communityJoin = await this.findOne(id);
        if (!communityJoin) {
            throw new Error("NOT EXIST");
        }
        await this.communityJoinRepository.update(data, {
            where: {
                id
            },
            transaction
        });

        return await this.findOne(id);
    }

    async deletejoin(userId: number, communityId: string) {
        await this.communityJoinRepository.destroy({
            where: {
                user_id: userId,
                community_id: communityId
            }
        });
        return true;
    }

    async delete(id: string) {
        const exist = await this.communityJoinRepository.findOne({
            where: {
                id: id
            }
        });
        if (!exist) {
            throw new Error("NOT EXIST");
        }
        await this.communityJoinRepository.destroy({
            where: {
                id: id
            }
        });
        return true;
    }

    async deleteByCommunityId(community_id: string) {
        await this.communityJoinRepository.destroy({
            where: {
                communityId: [community_id]
            }
        });
        return true;
    }
}
