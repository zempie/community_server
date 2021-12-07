import { ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { ENUM } from "sequelize";
import { BaseQuery } from "../../abstract/base-query";
import { CommunitySort, CommunityShow } from "../enum/communitysort.enum";

export class CommunityListDto extends BaseQuery {

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
    sort?: CommunitySort;

    @ApiPropertyOptional({
        enum: CommunityShow,
        enumName: "CommunityShow"
    })
    @Type(() => ENUM)
    show?: CommunityShow;
}
