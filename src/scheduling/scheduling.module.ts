import { Module } from "@nestjs/common";
import { ScheduleModule, SchedulerRegistry } from "@nestjs/schedule";
import { SequelizeModule } from "@nestjs/sequelize";
import { Posts } from "src/posts/posts.entity";

import { TasksSevice } from "./scheduing.jobs";

@Module({
    imports: [ScheduleModule.forRoot(), SequelizeModule.forFeature([Posts])],
    providers: [TasksSevice]
})
export class SchedulingModule {}
