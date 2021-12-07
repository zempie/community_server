import { ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { ENUM } from "sequelize";
import { CommunitySort } from "src/community/enum/communitysort.enum";

export class UserSortDto {
    @ApiPropertyOptional({
        enum: CommunitySort,
        enumName: "CommunitySort"
    })
    @Type(() => ENUM)
    sort: CommunitySort;
}
