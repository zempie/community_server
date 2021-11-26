import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from 'src/user/user.entity';
import { AlarmController } from './alarm.controller';
import { Alarm } from './alarm.entity';
import { AlarmService } from './alarm.service';

@Module({
    imports: [
        SequelizeModule.forFeature([User, Alarm]),
    ],
    controllers: [AlarmController],
    providers: [AlarmService]
})
export class AlarmModule { }
