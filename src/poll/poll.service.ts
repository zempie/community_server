import { Inject, Injectable } from "@nestjs/common";
import { Transaction } from "sequelize/types";
import { Choice } from "./choice/choice.entity";
import { CreatePoll, CreatePollDto } from "./dto/create-poll.dto";
import { UpdatePollDto } from "./dto/update-poll.dto";
import { Poll } from "./poll.entity";

@Injectable()
export class PollService {
    constructor(
        @Inject("PollRepository")
        private readonly pollRepository: typeof Poll
    ) { }

    async findAll() {
        return await this.pollRepository.findAndCountAll({
            order: [["created_at", "DESC"]],
            include: [Choice]
        });
    }

    async findOne(id: string) {
        return await this.pollRepository.findOne({
            where: {
                id: id
            },
            include: [Choice]
        });
    }

    async findOneByPostId(id: string) {
        return await this.pollRepository.findOne({
            where: {
                postsId: id
            },
            include: [Choice]
        }) ?? null;
    }

    async create(data: CreatePoll, transaction?: Transaction) {
        const now = new Date().getTime();
        const end = new Date(data.end_time).getTime();

        const duration = end - now;

        return await this.pollRepository.create({
            postsId: data.postsId,
            duration: duration,
            end_time: end
        }, { raw: true, transaction });
    }

    async update(id: string, data: Partial<CreatePoll>, transaction?: Transaction) {
        const now = new Date().getTime();
        const end = new Date(data.end_time).getTime();

        const duration = end - now;

        await this.pollRepository.update({
            ...data,
            duration: duration,
        }, {
            where: {
                id: id
            },
            transaction
        })
        return await this.findOne(id)
    }

    async delete(pollId: string, transaction: Transaction) {
        const exist = await this.pollRepository.findOne({
            where: {
                id: pollId
            },
            transaction
        });
        if (!exist) {
            throw new Error("NOT EXIST");
        }
        await this.pollRepository.destroy({
            where: {
                id: pollId
            },
            transaction
        });
        return true;
    }
}
