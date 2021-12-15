import { Inject, Injectable } from '@nestjs/common';
import { BaseService } from 'src/abstract/base-service';
import { Admins } from './admin.entity';

@Injectable()
export class AdminService extends BaseService<Admins> {
    constructor(
        @Inject("AdminsRepository")
        private readonly userRepository: typeof Admins
    ) {
        super(userRepository);
    }
}
