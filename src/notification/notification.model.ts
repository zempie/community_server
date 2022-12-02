import { ApiProperty } from "@nestjs/swagger";
import { UserDto } from "src/user/dto/user.dto";

export class NotificationDto {
    @ApiProperty()
    id: number;

    @ApiProperty()
    is_read: UserDto;

    @ApiProperty()
    user_id: number;

    @ApiProperty()
    target_user_id: number;

    @ApiProperty()
    target_id: string;

    @ApiProperty()
    content: string;

    @ApiProperty()
    type: number;

    @ApiProperty()
    created_at: Date;

    @ApiProperty()
    updated_at: Date;

    @ApiProperty()
    deleted_at: Date;

    constructor(partial: Partial<NotificationDto>) {
        Object.assign(this, partial);
    }
}