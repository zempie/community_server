import { ApiPropertyOptional, ApiQuery } from "@nestjs/swagger";
import { IsEnum,IsOptional } from "class-validator";
import { BaseQuery } from "src/abstract/base-query";
import { TimeLineMediaFilter, TimeLineSort } from "../enum/timeline-sort.enum";

export class TimelineListQueryDTO extends BaseQuery {
    @ApiPropertyOptional({
        enum: TimeLineSort,
        enumName: "TimeLineSort",
        description: "정렬"
    })
    @IsOptional()
    @IsEnum(TimeLineSort, { always: false })
    sort?: TimeLineSort;

    @ApiPropertyOptional({
        enum: TimeLineMediaFilter,
        enumName: "TimeLineMediaFilter",
        description: "미디어 필터"
    })
    @IsOptional()
    @IsEnum(TimeLineMediaFilter, { always: false })
    media?: TimeLineMediaFilter;
}
