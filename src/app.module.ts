import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { CommunityModule } from "./community/community.module";
import * as dotenv from "dotenv";
import { SequelizeModule } from "@nestjs/sequelize";
import { PostsModule } from "./posts/posts.module";
import { UserModule } from "./user/user.module";
import { Comment } from "./comment/comment.entity";
import { Posts } from "./posts/posts.entity";
import { Poll } from "./poll/poll.entity";
import { PostedAt } from "./posted_at/posted_at.entity";
import { Choice } from "./poll/choice/choice.entity";
import { Community } from "./community/community.entity";
import { Follow } from "./follow/follow.entity";
import { Like } from "./like/like.entity";
import { Portfolio } from "./portfolio/portfolio.entity";
import { Report } from "./report/report.entity";
import { CommunityChannel } from "./community/community-channel/community-channel.entity";
import { CommunityJoin } from "./community/community-join/community-join.entity";
import { Block } from "./block/block.entity";
import { BlockModule } from "./block/block.module";
import { AlarmModule } from "./alarm/alarm.module";
import { Alarm } from "./alarm/alarm.entity";
import { CommentModule } from "./comment/comment.module";
import { PollModule } from "./poll/poll.module";
import { ChoiceLog } from "./poll/choice/choice-log/choice-log.entity";
import { SearchModule } from "./search/search.module";
import { ChannelPostModule } from "./channel-post/channel-post.module";
import { PortfolioPost } from "./portfolio/portfolio-post/portfolio-post.entity";
import { TimelineModule } from "./timeline/timeline.module";
import { SchedulingModule } from "./scheduling";
import { HashtagLogModule } from "./hashtag-log/hashtag-log.module";
import { ChannelTimeline } from "./channel-post/channel-timeline.entity";
import { PortfolioPostTimeLine } from "./portfolio/portfolio-post/portfolio-post-timeline.entity";
import { GamePost } from "./game/game-post/game-post.entity";
import { FcmModule } from "./fcm/fcm.module";
import { Fcm } from "./fcm/fcm.entity";
import { ShareLogModule } from "./share/share_log/share_log.module";
import { AdminModule } from './admin/admin.module';
import { Admins } from "./admin/admin.entity";
import { User } from "./user/user.entity";

dotenv.config();
const DB_HOSTNAME = process.env.DB_HOSTNAME;
const DB_PORT = parseInt(process.env.DB_PORT, 10);
const DB_USERNAME = process.env.DB_USERNAME;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_NAME = process.env.DB_NAME;

@Module({
    imports: [
        SequelizeModule.forRoot({
            dialect: "mysql",
            host: DB_HOSTNAME,
            port: DB_PORT,
            username: DB_USERNAME,
            password: DB_PASSWORD,
            database: DB_NAME,
            autoLoadModels: true,
            synchronize: false,
            // sync:{
            //     force:true
            // },
            models: [
                Comment,
                Posts,
                Poll,
                PostedAt,
                Choice,
                ChoiceLog,
                Community,
                CommunityChannel,
                CommunityJoin,
                Follow,
                Like,
                Portfolio,
                Report,
                Block,
                Alarm,
                PortfolioPost,
                ChannelTimeline,
                PortfolioPostTimeLine,
                GamePost,
                Fcm,
                Admins,
                User
            ]
        }),
        CommunityModule,
        PostsModule,
        UserModule,
        BlockModule,
        AlarmModule,
        CommentModule,
        PollModule,
        SearchModule,
        ChannelPostModule,
        TimelineModule,
        HashtagLogModule,
        SchedulingModule,
        FcmModule,
        ShareLogModule,
        AdminModule
    ],
    controllers: [AppController],
    providers: [AppService]
})
export class AppModule {}
