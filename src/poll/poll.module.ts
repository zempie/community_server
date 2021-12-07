import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { ChannelPostModule } from "src/channel-post/channel-post.module";
import { CommunityModule } from "src/community/community.module";
import { PortfolioPostModule } from "src/portfolio/portfolio-post/portfolio-post.module";
import { PostedAtModule } from "src/posted_at/posted_at.module";
import { PostsModule } from "src/posts/posts.module";
import { User } from "src/user/user.entity";
import { UserModule } from "src/user/user.module";
import { ChoiceModule } from "./choice/choice.module";
import { PollController } from "./poll.controller";
import { Poll } from "./poll.entity";
import { PollLogicService } from "./poll.logic.service";
import { PollService } from "./poll.service";

@Module({
    imports: [SequelizeModule.forFeature([Poll, User]),
        UserModule, PostsModule, ChoiceModule,
        PostedAtModule, ChannelPostModule, PortfolioPostModule, CommunityModule
    ],
    controllers: [PollController],
    providers: [PollService, PollLogicService],
    exports: [PollService, PollLogicService]
})
export class PollModule { }
