import { Inject, Injectable } from "@nestjs/common";
import { FindOptions, Op } from "sequelize";
import { BaseService } from "src/abstract/base-service";
import { CommunityListDto } from "src/community/dto/community-list.dto";
import { SearchHashtagDto } from "src/search/dto/search-hashtag.dto";
import { Game } from "./game.entity";

@Injectable()
export class GameService extends BaseService<Game> {
    constructor(
        @Inject("GameRepository")
        private readonly gameRepository: typeof Game
    ) {
        super(gameRepository)
    }

    async findAll(query: CommunityListDto) {
        const options: FindOptions = {
            where: {},
            limit: query.limit ? query.limit : 5,
            offset: query.offset ? query.offset : 0,
            raw: true
        };
        if (query.hashtag !== undefined) {
            options.where = {
                hashtags: { [Op.like]: `%${query.hashtag}%` }
            };
        } else if (query.gametitle !== undefined) {
            options.where = {
                title: { [Op.like]: `%${query.gametitle}%` }
            };
        }
        return await super.find({ ...options })
    }

    async findAllActivated(query: CommunityListDto) {
        const options: FindOptions = {
            where: { activated: 1 },
            limit: query.limit ? query.limit : 5,
            offset: query.offset ? query.offset : 0,
            raw: true
        };
        options.where = {
            activated: 1,
            category: { [Op.not]: 2 }
        }
        const orList = [];

        if (query.hashtag !== undefined) {
            orList.push({
                hashtags: { [Op.like]: `%${query.hashtag}%` }
            })
        }
        if (query.gametitle !== undefined) {
            orList.push({
                title: { [Op.like]: `%${query.gametitle}%` },
            })
        }

        if (orList.length > 0) {
            options.where = {
                ...options.where,
                [Op.or]: orList
            }
        }

        return await super.find({ ...options })
    }
}
