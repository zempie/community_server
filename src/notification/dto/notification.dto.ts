import { ApiProperty } from "@nestjs/swagger";
import { CommunityUserModelAddCnt } from "src/abstract/base-model";
import { DataType } from "sequelize-typescript";
import { User } from "src/user/user.entity";

export class NotificationDto {

    @ApiProperty({
        description: "알람 id"
    })
    id?: number;

    @ApiProperty({
        description: "유저 id"
    })
    user_id: number;

    @ApiProperty({
        description: "알람을 보낸 유저"
    })
    target_user_id: number;

    @ApiProperty({
        description: "메세지 내용"
    })
    content: string;

    @ApiProperty({
        description: "알림 타겟의 아이디"
    })
    target_id: string;

    @ApiProperty({
        description: "읽음 여부"
    })
    is_read?: boolean;

    @ApiProperty({
        description: "알람 타입"
    })
    type?: number;

}


export class ReturnNotificationDto  {

    @ApiProperty({
        description: "알람 id"
    })
    id?: number;

    @ApiProperty({
        description: "알람을 보낸 유저"
    })
    target_user_id: number;

    @ApiProperty({
        description: "메세지 내용"
    })
    content: string;

    @ApiProperty({
        description: "알림 타겟의 아이디"
    })
    target_id: string;

    @ApiProperty({
        description: "읽음 여부"
    })
    is_read?: boolean;

    @ApiProperty({
        description: "알람 타입"
    })
    type?: number;
    
    @ApiProperty({
        description: "유저"
    })
    user: User;

    @ApiProperty()
    created_at: Date;

    constructor(partial: Partial<ReturnNotificationDto>) {
        Object.assign(this, partial);
    }

}