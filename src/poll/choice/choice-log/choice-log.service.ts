import { Inject, Injectable } from "@nestjs/common";
import { Op } from "sequelize";
import { Transaction } from "sequelize/types";
import { ChoiceLog } from "./choice-log.entity";

@Injectable()
export class ChoiceLogService {
    constructor(
        @Inject("ChoiceLogRepository")
        private readonly choiceLogRepository: typeof ChoiceLog
    ) { }

    async findOne(userId: number, choiceId: string) {
        return await this.choiceLogRepository.findOne({
            where: {
                user_id: userId,
                choice_id: choiceId
            }
        }) ?? null;
    }

    async countByChoiceId(choiceId: string) {
        return await this.choiceLogRepository.count({
            where: {
                choice_id: choiceId
            }
        })
    }

    async create(userId: number, choiceId: string) {
        return await this.choiceLogRepository.create({ user_id: userId, choice_id: choiceId });
    }

    async deleteByChoiceId(choiceIds: string[], transaction?: Transaction) {
        await this.choiceLogRepository.destroy({
            where: {
                choice_id: { [Op.in]: choiceIds}
            },
            transaction
        })
    }

    async delete(id: string, transaction?: Transaction)
    async delete(choiceIds: string[], transaction?: Transaction)
    async delete(params: string | string[], transaction?: Transaction) {
        if (Array.isArray(params)) {
            await this.choiceLogRepository.destroy({
                where: {
                    id: { [Op.in]: params }
                },
                transaction
            })
        } else {
            await this.choiceLogRepository.destroy({
                where: {
                    id: params
                },
                transaction
            });
        }
        return true;
    }
}
