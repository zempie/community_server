import { Inject, Injectable } from "@nestjs/common";
import { SearchKeywordLog } from "./search_keyword_log.entity";

@Injectable()
export class SearchKeywordLogService {
    constructor(
        @Inject("SearchKeywordLogRepository")
        private readonly searchKeywordLogRepository: typeof SearchKeywordLog
    ) {}

    async findOne(id: string) {
        return await this.searchKeywordLogRepository.findOne({ where: { id: id } });
    }

    async findByKeyword(keyword: string) {
        return await this.searchKeywordLogRepository.findAndCountAll({ where: { keyword: keyword } });
    }

    async findByUserId(user_id: string) {
        return await this.searchKeywordLogRepository.findAndCountAll({ where: { user_id: user_id } });
    }

    async create(user_id: number, keyword: string) {
        return await this.searchKeywordLogRepository.create({ user_id: user_id, keyword: keyword });
    }

    async delete(user_id: number, keyword: string) {
        return await this.searchKeywordLogRepository.destroy({
            where: {
                user_id: user_id,
                keyword: keyword
            }
        });
    }
}
