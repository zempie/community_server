import { Inject, Injectable } from "@nestjs/common";
import { CommunityVisitLog } from "./community-visit-log.entity";

@Injectable()
export class CommunityVisitLogService {
    constructor(
        @Inject("CommunityVisitLogRepository")
        private readonly communityLogRepository: typeof CommunityVisitLog
    ) {}

    async findOne(id: string) {
        return await this.communityLogRepository.findOne({ where: { id: id } });
    }

    async findByCommunityId(community_id: string) {
        return await this.communityLogRepository.findAll({ where: { community_id: community_id } });
    }

    async findByUserId(user_id: string) {
        return await this.communityLogRepository.findAll({ where: { user_id: user_id } });
    }

    async create(community_id: string, user_id: number) {
        return await this.communityLogRepository.create({ community_id: community_id, user_id: user_id });
    }
}
