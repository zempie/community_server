import { Inject, Injectable } from "@nestjs/common";
import { FindAndCountOptions } from "sequelize/types";
import { ChannelTimelineService } from "src/channel-post/channel-timeline.service";
import { CommonInfoService } from "src/commoninfo/commoninfo.service";
import { PostsService } from "src/posts/posts.service";
import { UserService } from "src/user/user.service";
import { User } from "src/user/user.entity";
import { PostedAtService } from "src/posted_at/posted_at.service";
import { PoestedAtReturnDto, PostedAtCommunityDto, PostedAtDto } from "src/posted_at/dto/posted_at.dto";
import { CommunityService } from "src/community/community.service";
import { CommunityChannelService } from "src/community/community-channel/community-channel.service";
import { LikeService } from "src/like/like.service";
import { PostMetadataService } from "src/post_metadata/post_metadata.service";
import { CommunityShortDto } from "src/community/dto/community.dto";
import { PostsDto } from "src/posts/dto/posts.dto";
import { UserDto } from "src/user/dto/user.dto";
import { PostMetadataDto } from "src/post_metadata/dto/post_metadata.dto";

@Injectable()
export class TimelineService {
  constructor(
    private readonly channelTimelineService: ChannelTimelineService,
    private readonly postService: PostsService,
    private readonly userService: UserService,
    private commoninfoService: CommonInfoService,
    private postedAtService: PostedAtService,
    private communityService: CommunityService,
    private communityChannelService: CommunityChannelService,
    private likeService: LikeService,
    private postMetadataService: PostMetadataService,


  ) { }

  /**
   * 타임라인 기본 리스트 
   * @param currUser : 현재 로그인 한 유저
   * @param inputWhere : 타임라인 검색 input
   * @returns : 베이스 타임라인 리스트 
   */
  async getBaseTimeline(currUser: User, list: any) {
    // const list = await this.channelTimelineService.find(inputWhere);

    const postInfo = await this.postService.findIds(list.result.map(item => item.post_id));

    const users = await this.userService.findByIds(postInfo.map(item => item.user_id));

    const setUsers = await this.commoninfoService.setCommonInfo(
      users.map(item => item.get({ plain: true }) as User),
      currUser
    );
    const postedAtInfos = await this.postedAtService.findByPostsId(postInfo.map(item => item.id));
    const postedCommunities: PostedAtCommunityDto[] = [].concat(postedAtInfos.filter(item => item.community !== null).reduce((preV, item) => [...preV, ...item.community.reduce((cPreV, item2) => [...cPreV, item2], [])], []));
    const communityInfos = await this.communityService.findByIds(postedCommunities.map(item => item.id));
    const communityChannelInfos = await this.communityChannelService.findIds(postedCommunities.map(item => item.channel_id));

    const likeList =
      currUser !== null
        ? await this.likeService.findByPostIds(
          list.result.map(item => item.post_id),
          currUser.id,
          true
        )
        : [];

    const postMetadata = await this.postMetadataService.findByPostsId(postInfo.map(item => item.id))

    return {
      ...list,
      result: list.result
      .filter(item => {
        const findInfo = postInfo.find(po => po.id === item.post_id);
        return findInfo ? true : false        
      })
      .map(item => {
        const findInfo = postInfo.find(po => po.id === item.post_id);
        const userInfo = findInfo !== undefined && setUsers.find(us => us.id === findInfo.user_id);
        const findPostedAtInfo = findInfo !== undefined && postedAtInfos.find(pa => pa.posts_id === findInfo.id);
        const likeData = likeList.find(li => li.post_id === item.post_id);
        const targetCommunities: PoestedAtReturnDto[] = [];
        const metadataInfo = postMetadata.find(meta => meta.posts_id === item.post_id)

        findPostedAtInfo.community?.forEach(cItem => {
          const tCommunty = communityInfos.find(tCitem => tCitem.id === cItem.id);
          const tCommunityChannel = communityChannelInfos.find(tCitem => tCitem.id === cItem.channel_id);
          if (tCommunty !== undefined && tCommunityChannel !== undefined) {
            targetCommunities.push(new PoestedAtReturnDto({
              community: new CommunityShortDto({ ...tCommunty.get({ plain: true }) }),
              channel: tCommunityChannel
            }));
          }
        });

        return new PostsDto({
          ...findInfo,
          liked: likeData !== undefined ? true : false,
          user: new UserDto({ ...userInfo }),
          posted_at: findPostedAtInfo?  new PostedAtDto({
            ...findPostedAtInfo?.get({ plain: true }),
            community: targetCommunities
          }) : undefined,
          metadata: new PostMetadataDto({ ...metadataInfo })

        });
      })
    };
  }

}