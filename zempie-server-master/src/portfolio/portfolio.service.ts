import { Inject, Injectable } from "@nestjs/common";
import { CreatePortfolioDto } from "./dto/create-portfolio.dto";
import { UpdatePortfolioDto } from "./dto/update-portfolio.dto";
import { Portfolio } from "./portfolio.entity";

@Injectable()
export class PortfolioService {
    constructor(
        @Inject("PortfolioRepository")
        private readonly portfolioRepository: typeof Portfolio
    ) {}

    async findOne(id: string) {
        return await this.portfolioRepository.findOne({
            where: {
                id: id
            }
        });
    }

    async findByUserId(user_id: number) {
        return await this.portfolioRepository.findAll({
            where: {
                user_id: user_id
            }
        });
    }

    async findByChannelId(channel_id: string) {
        return await this.portfolioRepository.findAndCountAll({
            where: {
                channelId: channel_id
            }
        });
    }

    async create(data: CreatePortfolioDto) {
        return await this.portfolioRepository.create(data);
    }

    async update(id: string, data: UpdatePortfolioDto) {
        const Portfolio = await this.findOne(id);
        if (!Portfolio) {
            throw new Error("NOT EXIST");
        }
        await this.portfolioRepository.update(data, {
            where: {
                id
            }
        });

        return await this.findOne(id);
    }

    async delete(id: string) {
        await this.portfolioRepository.destroy({
            where: {
                id: id
            }
        });
        return true;
    }
}
