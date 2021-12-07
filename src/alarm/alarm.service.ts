import { Inject, Injectable } from '@nestjs/common';
import { BaseService } from 'src/abstract/base-service';
import { User } from 'src/user/user.entity';
import { Alarm } from './alarm.entity';
import { UpdateAlarmDto } from './dto/alarm.dto';

@Injectable()
export class AlarmService extends BaseService<Alarm> {

    constructor(
        @Inject("AlarmRepository")
        private readonly alarmRepository: typeof Alarm,
    ) {
        super(alarmRepository)
    }

    async findOne(userId: any) {
        const user = await this.alarmRepository.findOne({
            where: {
                userId: userId
            }
        }) ?? null;
        
        return user !== null ? user : await this.create({ userId: userId });
    }

    async update(id: string, data: UpdateAlarmDto) {
        await this.alarmRepository.update(data, {
            where: {
                id: id
            }
        })
        return await super.findOne(id);
    }
}
