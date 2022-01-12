import { Inject, Injectable } from "@nestjs/common";
import { CreateChoice, CreateChoiceDto } from "./dto/create-choice.dto";
import { UpdateChoiceDto } from "./dto/update-choice.dto";
import { Choice } from "./choice.entity";
import { Transaction } from "sequelize/types";
import { Op } from "sequelize";

@Injectable()
export class ChoiceService {
    constructor(
        @Inject("ChoiceRepository")
        private readonly choiceRepository: typeof Choice
    ) { }

    async findAll() {
        return await this.choiceRepository.findAndCountAll({
            order: [["created_at", "DESC"]]
        });
    }

    async findOne(id: string) {
        return await this.choiceRepository.findOne({
            where: {
                id: id
            }
        });
    }

    async create(data: CreateChoice[], transaction?: Transaction): Promise<Choice[]>
    async create(data: CreateChoice, transaction?: Transaction): Promise<Choice>
    async create(data: CreateChoice | CreateChoice[], transaction?: Transaction) {
        if (Array.isArray(data)) {
            return await this.choiceRepository.bulkCreate(data, { transaction })
        } else {
            return await this.choiceRepository.create(data, { transaction });
        }
    }

    async update(id: string, data: UpdateChoiceDto) {
        const Choice =
            (await this.choiceRepository.findOne({
                where: {
                    id: id
                }
            })) ?? null;
        if (Choice === null) {
            throw new Error();
        }
        await this.choiceRepository.update(data, {
            where: {
                id
            }
        });

        return await this.findOne(id);
    }

    async delete(choiceId: string, transaction?: Transaction)
    async delete(choiceIds: string[], transaction?: Transaction)
    async delete(params: string | string[], transaction?: Transaction) {
        if (Array.isArray(params)) {
            await this.choiceRepository.destroy({
                where: {
                    id: {
                        [Op.in]: params
                    }
                },
                transaction
            })
        } else {
            const exist =
                (await this.choiceRepository.findOne({
                    where: {
                        id: params
                    },
                    transaction
                })) ?? null;
            if (exist === null) {
                throw new Error();
            }
            await this.choiceRepository.destroy({
                where: {
                    id: params
                },
                transaction
            });
        }
        return true;
    }
}
