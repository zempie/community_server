import { ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { ENUM } from "sequelize";
import { BaseQuery } from "../../abstract/base-query";
import { CommentSort } from "../enum/comment.sort.enum";

export class CommentListDto extends BaseQuery {
    @ApiPropertyOptional({
        enum: CommentSort,
        enumName: "CommentSort"
    })
    @Type(() => ENUM)
    sort: CommentSort;
}
