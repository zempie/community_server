import { Inject, Injectable } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { PostStatus } from "src/posts/enum/post-status.enum";
import { Posts } from "src/posts/posts.entity";

@Injectable()
export class TasksSevice {
    constructor(
        @Inject("PostsRepository")
        private readonly postsRepository: typeof Posts
    ) {}
    @Cron(CronExpression.EVERY_MINUTE)
    async sendNotification() {
        const now = new Date();
        const posts = await this.postsRepository.findAll({
            where: { status: PostStatus.DRAFT }
        });

        for (const item of posts) {
            const getdate = new Date(item.scheduled_for);
            if (getdate === now || getdate < now) {
                await this.postsRepository.update({ status: PostStatus.ACTIVE }, { where: { id: item.id } });
            }
        }
        return;
    }
}
