import { ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { BaseQuery } from "src/abstract/base-query";

export class UserSearchQuery extends BaseQuery {
    @ApiPropertyOptional()
    @Type(() => String)
    username?: string;
}