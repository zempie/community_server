import { Inject, Injectable } from "@nestjs/common";
import { FindOptions, Transaction } from "sequelize";
import { TimelineListQueryDTO } from "src/timeline/dto/timeline-sort.dto";
import { TimeLineSort } from "src/timeline/enum/timeline-sort.enum";
import { Op } from "sequelize";
import { GamePost } from "./game-post.entity";
import { CreateGamePostDto } from "./dto/create-game-post.dto";

@Injectable()
export class GamePostService {
    constructor(
        @Inject("GamePostRepository")
        private readonly gamePostRepository: typeof GamePost
    ) { }

    async create(data: CreateGamePostDto | CreateGamePostDto[], transaction?: Transaction) {
        if (Array.isArray(data)) {
            return await this.gamePostRepository.bulkCreate(data, { transaction });
        } else {
            return await this.gamePostRepository.create(data, { transaction });
        }
    }

    async delete(postsId: string, game_id: string, transaction?: Transaction) {
        return await this.gamePostRepository.destroy({
            where: {
                post_id: postsId,
                game_id: game_id,
            },
            transaction
        })
    }

    async deleteGamePost(
        post_id:string,
        params:string | string[],
        transaction?: Transaction
    ){
        if (Array.isArray(params)) {
            return await this.gamePostRepository.destroy({
                where: {
                    post_id: post_id,
                    game_id: {
                        [Op.in]: params
                    },
                },
                transaction
            });
        } else {
            return await this.gamePostRepository.destroy({
                where: {
                    post_id: post_id,
                    game_id: params,
                },
                transaction
            });
        }
    }

    async setPin(game_id: string, post_id: string, state: boolean) {
        await this.gamePostRepository.update(
            { is_pinned: state },
            {
                where: {
                    game_id: game_id,
                    post_id: post_id
                }
            }
        );
        return true;
    }
}
