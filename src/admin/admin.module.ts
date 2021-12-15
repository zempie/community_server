import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminCommunityController, AdminController, AdminPollController, AdminPostController, AdminTimelineController, AdminUserController } from './admin.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Admins } from './admin.entity';
import { CommunityModule } from 'src/community/community.module';
import { PostsModule } from 'src/posts/posts.module';
import { PollModule } from 'src/poll/poll.module';
import { User } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';
import { CommentModule } from 'src/comment/comment.module';
import { CommunityJoinModule } from 'src/community/community-join/community-join.module';
import { CommunityChannelModule } from 'src/community/community-channel/community-channel.module';
import { BlockModule } from 'src/block/block.module';
import { PortfolioModule } from 'src/portfolio/portfolio.module';
import { PostedAtModule } from 'src/posted_at/posted_at.module';
import { CommonInfoModule } from 'src/commoninfo/commoninfo.module';
import { ChannelTimelineService } from 'src/channel-post/channel-timeline.service';
import { ChannelTimeline } from 'src/channel-post/channel-timeline.entity';
import { ChannelPostModule } from 'src/channel-post/channel-post.module';
import { GamePostModule } from 'src/game/game-post/game-post.module';
import { AdminFcmModule } from './fcm/admin.fcm.module';

@Module({
  imports: [
    SequelizeModule.forFeature([Admins, User, ChannelTimeline]), CommunityModule,
    CommunityJoinModule,
    CommunityChannelModule,
    PostsModule,
    PollModule,
    CommentModule,
    BlockModule,
    PortfolioModule,
    PostedAtModule,
    CommonInfoModule,
    ChannelPostModule,
    GamePostModule,
    AdminFcmModule
  ],
  providers: [AdminService, UserService, ChannelTimelineService],
  controllers: [
    AdminController,
    AdminCommunityController, AdminPostController,
    AdminPollController, AdminUserController,
    AdminTimelineController
  ]
})
export class AdminModule { }
