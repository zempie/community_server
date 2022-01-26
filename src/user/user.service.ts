import { Inject, Injectable } from "@nestjs/common";
import { Op } from "sequelize";
import { BaseService } from "src/abstract/base-service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UserSearchQuery } from "./dto/user-search.dto";
import { User } from "./user.entity";

@Injectable()
export class UserService extends BaseService<User> {
    constructor(
        @Inject("UserRepository")
        private readonly userRepository: typeof User
    ) {
        super(userRepository);
    }

    async findOne(id: any) {
        return await this.userRepository.findOne({
            where: {
                id: id
            },
            raw: true
        });
    }

    async findOneByUid(id: any) {
        return await this.userRepository.findOne({
            where: {
                uid: id
            }
        });
    }

    async findOneByChannelId(id: any) {
        return await this.userRepository.findOne({
            where: {
                channel_id: id
            }
        }) ?? null;
    }

    async findUsers() {
        return await this.userRepository.findAll();
    }

    async findByIds(user_ids: number[]) {
        return await this.userRepository.findAll({
            where: {
                id: user_ids
            }
        });
    }

    async search(query: UserSearchQuery) {
        return await super.find({
            where: {
                name: {
                    [Op.like]: `%${query.username}%`
                },
            },
            limit: query.limit,
            offset: query.offset
        })
    }

    // async setPostcnt(user_id: number, state: boolean) {
    //     if (state === true) {
    //         await this.userRepository.increment({ post_cnt: 1 }, { where: { id: user_id } });
    //     } else {
    //         await this.userRepository.increment({ post_cnt: -1 }, { where: { id: user_id } });
    //     }
    //     return await this.findOne(user_id);
    // }

    // async setLikecnt(user_id: number, state: boolean) {
    //     if (state === true) {
    //         await this.userRepository.increment({ like_cnt: 1 }, { where: { id: user_id } });
    //     } else {
    //         await this.userRepository.increment({ like_cnt: -1 }, { where: { id: user_id } });
    //     }
    //     return await this.findOne(user_id);
    // }
}
