import { ApiProperty } from "@nestjs/swagger";

export class UserMetaDto {
    @ApiProperty()
    id: number;

    @ApiProperty()
    user_id: number;

    @ApiProperty()
    notification_check_time: Date;

    @ApiProperty()
    created_at: Date;

    @ApiProperty()
    updated_at: Date;

    @ApiProperty()
    deleted_at: Date;

  
}