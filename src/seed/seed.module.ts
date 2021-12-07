import { Logger, Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import * as dotenv from "dotenv";
import { Alarm } from "src/alarm/alarm.entity";
import { Block } from "src/block/block.entity";
import { ChannelPost } from "src/channel-post/channel-post.entity";
import { Comment } from "src/comment/comment.entity";
import { CommunityChannel } from "src/community/community-channel/community-channel.entity";
import { CommunityJoin } from "src/community/community-join/community-join.entity";
import { Community } from "src/community/community.entity";
import { Follow } from "src/follow/follow.entity";
import { GamePost } from "src/game/game-post/game-post.entity";
import { Game } from "src/game/game.entity";
import { Like } from "src/like/like.entity";
import { ChoiceLog } from "src/poll/choice/choice-log/choice-log.entity";
import { Choice } from "src/poll/choice/choice.entity";
import { Poll } from "src/poll/poll.entity";
import { PortfolioPost } from "src/portfolio/portfolio-post/portfolio-post.entity";
import { Portfolio } from "src/portfolio/portfolio.entity";
import { PostedAt } from "src/posted_at/posted_at.entity";
import { Posts } from "src/posts/posts.entity";
import { Report } from "src/report/report.entity";
import { User } from "src/user/user.entity";
import { Seeder } from "./seeder";

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
            synchronize: true,
            sync:{
                force:true
            },
            logging:true,
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
                User,
                ChannelPost,
                GamePost,
                Game,
            ]
        }),
        SequelizeModule.forFeature([
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
            User,
            ChannelPost,
            GamePost,
            Game,
        ]),
    ],
    providers: [Logger, Seeder]
})
export class SeedModule { }
