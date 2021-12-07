import { Inject, Injectable } from "@nestjs/common";
import { QueryTypes } from "sequelize";
import { BaseService } from "src/abstract/base-service";
import { ChannelTimeline } from "./channel-timeline.entity";
import { ChannelPostType } from "./enum/channelposttype.enum";

interface PostCntInterface {
    user_id: number;
    cnt: number;
}

@Injectable()
export class ChannelTimelineService extends BaseService<ChannelTimeline> {
    constructor(
        @Inject("ChannelTimelineRepository")
        private readonly channelPostRepository: typeof ChannelTimeline
    ) {
        super(channelPostRepository);
    }

    async cntCommunityPostCntByUser(user_ids: number[], type: ChannelPostType): Promise<PostCntInterface[]> {
        const data: PostCntInterface[] = await this.channelPostRepository.sequelize.query(
            `
            SELECT
                ct.user_id as user_id,
                count(*) as cnt
            from community_timeline ct where ct.user_id in (:user_ids) and ct.type = :type group by ct.user_id
        `,
            {
                replacements: {
                    user_ids: user_ids,
                    type: type
                },
                type: QueryTypes.SELECT,
                raw: true
            }
        );
        return user_ids.map(user_id => {
            const findItem = data.find(item => item.user_id === user_id);
            return findItem !== undefined ? findItem : { user_id: user_id, cnt: 0 };
        });
    }

    async findPinPosts(community_id: string, channel_id: string, state: boolean) {
        return await this.channelPostRepository.findAndCountAll({
            where: {
                community_id: community_id,
                channel_id: channel_id,
                is_pinned: state
            }
        });
    }
}
