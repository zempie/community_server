import { Inject, Injectable } from "@nestjs/common";
import sequelize, { FindOptions, Op, Transaction } from "sequelize";
import { BaseService } from "src/abstract/base-service";
import { UserSortDto } from "src/user/dto/user-sort.dto";
import { CommunityChannel } from "./community-channel/community-channel.entity";
import { Community } from "./community.entity";
import { CommunityListDto } from "./dto/community-list.dto";
import { CommunityChannersQuery, CommunityChannersSort } from "./dto/community.dto";
import { CreateCommunityDto } from "./dto/create-community.dto";
import { UpdateCommunityDto } from "./dto/update-community.dto";
import { CommunityShow, CommunitySort } from "./enum/communitysort.enum";
import { CommunityState } from "./enum/communitystate.enum";

@Injectable()
export class CommunityService extends BaseService<Community> {
    constructor(
        @Inject("CommunityRepository")
        private readonly communityRepository: typeof Community
    ) {
        super(communityRepository);
    }

    async findAll(query: CommunityListDto) {
        const options: FindOptions = {
            where: {},
            order: [["created_at", "DESC"]],
            limit: query.limit ? query.limit : 5,
            offset: query.offset ? query.offset : 0
            // raw: true
        };

        if (query.sort === CommunitySort.ALPAHBETIC) {
            options.order = [["name", "ASC"]];
        } else if (query.sort === CommunitySort.SUBSCRIBE) {
            options.order = [["member_cnt", "DESC"]];
        }

        if (query.show === CommunityShow.PUBLIC) {
            options.where = { state: CommunityState.PUBLIC };
        } else if (query.show === CommunityShow.PRIVATE) {
            options.where = { state: CommunityState.PRIVATE };
        }

        if (query.community !== undefined) {
            options.where = {
                name: { [Op.like]: `%${query.community}%` }
            };
        }
        console.log(options.order);

        return await super.find({ ...options });
    }

    async setSubscribeCnt(community_id: string, state: boolean) {
        if (state === true) {
            return await this.communityRepository.increment({ member_cnt: 1 }, { where: { id: community_id } });
        } else {
            return await this.communityRepository.increment({ member_cnt: -1 }, { where: { id: community_id } });
        }
    }

    async setPostCnt(community_id: string, isUp: boolean, transaction?: Transaction)
    async setPostCnt(community_ids: string[], isUp: boolean, transaction?: Transaction)
    async setPostCnt(params: string | string[], isUp: boolean, transaction?: Transaction) {
        if (isUp) {
            return await this.communityRepository.increment({ posts_cnt: 1 }, { where: { id: params }, transaction })
        } else {
            return await this.communityRepository.increment({ posts_cnt: -1 }, { where: { id: params }, transaction })
        }
    }

    async addvisitCnt(id: string) {
        await this.communityRepository.increment({ visit_cnt: 1 }, { where: { id: id } });
        return await this.findOne(id);
    }

    async findOne(id: string) {
        return await this.communityRepository.findOne({
            where: {
                id: id
            },
            include: [CommunityChannel]
        });
    }

    async findByIds(ids: string[], sort?: CommunitySort) {
        const options: FindOptions = {
            where: { id: ids },
            order: [],
            include: [CommunityChannel]
            // raw: true
        };

        if (sort === CommunitySort.ALPAHBETIC) {
            options.order = [["name", "ASC"]];
        } else if (sort === CommunitySort.SUBSCRIBE) {
            options.order = [["member_cnt", "DESC"]];
        }

        return await this.communityRepository.findAll({ ...options });
    }

    async searchName(name: string) {
        //or 조건으로 검색
        const Op = sequelize.Op;
        return this.communityRepository.findAll({
            where: {
                [Op.or]: [
                    { name: { [Op.like]: "%" + name + "%" } },
                    { name: { [Op.like]: "%" + name } },
                    { name: { [Op.like]: name + "%" } }
                ]
            },
            include: [CommunityChannel]
        });
    }

    async searchNameTest(name: string) {
        //copy
        const Op = sequelize.Op;
        return this.communityRepository.findAll({
            where: {
                name: {
                    [Op.like]: "%" + name + "%"
                }
            },
            include: [CommunityChannel]
        });
    }

    async create(data: CreateCommunityDto) {
        return await this.communityRepository.create({
            name: data.community_name,
            manager_id: data.community_manager_id,
            submanager_id: data.community_sub_manager_id,
            url: data.community_url,
            description: data.community_desc,
            profile_img: data.community_profile_img,
            banner_img: data.community_banner_img,
            state: data.community_state,
            owner_id: data.owner_id
        });
    }

    async update(id: string, data: UpdateCommunityDto, transaction?: Transaction) {
        await this.communityRepository.update(
            {
                name: data.community_name,
                manager_id: data.community_manager_id,
                submanager_id: data.community_sub_manager_id,
                description: data.community_desc,
            },
            {
                where: {
                    id: id
                },
                transaction
            }
        );

        return await this.findOne(id);
    }

    async updateProfile(id: string, profile_img: string, transaction?: Transaction) {
        await this.communityRepository.update({ profile_img }, { where: { id: id }, transaction })
    }
    async updateBanner(id: string, banner_img: string, transaction?: Transaction) {
        await this.communityRepository.update({ banner_img }, { where: { id: id }, transaction })
    }

    async delete(id: string) {
        const exist =
            (await this.communityRepository.findOne({
                where: {
                    id: id
                }
            })) ?? null;
        if (exist === null) {
            throw new Error();
        }
        await this.communityRepository.destroy({
            where: {
                id: id
            }
        });
        return true;
    }

    async isAdmin(user_id: number, community_id: string) {
        const info = await this.communityRepository.findOne({
            where: {
                id: community_id
            }
        });
        if (info === null) {
            return false;
        } else if (info.owner_id === user_id) {
            return true;
        } else if (info.manager_id === user_id) {
            return true;
        } else if (info.submanager_id === user_id) {
            return true;
        } else {
            return false;
        }
    }

    getTransaction() {
        return this.communityRepository.sequelize.transaction();
    }
}
