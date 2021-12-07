import { ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";

export abstract class BaseQuery {
    @ApiPropertyOptional()
    @Type(() => Number)
    limit: number;

    @ApiPropertyOptional()
    @Type(() => Number)
    offset: number;
}