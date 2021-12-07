import { Inject, Injectable } from '@nestjs/common';
import sequelize from 'sequelize';
import { QueryTypes } from 'sequelize';
import { Op } from 'sequelize';
import { Transaction, WhereOptions } from 'sequelize/types';
import { HashTagLog } from './hashtag-log.entity';

@Injectable()
export class HashtagLogService {

    constructor(
        @Inject("HashTagLogRepository")
        private readonly hashTagLogRepository: typeof HashTagLog
    ) { }

    async create(user_id: number, text: string, transaction?: Transaction)
    async create(user_id: number, texts: string[], transaction?: Transaction)
    async create(user_id: number, params: string[] | string, transaction?: Transaction) {
        if (Array.isArray(params)) {
            return await this.hashTagLogRepository.bulkCreate(params.map(item => ({
                user_id: user_id,
                text: item
            })))
        } else {
            return await this.hashTagLogRepository.create({
                user_id, text: params,
                transaction
            })
        }
    }

    async countList()
    async countList(userIds: number[])
    async countList(userId: number)
    async countList(params?: number | number[]) {
        return this.hashTagLogRepository.sequelize.query(`
            select text,count(*) as cnt from ${this.hashTagLogRepository.tableName} where 
             ${params !== undefined ? `user_id ${Array.isArray(params) ? "in (:user_id)" : "= :user_id"} and ` : ``}
            text is not NULL
            group by text
        `,
            {
                replacements: {
                    user_id: params
                },
                type: QueryTypes.SELECT,
                raw: true
            })
    }
}
