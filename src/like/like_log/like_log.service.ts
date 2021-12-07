import { Inject, Injectable } from "@nestjs/common";
import { LikeType } from "../enum/liketype.enum";
import { LikeLog } from "./like_log.entity";

@Injectable()
export class LikeLogService {
    constructor(
        @Inject("LikeLogRepository")
        private readonly LikelogRepository: typeof LikeLog
    ) {}

    async findOne(id: string) {
        return await this.LikelogRepository.findOne({ where: { id: id } });
    }

    async findByObjectId(object_id: string, type: LikeType) {
        return await this.LikelogRepository.findOne({ where: { object_id: object_id, type: type } });
    }

    async findByUserId(user_id: string, type: LikeType) {
        return await this.LikelogRepository.findAll({ where: { user_id: user_id, type: type } });
    }

    async checkExist(user_id: number, object_id: string, type: LikeType) {
        return await this.LikelogRepository.findAll({ where: { user_id: user_id, object_id: object_id, type: type } });
    }

    async create(user_id: number, object_id: string, type: LikeType) {
        return await this.LikelogRepository.create({ user_id: user_id, object_id: object_id, type: type });
    }
}
