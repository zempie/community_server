import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { ENUM } from "sequelize";
import { BaseQuery } from "src/abstract/base-query";
import { CommunityShow, CommunitySort } from "src/community/enum/communitysort.enum";

export class SearchQueryDto extends BaseQuery {
    @ApiPropertyOptional()
    @Type(() => String)
    q?: string;

    @ApiPropertyOptional()
    @Type(() => String)
    username?: string;

    @ApiPropertyOptional()
    @Type(() => String)
    community?: string;

    @ApiPropertyOptional()
    @Type(() => String)
    posting?: string;

    @ApiPropertyOptional()
    @Type(() => String)
    hashtag?: string;

    @ApiPropertyOptional()
    @Type(() => String)
    gametitle?: string;

    @ApiPropertyOptional({
        enum: CommunitySort,
        enumName: "CommunitySort"
    })
    @Type(() => ENUM)
    sort: CommunitySort;

    @ApiPropertyOptional({
        enum: CommunityShow,
        enumName: "CommunityShow"
    })
    @Type(() => ENUM)
    show: CommunityShow;
}

export class SearchHeaderQuery {
    @ApiProperty()
    @Type(() => String)
    q: string;
}