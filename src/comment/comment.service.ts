import { Inject, Injectable } from "@nestjs/common";
import { CreateCommentDto } from "./dto/create-comment.dto";
import { UpdateCommentDto } from "./dto/update-comment.dto";
import { Comment } from "./comment.entity";
import { CommentListDto } from "./dto/comment-list.dto";
import { FindOptions } from "sequelize/types";
import { QueryTypes } from "sequelize";
import { CommentSort } from "./enum/comment.sort.enum";
import { BaseService } from "src/abstract/base-service";

@Injectable()
export class CommentService extends BaseService<Comment> {
    constructor(
        @Inject("CommentRepository")
        private readonly commentRepository: typeof Comment
    ) {
        super(commentRepository)
    }

    async findAll() {
        return await this.commentRepository.findAndCountAll({
            order: [["createdAt", "DESC"]]
        });
    }

    async list(query: CommentListDto, post_id: string, user_id: number) {
        const options: FindOptions = {
            where: { post_id: post_id, parent_id: null },
            limit: query.limit ? query.limit : 5,
            offset: query.offset ? query.offset : 0,
            order: [["createdAt", "DESC"]],
        };

        if (query.sort === CommentSort.POPULAR) {
            options.order = [["like_cnt", "DESC"]];
        } else if (query.sort === CommentSort.ME) {
            options.where["user_id"] = user_id;
        }

        return await super.find(options);
    }
    async recommentList(query: CommentListDto, parent_id: string, user_id: number) {
        const options: FindOptions = {
            where: { parent_id: parent_id },
            limit: query.limit ? query.limit : 5,
            offset: query.offset ? query.offset : 0,
            order: [["createdAt", "DESC"]]
        };

        if (query.sort === CommentSort.POPULAR) {
            options.order = [["like_cnt", "DESC"]];
        } else if (query.sort === CommentSort.ME) {
            options.where["user_id"] = user_id;
        }

        return await super.find(options);
    }

    async findWithpostId(comment_id: string, post_id: string) {
        return await this.commentRepository.findOne({
            where: {
                id: comment_id,
                post_id: post_id
            }
        });
    }

    async findOne(id: string) {
        return await this.commentRepository.findOne({
            where: {
                id: id
            }
        });
    }

    async createWidhPostId(post_id: string, data: CreateCommentDto) {
        return await this.commentRepository.create({
            ...data,
            post_id: post_id
        });
    }

    async setLikeCnt(comment_id: string, post_id: string, state: boolean) {
        if (state) {
            await this.commentRepository.increment({ like_cnt: 1 }, { where: { id: comment_id, post_id: post_id } });
        } else {
            await this.commentRepository.increment({ like_cnt: -1 }, { where: { id: comment_id, post_id: post_id } });
        }
        return await this.findWithpostId(comment_id, post_id);
    }

    async setdisLikeCnt(comment_id: string, post_id: string, state: boolean) {
        if (state) {
            await this.commentRepository.increment({ dislike_cnt: 1 }, { where: { id: comment_id, post_id: post_id } });
        } else {
            await this.commentRepository.increment(
                { dislike_cnt: -1 },
                { where: { id: comment_id, post_id: post_id } }
            );
        }
        return await this.findWithpostId(comment_id, post_id);
    }

    async setFin(comment_id: string, post_id: string, state: boolean) {
        if (state === true) {
            await this.commentRepository.update(
                { is_pinned: true },
                {
                    where: {
                        id: comment_id,
                        post_id: post_id
                    }
                }
            );
        } else {
            await this.commentRepository.update(
                { is_pinned: false },
                {
                    where: {
                        id: comment_id,
                        post_id: post_id
                    }
                }
            );
        }

        return await this.findOne(comment_id);
    }

    async update(commentId: string, postId: string, data: UpdateCommentDto) {
        const exist =
            (await this.commentRepository.findOne({
                where: {
                    id: commentId,
                    post_id: postId
                }
            })) ?? null;
        if (exist === null) {
            throw new Error();
        }
        await this.commentRepository.update(data, {
            where: {
                id: commentId,
                post_id: postId
            }
        });
        return await this.findWithpostId(commentId, postId);
    }

    async deleteWidhPostId(commentId: string, postId: string) {
        const exist =
            (await this.commentRepository.findOne({
                where: {
                    id: commentId,
                    post_id: postId
                }
            })) ?? null;
        if (exist === null) {
            throw new Error();
        }
        await this.commentRepository.destroy({
            where: {
                id: commentId,
                post_id: postId
            }
        });
        return true;
    }

    async recommentListByParentIds(parentIds: string[], limit: number = 3): Promise<Comment[]> {
        return await this.commentRepository.sequelize.query(`
        SELECT c.* from (SELECT f.id
            , f.parent_id
        FROM (
                  SELECT id
                        , parent_id
                    FROM (SELECT id
                                , parent_id
                                , @rn := CASE WHEN @cd = id THEN @rn + 1 ELSE 1 END rn
                                , @cd := id
                            FROM (SELECT * FROM comment c where c.parent_id in(:parentIds) and c.deletedAt is null ORDER BY c.parent_id) a
                                , (SELECT @cd := '', @rn := 0) b
                            ) a
                    WHERE rn <= :limit  
                    )f) sear left join comment c on c.id = sear.id
        `,
            {
                replacements: {
                    parentIds: parentIds,
                    limit: limit
                },
                type: QueryTypes.SELECT,
                raw: true
            })
    }
}
