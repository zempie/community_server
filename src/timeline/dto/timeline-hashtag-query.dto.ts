import { ApiProperty } from "@nestjs/swagger";
import { IsDefined, IsString } from "class-validator";
import { BaseQuery } from "src/abstract/base-query";

export class TimelineHashTagQueryDto extends BaseQuery {
    @ApiProperty({
        description: "검색 해시태그",
        required:true
    })
    @IsDefined()
    @IsString()
    hashtag?: string;
}