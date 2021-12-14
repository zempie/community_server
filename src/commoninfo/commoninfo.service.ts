import { Injectable } from "@nestjs/common";
import { CommunityUserModel } from "src/abstract/base-model";
import { Block } from "src/block/block.entity";
import { BlockService } from "src/block/block.service";
import { BlockType } from "src/block/enum/blocktype.enum";
import { ChannelTimelineService } from "src/channel-post/channel-timeline.service";
import { ChannelPostType } from "src/channel-post/enum/channelposttype.enum";
import { Comment } from "src/comment/comment.entity";
import { CommentDto } from "src/comment/dto/comment.dto";
import { ReturnCommunityJoinDto } from "src/community/community-join/dto/return-community-join";
import { Follow } from "src/follow/follow.entity";
import { FollowService } from "src/follow/follow.service";
import { LikeService } from "src/like/like.service";
import { PostsService } from "src/posts/posts.service";
import { UserDto } from "src/user/dto/user.dto";
import { UserType } from "src/user/enum/usertype.enum";
import { User } from "src/user/user.entity";
import { UserService } from "src/user/user.service";

@Injectable()
export class CommonInfoService {
    constructor(
        private followService: FollowService,
        private blockService: BlockService,
        private likeService: LikeService,
        private postsService: PostsService,
        private userService: UserService,
        private channelTimeLineService: ChannelTimelineService
    ) { }

    async setCommonInfo(edges: CommunityUserModel[], user?: User): Promise<CommunityUserModel[]>
    async setCommonInfo(edges: ReturnCommunityJoinDto[], user?: User): Promise<ReturnCommunityJoinDto[]>
    async setCommonInfo(edges: UserDto[], user?: User): Promise<UserDto[]>
    async setCommonInfo(edges: CommunityUserModel[] | ReturnCommunityJoinDto[] | UserDto[], user?: User): Promise<CommunityUserModel[] | ReturnCommunityJoinDto[] | UserDto[]> {
        if (edges.length === 0) {
            return []
        }
        const user_ids = edges.map(item => item.id);
        const followCntData = await this.followService.rawsFollowFollowing(user_ids);
        const followList = user != null ? await this.followService.rawfollow(user_ids, user.id) : [];
        const followingList = user != null ? await this.followService.rawfollowing(user.id, user_ids) : [];

        const blockYouData = user != null ? await this.blockService.rawBlockYou(user_ids, user.id) : [];
        const blockData = user != null ? await this.blockService.rawBlock(user_ids, user.id) : [];

        let reEdges: any[] = edges.map(item => {
            const followCntInfo = followCntData.find(fItem => fItem.user_id === item.id);
            item.followers_cnt = followCntInfo.followerCnt;
            item.followings_cnt = followCntInfo.followingCnt;
            const followInfo = user != null ? followList.find(fItem => fItem.follow_id === user.id) : undefined
            const followingInfo = user != null ? followingList.find(fItem => fItem.user_id === user.id) : undefined
            item.follow_you = followInfo !== undefined ? true : false;
            item.is_following = followingInfo !== undefined ? true : false;

            const blockYouInfo = user != null ? blockYouData.find(bItem => bItem.user_id === item.id) : undefined;
            item.block_you = blockYouInfo !== undefined ? blockYouInfo.isBlock : false;
            const blockInfo = user != null ? blockData.find(bItem => bItem.target_id === item.id) : undefined;
            item.is_blocked = blockInfo !== undefined ? blockInfo.isBlock : false
            item.mutes_you = blockYouInfo !== undefined ? blockYouInfo.isMute : false;
            item.is_muted = blockInfo !== undefined ? blockInfo.isMute : false;
            return item
        })
        if (edges instanceof ReturnCommunityJoinDto) {
            const postCntData = await this.channelTimeLineService.cntCommunityPostCntByUser(user_ids, ChannelPostType.COMMUNITY);
            const likeCntData = await this.likeService.cntLikeInCommunity(user_ids);
            const userTypeData = await this.userService.findByIds(user_ids);
            reEdges = reEdges.map(async (item) => {
                item.post_cnt = postCntData.find(lItem => lItem.user_id === item.id).cnt;
                item.liked_cnt = likeCntData.find(lItem => lItem.user_id === item.id).cnt;
                const userInfo = userTypeData.find(uItem => uItem.id === item.id);
                item.type = userInfo.is_developer === 0 ? UserType.USER : UserType.DEVELOPER
                return item;
            })
        }
        return reEdges
    }

    async commonInfos(target_id: number, user_id: number | null | undefined) {
        const followCntData = await this.followService.rawsFollowFollowing([target_id]);
        const followingList = user_id != undefined && user_id != null ? await this.followService.rawfollowing(user_id, [target_id]) : [];
        const followList = user_id != undefined && user_id != null ? await this.followService.rawfollow([target_id], user_id) : [];

        const blockYouCntData = user_id != undefined && user_id != null ? await this.blockService.rawBlockYou([target_id], user_id) : [];
        const blockData = user_id != undefined && user_id != null ? await this.blockService.rawBlock([target_id], user_id) : [];
        const userInfo = await this.userService.findOne(target_id);
        const postCntData = await this.channelTimeLineService.cntCommunityPostCntByUser([target_id], ChannelPostType.COMMUNITY);
        const likeCntData = await this.likeService.cntLikeInCommunity([target_id]);

        return {
            user: userInfo,
            follow_you: followList.length > 0 ? true : false,
            is_following: followingList.length > 0 ? true : false,
            block_you: blockYouCntData.length > 0 ? blockYouCntData[0].isBlock : false,
            is_blocked: blockData.length > 0 ? blockData[0].isBlock : false,
            mutes_you: blockYouCntData.length > 0 ? blockYouCntData[0].isMute : false,
            is_muted: blockData.length > 0 ? blockData[0].isMute : false,
            post_cnt: postCntData[0].cnt,
            liked_cnt: likeCntData[0].cnt,
            followers_cnt: followCntData[0].followerCnt,
            followings_cnt: followCntData[0].followingCnt,
            type: userInfo !== null ? (userInfo.is_developer === 0 ? UserType.USER : UserType.DEVELOPER) : UserType.USER
        };
    }

    async setCommentInfo(edges: Comment[] | CommentDto[], user?: User): Promise<CommentDto[]> {
        const likeData = user !== undefined && user !== null ? await this.likeService.findByCommentIds(edges.map(item => item.id), user.id, true) : [];
        const userInfos = await this.userService.findByIds(edges.map(item => item.user_id));

        const userInfoDtos = await this.setCommonInfo(userInfos.map(item => new UserDto({ ...item.get({ plain: true }) })), user)
        return edges.map(item => {
            const check = likeData.find(li => li.comment_id === item.id);

            const userI = userInfoDtos.find(uItem => uItem.id === item.user_id)

            return {
                ...item,
                is_liked: check !== undefined ? true : false,
                user: userI
            }
        })
    }

}
