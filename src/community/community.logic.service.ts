import { Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { Block } from "src/block/block.entity";
import { BlockService } from "src/block/block.service";
import { BlockType } from "src/block/enum/blocktype.enum";
import { ChannelPostService } from "src/channel-post/channel-post.service";
import { CommonInfoService } from "src/commoninfo/commoninfo.service";
import { FcmEnumType } from "src/fcm/fcm.enum";
import { FcmService } from "src/fcm/fcm.service";
import { UserDto } from "src/user/dto/user.dto";
import { User } from "src/user/user.entity";
import { UserService } from "src/user/user.service";
import { ChannelState } from "./community-channel/channelstate.enum";
import { CommunityChannelService } from "./community-channel/community-channel.service";
import { CommunityChannelBaseDto } from "./community-channel/dto/community-channel.dto";
import { CreateCommunityChannelDto } from "./community-channel/dto/create-community-channel.dto";
import { ReturnCommunityChannelDto } from "./community-channel/dto/returnchannel.dto";
import { UpdateCommunityChannelDto } from "./community-channel/dto/update-community-channel.dto";
import { CommunityJoin } from "./community-join/community-join.entity";
import { CommunityJoinService } from "./community-join/community-join.service";
import { CommunityJoinUserDto } from "./community-join/dto/community-join.dto";
import { ReturnCommunityJoinDto } from "./community-join/dto/return-community-join";
import { JoinState } from "./community-join/enum/joinstate.enum";
import { JoinStatus } from "./community-join/enum/joinststus.enum";
import { Community } from "./community.entity";
import { CommunityService } from "./community.service";
import { CreateCommunityDto } from "./dto/create-community.dto";
import { ReturnCommunityDto } from "./dto/return-community.dto";
import { UpdateCommunityDto } from "./dto/update-community.dto";
import { CommunityState } from "./enum/communitystate.enum";

@Injectable()
export class CommunityLogicService {
    constructor(private communityService: CommunityService,
        private userService: UserService,
        private communityjoinService: CommunityJoinService,
        private communitychannelService: CommunityChannelService,
        private channelPostService: ChannelPostService,
        private fcmService: FcmService,
        private blockService: BlockService,
        private commonInfoService: CommonInfoService
    ) {

    }

    async createCommunity(data: CreateCommunityDto, managerId: number) {
        const community = await this.communityService.create({
            ...data,
            owner_id: data.owner_id,
            community_manager_id: managerId
        });
        await this.communityjoinService.createJoin({
            user_id: data.owner_id,
            community_id: community.id,
            status: JoinStatus.OWNER
        });
        if (community.manager_id === data.owner_id) {
            await this.communityjoinService.createJoin({
                user_id: data.owner_id,
                community_id: community.id,
                status: JoinStatus.MANAGER
            });
        }
        await this.communitychannelService.create({
            community_id: community.id,
            title: "general",
            sort: 1,
            state: ChannelState.PUBLIC,
            profile_img: null,
            description: null,
            user_id: data.owner_id
        });
        const channel = await this.communitychannelService.findbyCommunityId(community.id);

        return {
            ...(community.get({ plain: true }) as Community),
            channels: channel.result.map(item => new CommunityChannelBaseDto({ ...item })),
            is_private: community.state === CommunityState.PRIVATE ? true : false,
            is_subscribed: true
        };
    }

    async updateCommunity(community: Community, data: UpdateCommunityDto) {
        const transaction = await this.communityService.getTransaction();
        try {
            await this.communityService.update(community.id, { ...data }, transaction);
            if (data.community_manager_id) {
                const existUser = await this.userService.findOne(data.community_manager_id);
                if (existUser === null) {
                    throw new NotFoundException("일치하는 유저가 없습니다");
                }
                if (community.manager_id !== undefined && community.manager_id !== null) {
                    const manageJoinInfo = await this.communityjoinService.findwithCommunityId(
                        community.manager_id,
                        community.id,
                        transaction
                    );
                    if (manageJoinInfo !== null) {
                        await this.communityjoinService.update(
                            manageJoinInfo.id,
                            {
                                status: JoinStatus.MEMBER,
                                user_id: manageJoinInfo.user_id,
                                community_id: manageJoinInfo.community_id
                            },
                            transaction
                        );
                    }
                    let newManageJoinInfo = await this.communityjoinService.findwithCommunityId(
                        data.community_manager_id,
                        community.id,
                        transaction
                    );
                    if (newManageJoinInfo === null) {
                        await this.communityjoinService.createJoin(
                            {
                                community_id: community.id,
                                user_id: data.community_manager_id,
                                status: JoinStatus.MANAGER
                            },
                            transaction
                        );
                        newManageJoinInfo = await this.communityjoinService.findwithCommunityId(
                            data.community_manager_id,
                            community.id,
                            transaction
                        );
                    }
                }
            }
            if (data.community_sub_manager_id) {
                const existUser = await this.userService.findOne(data.community_sub_manager_id);
                if (existUser === null) {
                    throw new NotFoundException("일치하는 유저가 없습니다");
                }
                if (community.submanager_id !== undefined && community.submanager_id !== null) {
                    const manageJoinInfo = await this.communityjoinService.findwithCommunityId(
                        community.submanager_id,
                        community.id,
                        transaction
                    );
                    if (manageJoinInfo !== null) {
                        await this.communityjoinService.update(
                            manageJoinInfo.id,
                            {
                                status: JoinStatus.MEMBER,
                                user_id: manageJoinInfo.user_id,
                                community_id: manageJoinInfo.community_id
                            },
                            transaction
                        );
                    }
                    let newManageJoinInfo = await this.communityjoinService.findwithCommunityId(
                        data.community_sub_manager_id,
                        community.id,
                        transaction
                    );
                    if (newManageJoinInfo === null) {
                        await this.communityjoinService.createJoin(
                            {
                                community_id: community.id,
                                user_id: data.community_sub_manager_id,
                                status: JoinStatus.SUBMANAGER
                            },
                            transaction
                        );
                        newManageJoinInfo = await this.communityjoinService.findwithCommunityId(
                            data.community_sub_manager_id,
                            community.id,
                            transaction
                        );
                    }
                }
            }
            if (data.community_profile_img) {
                await this.communityService.updateProfile(community.id, data.community_profile_img, transaction)
            }
            if (data.community_banner_img) {
                await this.communityService.updateBanner(community.id, data.community_banner_img, transaction)
            }
            transaction.commit();
            const returnCommunityInfo = await this.communityService.findOne(community.id);
            return new ReturnCommunityDto({ ...returnCommunityInfo.get({ plain: true }) });
        } catch (error) {
            console.error(error);
            transaction.rollback();
            if (error instanceof NotFoundException) {
                throw error;
            } else {
                throw new InternalServerErrorException();
            }
        }
    }

    async channelCombine(community_id: string, removed_channel_id: string, combined_channel_id: string) {

        const removedChannelInfo = await this.communitychannelService.findOne(removed_channel_id);
        const combinedChannelInfo = await this.communitychannelService.findOne(combined_channel_id);
        if (removedChannelInfo === null || combinedChannelInfo === null) {
            throw new NotFoundException();
        }

        await this.channelPostService.updateChannelId(community_id, removed_channel_id, combined_channel_id);
        await this.communitychannelService.delete(removedChannelInfo.id);
        return { success: true };
    }

    async setManager(communityInfo: Community, userJoin: CommunityJoin) {
        if (communityInfo.manager_id !== userJoin.user_id) {
            const preManage = await this.communityjoinService.findwithCommunityId(
                communityInfo.manager_id,
                communityInfo.id
            );
            if (communityInfo.manager_id !== undefined && communityInfo.manager_id !== null && preManage !== null) {
                await this.communityjoinService.update(preManage.id, {
                    status: JoinStatus.MEMBER,
                    user_id: preManage.user_id,
                    community_id: preManage.community_id
                });
            }
            await this.communityjoinService.update(userJoin.id, {
                status: JoinStatus.MANAGER,
                user_id: userJoin.user_id,
                community_id: userJoin.community_id
            });
        }

    }

    async createCommunityChannels(data: CreateCommunityChannelDto, community: Community, user_id?: number) {
        const newChannel = await this.communitychannelService.create({
            ...data,
            community_id: community.id,
            user_id: user_id ? user_id : community.owner_id
        });
        return new ReturnCommunityChannelDto({
            ...newChannel.get({ plain: true }),
            is_private: newChannel.state === ChannelState.PRIVATE ? true : false
        });
    }

    async updateCommunityChannels(community_id: string, channel_id: string, data: UpdateCommunityChannelDto) {

        const channel = await this.communitychannelService.update(community_id, channel_id, data);
        return new CommunityChannelBaseDto({ ...channel.get({ plain: true }) });
    }

    async channeldelete(community_id: string, channel_id: string) {
        await this.communitychannelService.deleteWidhChannelId(community_id, channel_id);
        return { success: true };
    }

    async communityBlock(community_id: string, user_id: number) {
        const checkBlocked = await this.blockService.findBlockedUser(user_id, community_id, BlockType.COMMUNITYBLOCK);
        if (checkBlocked === null) {
            await this.blockService.createCommunityBlock({
                community_id: community_id,
                target_id: user_id,
                type: BlockType.COMMUNITYBLOCK
            });
        }
        const findblockUser = await this.communityjoinService.updatecommunityblockType(
            user_id,
            community_id,
            JoinState.BLOCK
        );
        // const commonInfo = await this.commonInfoService.commonInfos(user.id, findblockUser.user_id);

        const userInfo = await this.userService.findOne(user_id);
        return new ReturnCommunityJoinDto({
            ...userInfo,
            id: findblockUser.user_id,
            state: findblockUser.state,
            status: findblockUser.status
        });
    }

    async userUnBlock(userInfo: User, community_id: string) {
        const block = await this.blockService.findBlockedUser(userInfo.id, community_id, BlockType.COMMUNITYBLOCK);
        if (!block) {
            return new UserDto({ ...userInfo, is_blocked: true });
        } else {
            await this.blockService.delete(block.id);
            await this.communityjoinService.updatecommunityblockType(userInfo.id, community_id, JoinState.ACTIVE);
            return new UserDto({ ...userInfo, is_blocked: false });
        }
    }

    async communityKick(user_id: number, community_id: string, joinInfo: CommunityJoin) {
        await this.blockService.createCommunityKick({
            target_id: user_id,
            community_id: community_id,
            type: BlockType.KICK
        });

        const authorTokenInfo = await this.fcmService.getTokenByUserId(user_id);
        const commuInfo = await this.communityService.findOne(community_id);
        await this.fcmService.sendFCM(
            authorTokenInfo,
            "Ben",
            `You kicked out of ${commuInfo.name}`,
            FcmEnumType.USER,
            community_id
        );

        const updateKick = await this.communityjoinService.updateblockType(joinInfo.id, JoinState.KICK);
        const userInfo = await this.userService.findOne(user_id);
        return new CommunityJoinUserDto({
            ...(updateKick.get({ plain: true }) as any),
            user: userInfo
        });
    }

    async communityUnKick(kickedUser: Block, joinUser: CommunityJoin) {
        await this.blockService.delete(kickedUser.id);
        const updateKick = await this.communityjoinService.updateblockType(joinUser.id, JoinState.ACTIVE);
        const userInfo = await this.userService.findOne(joinUser.user_id);
        return new CommunityJoinUserDto({
            user: userInfo,
            ...updateKick.get({ plain: true })
        });
    }
}