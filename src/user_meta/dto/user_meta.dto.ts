import { ApiProperty } from "@nestjs/swagger";

export class UserMetaDto {

    @ApiProperty({
        description: "id"
    })
    id?: number;

    @ApiProperty({
        description: "유저 id"
    })
    user_id: number;

    @ApiProperty({
        description: "마지막으로 알람을 체크한 시간"
    })
    notification_check_time: Date;

   

}

