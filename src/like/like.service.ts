import { Inject, Injectable } from "@nestjs/common";
import { Op } from "sequelize";
import { QueryTypes } from "sequelize";
import { BaseQuery } from "src/abstract/base-query";
import { CreateCommentdisLikeDto, CreateCommentLikeDto, CreatePostLikeDto } from "./dto/create-like.dto";
import { LikeType } from "./enum/liketype.enum";
import { Like } from "./like.entity";

interface LikeCntInterface {
    user_id: number;
    cnt: number;
}

@Injectable()
export class LikeService {
    constructor(
        @Inject("LikeRepository")
        private readonly likeRepository: typeof Like
    ) { }

    async findAll() {
        return await this.likeRepository.findAll();
    }

    async findByUserId(user_id: number, state: boolean) {
        return await this.likeRepository.findAndCountAll({
            where: {
                user_id: user_id,
                state: state
            }
        });
    }

    async findByPostIds(post_ids: string[], user_id: number, state: boolean) {
        if (post_ids.length === 0) {
            return []
        }
        return await this.likeRepository.findAll({
            where: {
                post_id: {
                    [Op.in]: post_ids
                },
                user_id: user_id,
                state: state,
                type: LikeType.POST
            }
        })
    }

    async findByCommentIds(comment_ids: string[], user_id: number, state: boolean) {
        if (comment_ids.length === 0) {
            return []
        }
        return await this.likeRepository.findAll({
            where: {
                comment_id: {
                    [Op.in]: comment_ids
                },
                user_id: user_id,
                state: state
            }
        })
    }

    async list(query: BaseQuery, post_id: string) {
        return await this.likeRepository.findAll({
            where: {
                post_id: post_id
            },
            order: [["created_at", "DESC"]],
            limit: query.limit ? query.limit : 5,
            offset: query.offset ? query.offset : 0
        });
    }

    async postList(query: BaseQuery, post_id: string) {
        return await this.likeRepository.findAll({
            where: {
                post_id: post_id,
                type: LikeType.POST
            },
            order: [["created_at", "DESC"]],
            limit: query.limit ? query.limit : 5,
            offset: query.offset ? query.offset : 0
        });
    }

    async findOne(id: string) {
        return await this.likeRepository.findOne({
            where: {
                id: id
            }
        });
    }

    async likePostByUserId(post_id: string, user_id: number): Promise<Like>
    async likePostByUserId(post_ids: string[], user_id: number): Promise<Like[]>
    async likePostByUserId(param: string[] | string, user_id: number) {
        if (Array.isArray(param)) {
            return await this.likeRepository.findAll({
                where: {
                    user_id: user_id,
                    post_id: { [Op.in]: param },
                    state: true,
                    type: LikeType.POST
                }
            })
        } else {
            return (
                (await this.likeRepository.findOne({
                    where: {
                        user_id: user_id,
                        post_id: param,
                        state: true,
                        type: LikeType.POST
                    }
                })) ?? null
            );
        }
    }

    async likeCommentByUserId(post_id: string, comment_id: string, user_id: number) {
        return await this.likeRepository.findOne({
            where: {
                user_id: user_id,
                post_id: post_id,
                comment_id: comment_id,
                state: true,
                type: LikeType.COMMENT
            }
        });
    }

    async createPostLike(postId: string, data: CreatePostLikeDto) {
        return await this.likeRepository.create({
            ...data,
            post_id: postId
        });
    }

    async createCommentdisLike(data: CreateCommentdisLikeDto) {
        return await this.likeRepository.create(data);
    }

    async createCommentLike(data: CreateCommentLikeDto) {
        return await this.likeRepository.create(data);
    }

    async existPostlike(userId: number, postId: string) {
        return await this.likeRepository.findOne({
            where: {
                user_id: userId,
                post_id: postId,
                state: true,
                type: LikeType.POST
            }
        });
    }

    async existCommentlike(user_id: number, commentId: string, state: boolean) {
        return await this.likeRepository.findOne({
            where: {
                user_id: user_id,
                comment_id: commentId,
                state: state,
                type: LikeType.COMMENT
            }
        });
    }

    async deletePostlike(id: string) {
        return await this.likeRepository.destroy({
            where: {
                id: id
            }
        });
    }

    async postLikeCnt(post_id: string, type: LikeType, state: boolean) {
        return await this.likeRepository.count({
            where: {
                post_id: post_id,
                type: type,
                state: state
            }
        })
    }

    async commentLikeCnt(comment_id: string, type: LikeType, state: boolean) {
        return await this.likeRepository.count({
            where: {
                comment_id: comment_id,
                type: type,
                state: state
            }
        })
    }

    // async deleteCommentlike(comment_id: string, post_id: string, state: boolean) {
    //     return await this.likeRepository.destroy({
    //         where: {
    //             post_id: post_id,
    //             comment_id: comment_id,
    //             state: state
    //         }
    //     });
    // }

    async deleteCommentlike(id: string) {
        return await this.likeRepository.destroy({
            where: {
                id: id
            }
        });
    }

    async cntLikeInCommunity(user_ids: number[]): Promise<LikeCntInterface[]> {
        const data: LikeCntInterface[] = await this.likeRepository.sequelize.query(
            'SELECT l.user_id as user_id, count(*) as cnt from `like` l left join channel_post cp on l.post_id = cp.post_id WHERE l.user_id in (:user_ids) and l.deleted_at IS NULL GROUP by l.user_id '
            ,
            {
                replacements: {
                    user_ids: user_ids
                },
                raw: true,
                type: QueryTypes.SELECT
            }
        );
        return user_ids.map(user_id => {
            const info = data.find(item => item.user_id === user_id);
            return info !== undefined ? info : { user_id, cnt: 0 };
        });
    }
}
