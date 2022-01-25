import { Inject, Injectable } from "@nestjs/common";
import { QueryTypes } from "sequelize";
import { Op } from "sequelize";
import { BaseService } from "src/abstract/base-service";
import { User } from "src/user/user.entity";
import { CustomQueryResult } from "src/util/pagination-builder";
import { CreateFollowDto } from "./dto/create-follow.dto";
import { FollowDto } from "./dto/follow.dto";
import { UpdateFollowDto } from "./dto/update-follow.dto";
import { Follow } from "./follow.entity";

interface FollowCntInterface {
    followerCnt: number;
    followingCnt: number;
}
interface FollowCntAddUserIdInterface {
    user_id: number;
    followerCnt: number;
    followingCnt: number;
}

@Injectable()
export class FollowService extends BaseService<Follow> {
    constructor(
        @Inject("FollowRepository")
        private readonly followRepository: typeof Follow
    ) {
        super(followRepository);
    }

    async findAll() {
        return await this.followRepository.findAll({});
    }

    async findOne(id: string) {
        return await this.followRepository.findOne({
            where: {
                id: id
            }
        });
    }

    async findQuery(
        limit: number,
        offset: number,
        isFollow: boolean,
        userId: number,
        search?: string
    ): Promise<CustomQueryResult<FollowDto>> {
        // follower.nickName as nickName,
        const query = `
            select 
                ${isFollow ? "follower" : "user"}.id as id,
                ${isFollow ? "follower" : "user"}.uid as uid,
                ${isFollow ? "follower" : "user"}.email as email,
                ${isFollow ? "follower" : "user"}.name as name,
                ${isFollow ? "follower" : "user"}.channel_id as channel_id,
                ${isFollow ? "follower" : "user"}.created_at as created_at,
                ${isFollow ? "follower" : "user"}.picture as profile_img,
                ${isFollow ? "follower" : "user"}.is_developer as is_developer
            from ${this.followRepository.tableName} as follows left join ${User.tableName
            } as user on follows.user_id = user.id and user.deleted_at is null left join ${User.tableName
            } as follower on follows.follow_id = follower.id and follower.deleted_at is null
            where follows.${isFollow ? "user_id" : "follow_id"} = ? and ${isFollow ? "follower" : "user"
            }.name like ? and follows.deleted_at IS NULL limit ?,?;
        `;

        const cntQuery = `
            select
                count(*) as count
            from ${this.followRepository.tableName} as follows left join ${User.tableName
            } as user on follows.user_id = user.id and user.deleted_at is null left join ${User.tableName
            } as follower on follows.follow_id = follower.id and follower.deleted_at is null
            where follows.${isFollow ? "user_id" : "follow_id"} = ? and ${isFollow ? "follower" : "user"
            }.name like ? and follows.deleted_at IS NULL limit 0,1;
        `;

        const list: FollowDto[] = await this.followRepository.sequelize.query(query, {
            replacements: [userId, search ? `%${search}%` : `%%`, offset ? offset : 0, limit ? limit : 10],
            type: QueryTypes.SELECT,
            raw: true
        });

        const data: { count: number }[] = await this.followRepository.sequelize.query(cntQuery, {
            replacements: [userId, search ? `%${search}%` : `%%`, offset ? offset : 0, limit ? limit : 10],
            type: QueryTypes.SELECT,
            raw: true
        });

        const totalCont = data.length > 0 ? data[0].count : 0;

        // const totalPage = Math.floor(totalCont / limit) + ((totalCont % limit) > 0 ? 1 : 0);

        return new CustomQueryResult<FollowDto>({
            totalCount: totalCont,
            result: list.map(item => new FollowDto(item)),
            pageInfo: {
                hasNextPage: limit + offset < totalCont ? true : false
            }
        });
    }



    async findfollowersCnt(user_id: number, follow_id: number) {
        return await this.followRepository.findAll({
            where: {
                [Op.or]: [
                    { user_id: user_id, follow_id: follow_id },
                    { user_id: follow_id, follow_id: user_id }
                ]
            }
        });
    }

