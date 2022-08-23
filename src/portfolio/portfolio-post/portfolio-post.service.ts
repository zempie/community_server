import { Inject, Injectable } from "@nestjs/common";
import { CreatePortfolioPostDTO } from "./dto/create-portfoliopost.dto";
import { PortfolioPost } from "./portfolio-post.entity";
import { FindOptions, Transaction } from "sequelize";
import { TimelineListQueryDTO } from "src/timeline/dto/timeline-sort.dto";
import { TimeLineSort } from "src/timeline/enum/timeline-sort.enum";
import { Op } from "sequelize";

@Injectable()
export class PortfolioPostService {
    constructor(
        @Inject("PortfolioPostRepository")
        private readonly portfolioPostRepository: typeof PortfolioPost
    ) { }

    async findAll(channel_id: string, portfolio_id: string, query: TimelineListQueryDTO) {
        const options: FindOptions = {
            where: { channel_id: channel_id, portfolio_id: portfolio_id },
            order: [["created_at", "ASC"]],
            limit: query.limit ? query.limit : 5,
            offset: query.offset ? query.offset : 0,
            raw: true
        };
        return await this.portfolioPostRepository.findAll({
            ...options
        });
    }

    async create(data: CreatePortfolioPostDTO | CreatePortfolioPostDTO[], transaction?: Transaction) {
        if (Array.isArray(data)) {
            return await this.portfolioPostRepository.bulkCreate(data, { transaction });
        } else {
            return await this.portfolioPostRepository.create(data, { transaction });
        }
    }

    async delete(postsId: string, channel_id: string, portfolio_ids: string[], transaction?: Transaction) {
        return await this.portfolioPostRepository.destroy({
            where: {
                post_id: postsId,
                channel_id: channel_id,
                portfolio_id: {
                    [Op.in]: portfolio_ids
                }
            },
            transaction
        })
    }

    async setPin(portfolio_id: string, channel_id: string, post_id: string, state: boolean) {
        await this.portfolioPostRepository.update(
            { is_pinned: state },
            {
                where: {
                    portfolio_id: portfolio_id,
                    channel_id: channel_id,
                    post_id: post_id,
                    is_pinned: state
                }
            }
        );
        return true;
    }
}
