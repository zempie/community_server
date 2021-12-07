import { Inject, Injectable } from "@nestjs/common";
import { PostsViewLog } from "./posts_view_log.entity";

@Injectable()
export class PostsViewLogService {
    constructor(
        @Inject("PostsViewLogRepository")
        private readonly postsviewLogRepository: typeof PostsViewLog
    ) {}

    async findOne(id: string) {
        return await this.postsviewLogRepository.findOne({ where: { id: id } });
    }

    async findByPostId(post_id: string) {
        return await this.postsviewLogRepository.findAll({ where: { post_id: post_id } });
    }

    async findByUserId(user_id: string) {
        return await this.postsviewLogRepository.findAll({ where: { user_id: user_id } });
    }

    async create(post_id: string, user_id: number) {
        return await this.postsviewLogRepository.create({ post_id: post_id, user_id: user_id });
    }
}
