import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { ENUM } from "sequelize";
import { Posts } from "src/posts/posts.entity";
import { User } from "src/user/user.entity";
import { ShareType } from "../enum/sharetype.enum";

export class ShareLogDto {
    @ApiProperty({
        enum: ShareType,
        enumName: "ShareType"
    })
    @Type(() => ENUM)
    type: ShareType;

    @ApiProperty()
    object: Posts;

    @ApiProperty()
    count: number;

    @ApiProperty()
    user: User[];
}
