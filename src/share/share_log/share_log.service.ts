import { Inject, Injectable } from "@nestjs/common";
import { ShareType } from "./enum/sharetype.enum";
import { ShareLog } from "./share_log.entity";

@Injectable()
export class ShareLogService {
    constructor(
        @Inject("ShareLogRepository")
        private readonly shareLogRepository: typeof ShareLog
    ) {}

    async findOne(id: string) {
        return await this.shareLogRepository.findOne({ where: { id: id } });
    }

    async findByPostId(object_id: string) {
        return await this.shareLogRepository.findAndCountAll({ where: { object_id: object_id } });
    }

    async findByUserId(user_id: string) {
        return await this.shareLogRepository.findAndCountAll({ where: { user_id: user_id } });
    }

    async create(user_id: number, object_id: string, type: ShareType) {
        return await this.shareLogRepository.create({ object_id: object_id, user_id: user_id, type: type });
    }

    async delete(user_id: number, object_id: string, type: ShareType) {
        return await this.shareLogRepository.destroy({
            where: {
                object_id: object_id,
                user_id: user_id,
                type: type
            }
        });
    }
}