    async followerCount(user_id: number) {
        return await this.followRepository.findAndCountAll({
            where: {
                user_id: user_id
            }
        });
    }

    async followCount(user_id: number) {
        return await this.followRepository.findAndCountAll({
            where: {
                follow_id: user_id
            }
        });
    }

    async findfollow(user_id: number, follow_id: number) {
        return await this.followRepository.findAll({
            where: {
                user_id: user_id,
                follow_id: follow_id
            }
        });
    }

    async countFollowFollowing(user_id: number): Promise<FollowCntInterface> {
        const data: FollowCntInterface[] = await this.followRepository.sequelize.query(
            `
        SELECT count(if(f.user_id = ?,f.user_id,null)) as followerCnt,
        count(if(f.follow_id = ?,f.follow_id,null)) as followingCnt
        from follow f where f.user_id = ? or f.follow_id =? limit 0,1`,
            {
                replacements: [user_id, user_id, user_id, user_id],
                type: QueryTypes.SELECT,
                raw: true
            }
        );

        return data.length > 0
            ? {
                followerCnt: data[0].followerCnt,
                followingCnt: data[0].followingCnt
            }
            : {
                followerCnt: 0,
                followingCnt: 0
            };
    }

    async rawsFollowFollowing(user_ids: number[]): Promise<FollowCntAddUserIdInterface[]> {
        const data: FollowCntAddUserIdInterface[] = await this.followRepository.sequelize.query(
            `
            SELECT f.user_id as user_id ,
            (select count(*) from follow f2 where f2.user_id = f.user_id and f2.deleted_at IS NULL) as followerCnt,
            (select count(*) from follow f3 where f3.follow_id = f.user_id and f3.deleted_at IS NULL) as followingCnt
            from follow f WHERE f.user_id in(:user_ids) and f.deleted_at IS NULL
        `,
            {
                replacements: {
                    user_ids: user_ids
                },
                type: QueryTypes.SELECT,
                raw: true
            }
        );
        return user_ids.map(user_id => {
            const findItem = data.find(item => item.user_id === user_id);
            return findItem !== undefined ? findItem : { user_id: user_id, followerCnt: 0, followingCnt: 0 };
        });
    }

    async rawfollow(user_ids: number[], follow_id: number) {
        return await this.followRepository.findAll({
            where: {
                user_id: {
                    [Op.in]: user_ids
                },
                follow_id: follow_id
            },
            attributes: ["user_id", "follow_id"]
        });
    }

    async rawfollowing(user_id: number, follow_ids: number[]) {
        return await this.followRepository.findAll({
            where: {
                follow_id: {
                    [Op.in]: follow_ids
                },
                user_id: user_id
            },
            attributes: ["user_id", "follow_id"]
        });
    }

    async create(data: CreateFollowDto) {
        const result = await this.followRepository.create(data);
        return result;
    }

    async update(id: string, data: UpdateFollowDto) {
        const Follow = await this.findOne(id);
        if (!Follow) {
            throw new Error("NOT EXIST");
        }
        await this.followRepository.update(data, {
            where: {
                id
            }
        });

        return await this.findOne(id);
    }

    async delete(id: string) {
        const exist = await this.followRepository.findOne({
            where: {
                id: id
            }
        });
        if (!exist) {
            throw new Error("NOT EXIST");
        }
        await this.followRepository.destroy({
            where: {
                id: id
            }
        });
        return true;
    }

    async deletefollow(user_id: number, follow_id: number) {
        return await this.followRepository.destroy({
            where: {
                user_id: user_id,
                follow_id: follow_id
            }
        });
    }

    async followUserInfosByUser(user_id: number): Promise<User[]> {
        // return await this.followRepository.findAll({
        //     where: {
        //         user_id: user_id
        //     }
        // })
        const data: User[] = await this.followRepository.sequelize.query(`
            SELECT u.* from follow f left join users u on f.follow_id = u.id where f.user_id =${user_id} and f.deleted_at is null
        `,
            {
                replacements: {
                    user_id: user_id
                },
                type: QueryTypes.SELECT,
                raw: true
            }
        )

        return data;
    }
}
