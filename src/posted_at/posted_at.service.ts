import { Inject, Injectable } from "@nestjs/common";
import { Op } from "sequelize";
import { Transaction } from "sequelize/types";
import { CreatePostedAtDto } from "./dto/create-posted_at.dto";
import { UpdatePostedAtDto } from "./dto/update-posted_at.dto";
import { PostedAt } from "./posted_at.entity";

@Injectable()
export class PostedAtService {
    constructor(
        @Inject("PostedAtRepository")
        private readonly postedatRepository: typeof PostedAt
    ) { }

    async findAll() {
        return await this.postedatRepository.findAndCountAll({});
    }

    async findOne(id: string) {
        return await this.postedatRepository.findOne({
            where: {
                id: id
            }
        });
    }

    async findByUserId(user_id: string) {
        return await this.postedatRepository.findAndCountAll({
            where: {
                userId: user_id
            }
        });
    }

    async findByPostsId(posts_id: string): Promise<PostedAt>
    async findByPostsId(posts_ids: string[]): Promise<PostedAt[]>
    async findByPostsId(posts_id: string | string[]): Promise<PostedAt | PostedAt[]> {
        if (Array.isArray(posts_id)) {
            return await this.postedatRepository.findAll({
                where: {
                    posts_id: {
                        [Op.in]: posts_id
                    }
                }
            })
        } else {
            return await this.postedatRepository.findOne({
                where: {
                    posts_id: posts_id
                },
            });
        }
    }

    async findByTargerId(target_id: string) {
        return await this.postedatRepository.findAndCountAll({
            where: {
                targetId: target_id
            }
        });
    }

    async create(data: CreatePostedAtDto, transaction?: Transaction) {
        return await this.postedatRepository.create(data, { transaction });
    }

    async update(id: string, data: UpdatePostedAtDto, transaction?: Transaction) {
        const PostedAt = await this.findOne(id);
        if (!PostedAt) {
            throw new Error("NOT EXIST");
        }
        await this.postedatRepository.update(data, {
            where: {
                id
            },
            transaction
        });

        return await this.findOne(id);
    }

    async delete(id: string) {
        const exist = await this.postedatRepository.findOne({
            where: {
                id: id
            }
        });
        if (!exist) {
            throw new Error("NOT EXIST");
        }
        await this.postedatRepository.destroy({
            where: {
                id: id
            }
        });
        return true;
    }

    async deleteByPostId(postId: string, transaction?: Transaction) {
        return await this.postedatRepository.destroy({
            where: {
                posts_id: postId
            },
            transaction
        })
    }
}
