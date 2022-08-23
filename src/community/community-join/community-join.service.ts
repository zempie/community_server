import { Inject, Injectable } from "@nestjs/common";
import sequelize, { QueryTypes, Transaction } from "sequelize";
import { BaseService } from "src/abstract/base-service";
import { User } from "src/user/user.entity";
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

    async findbyUserChannel(user_channel: string) {
        return await this.communityJoinRepository.findAll({
            where: {
                user_channel: user_channel
            },
            raw: true
        });
    }

    async findwithCommunityId(user_id: number, communityId: string, transaction?: Transaction) {
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

    async createJoin(data: CreateCommunityJoinDto, transaction?: Transaction) {
        await this.communityJoinRepository.create(data, { transaction });
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

    async update(id: string, data: UpdateCommunityJoinDto, transaction?: Transaction) {
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

    async cntByCommunityId(communityId: string): Promise<number>
    async cntByCommunityId(communityIds: string[]): Promise<{ community_id: string, cnt: number }[]>
    async cntByCommunityId(param: string | string[]) {
        if (Array.isArray(param)) {
            const data = param.length > 0 ? await this.communityJoinRepository.sequelize.query(`
                select cj.community_id as community_id, count(cj.id) as cnt from community_join as cj left join usersview as uv on cj.user_id = uv.id where cj.community_id in(:ids) and cj.state = :state and cj.deleted_at is null and uv.deleted_at is null  group by cj.community_id 
            `, {
                replacements: {
                    ids: param,
                    state: JoinState.ACTIVE
                },
                type: QueryTypes.SELECT,
                raw: true
            }) : []
            return data as { community_id: string, cnt: number }[]
        } else {
            return await this.communityJoinRepository.count({
                where: {
                    community_id: param,
                    state: JoinState.ACTIVE
                },
                include: [{
                    model: User,
                    where: {
                        deleted_at: null
                    }
                }]
            })
        }
    }
}
