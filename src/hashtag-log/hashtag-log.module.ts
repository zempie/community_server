import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { HashTagLog } from './hashtag-log.entity';
import { HashtagLogService } from './hashtag-log.service';

@Module({
  imports: [SequelizeModule.forFeature([HashTagLog])],
  providers: [HashtagLogService],
  exports: [HashtagLogService]
})
export class HashtagLogModule { }
