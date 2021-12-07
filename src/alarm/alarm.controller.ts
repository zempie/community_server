import { BadRequestException, Body, Controller, Get, Patch, UsePipes, ValidationPipe } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { CurrentUser } from "src/auth/user-auth-decorator";
import { UserAuthGuard } from "src/auth/user-auth.guard";
import { User } from "src/user/user.entity";
import { ZempieUseGuards } from "src/util/decorators/ZempieUseGaurd";
import { AlarmFormEnum } from "./alarm.enum";
import { AlarmService } from "./alarm.service";
import { AlarmDTO, UpdateAlarmDto } from "./dto/alarm.dto";

@Controller("api/v1/alarm")
@ApiTags("api/v1/alarm")
export class AlarmController {
    constructor(private alarmService: AlarmService) {}

    @Get("mine")
    @ApiResponse({ status: 200, description: "성공 반환", type: AlarmDTO })
    @ApiOperation({ description: "내 커뮤니티 알림 설정 정보" })
    @ZempieUseGuards(UserAuthGuard)
    async findMine(@CurrentUser() user: User): Promise<AlarmDTO> {
        const info = await this.alarmService.findOne(user.id);
        return info;
    }

    _checkAlarmEnum(value: string) {
        const check = Object.values(AlarmFormEnum).find(txt => txt === value);
        if (check === undefined) {
            throw new BadRequestException("잘못된 Form 값입니다.");
        }
    }

    @Patch("mine")
    @ApiResponse({ status: 200, description: "성공 반환" })
    @ApiOperation({ description: "내 커뮤니티 알림 설정 정보 업데이트" })
    @ZempieUseGuards(UserAuthGuard)
    @UsePipes(new ValidationPipe({ whitelist: false, transform: true }))
    async updateAlarmInfo(@CurrentUser() user: User, @Body() data: UpdateAlarmDto) {
        const info = await this.alarmService.findOne(user.id);

        return await this.alarmService.update(info.id, data);
    }
}
