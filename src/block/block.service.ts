import { Inject, Injectable } from "@nestjs/common";
import { QueryTypes } from "sequelize";
import { Op } from "sequelize";
import { Block } from "./block.entity";
import { CreateCommunityBlockDto, CreateCommunityKickDto, CreateUserBlockDto } from "./dto/create-block.dto";
import { BlockType } from "./enum/blocktype.enum";

interface BlockCntAddUserIdInterface {
    user_id: number;
    target_id: number | null;
    isCommunityBlcok: boolean;
    isBlock: boolean;
    isMute: boolean;
    isKick: boolean;
}

interface BlockCntAddUserIdRowInterface {
    user_id: number;
    target_id: number | null;
    isCommunityBlcok: number;
    isBlock: number;
    isMute: number;
    isKick: number;
}

@Injectable()
export class BlockService {
    constructor(
        @Inject("BlockRepository")
        private readonly blockRepository: typeof Block
    ) { }

    async findAll() {
        return await this.blockRepository.findAll();
    }

    async findOne(id: string) {
        return await this.blockRepository.findOne({
            where: {
                id: id
            }
        });
    }

    async findByUserId(user_id: number, type: BlockType) {
        return await this.blockRepository.findAll({
            where: {
                user_id: user_id,
                type: type
            },
            raw: true
        });
    }

    async findblockuser(user_id: number, target_id: number) {
        return await this.blockRepository.findAll({
            where: {
                [Op.or]: [
                    { community_id: null, user_id: user_id, target_id: target_id, type: BlockType.USERBLOCK },
                    { community_id: null, user_id: target_id, target_id: user_id, type: BlockType.USERBLOCK },
                    { community_id: null, user_id: user_id, target_id: target_id, type: BlockType.MUTE },
                    { community_id: null, user_id: target_id, target_id: user_id, type: BlockType.MUTE }
                ]
            }
        });
    }

    async createUserBlock(data: CreateUserBlockDto) {
        return await this.blockRepository.create(data);
    }

    async createCommunityBlock(data: CreateCommunityBlockDto) {
        return await this.blockRepository.create(data);
    }

    async createCommunityKick(data: CreateCommunityKickDto) {
        return await this.blockRepository.create(data);
    }

    async delete(id: string) {
        return await this.blockRepository.destroy({
            where: {
                id: id
            }
        });
    }

    async findBlockedUser(user_id: number, community_id: string, type: BlockType) {
        return await this.blockRepository.findOne({
            where: {
                target_id: user_id,
                community_id: community_id,
                type: type
            }
        });
    }

    async findBlockedUserByMe(myUserId: number, target_id: number, type: BlockType) {
        return await this.blockRepository.findOne({
            where: {
                user_id: myUserId,
                target_id: target_id,
                type: type
            }
        }) ?? null;
    }

    async rawBlockYou(user_ids: number[], myUserId: number): Promise<BlockCntAddUserIdInterface[]> {
        const data: BlockCntAddUserIdInterface[] = await this.blockRepository.sequelize.query(
            `
            SELECT 
                b.user_id as user_id,
                b.target_id as target_id,
                case when count(case when b.type = :type_cb then 1 end) > 0 then true else false end as isCommunityBlcok,
                case when count(case when b.type = :type_ub then 1 end) > 0 then true else false end as isBlock,
                case when count(case when b.type = :type_mute then 1 end) > 0 then true else false end as isMute,
                case when count(case when b.type = :type_bick then 1 end) > 0 then true else false end as isKick
            from block b WHERE b.user_id in (:user_ids) and type in (:types) and target_id = :myUserId and b.deleted_at IS NULL
            GROUP by b.user_id
        `,
            {
                replacements: {
                    type_cb: BlockType.COMMUNITYBLOCK,
                    type_ub: BlockType.USERBLOCK,
                    type_mute: BlockType.MUTE,
                    type_bick: BlockType.KICK,
                    user_ids: user_ids,
                    types: [BlockType.USERBLOCK, BlockType.MUTE, BlockType.KICK],
                    myUserId: myUserId
                },
                type: QueryTypes.SELECT,
                raw: true
            }
        );
        return user_ids.map(user_id => {
            const findItem = data.find(item => item.user_id === user_id);
            return findItem !== undefined ? findItem : { user_id: user_id, target_id: null, isCommunityBlcok: false, isBlock: false, isMute: false, isKick: false };
        });
    }

    async rawBlock(user_ids: number[], myUserId: number): Promise<BlockCntAddUserIdInterface[]> {
        const data: BlockCntAddUserIdRowInterface[] = await this.blockRepository.sequelize.query(
            `
            SELECT 
                b.user_id as user_id,
	            b.target_id as target_id,
                case when count(case when b.type = :type_cb then 1 end) > 0 then true else false end as isCommunityBlcok,
                case when count(case when b.type = :type_ub then 1 end) > 0 then true else false end as isBlock,
                case when count(case when b.type = :type_mute then 1 end) > 0 then true else false end as isMute,
                case when count(case when b.type = :type_bick then 1 end) > 0 then true else false end as isKick
            from block b WHERE b.user_id = :myUserId and type in (:types) and target_id in (:user_ids) and b.deleted_at IS NULL
            GROUP by b.target_id
        `,
            {
                replacements: {
                    type_cb: BlockType.COMMUNITYBLOCK,
                    type_ub: BlockType.USERBLOCK,
                    type_mute: BlockType.MUTE,
                    type_bick: BlockType.KICK,
                    user_ids: user_ids,
                    myUserId: myUserId,
                    types: [BlockType.USERBLOCK, BlockType.MUTE, BlockType.KICK],
                },
                type: QueryTypes.SELECT,
                raw: true
            }
        );
        return user_ids.map(user_id => {
            const findItem = data.find(item => item.target_id === user_id);
            return findItem !== undefined ? {
                ...findItem,
                isCommunityBlcok: findItem.isCommunityBlcok === 1 ? true : false,
                isBlock: findItem.isBlock === 1 ? true : false,
                isKick: findItem.isKick === 1 ? true : false,
                isMute: findItem.isMute === 1 ? true : false,
            } : { user_id: null, target_id: user_id, isCommunityBlcok: false, isBlock: false, isMute: false, isKick: false };
        });
    }

    async muteListByUserId(user_id: number) {
        return await this.blockRepository.findAll({
            where: {
                user_id: user_id,
                type: BlockType.MUTE,
            }
        })
    }

}
