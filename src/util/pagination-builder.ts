import { Type } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";
import { Model } from "sequelize-typescript";
import { FindAndCountOptions } from "sequelize/types";

export function CustomQueryResultResponseType(node: any): any {
    class PageInfo {
        @ApiProperty({ description: "다음 페이지 존재여부" })
        hasNextPage: boolean;
    }
    class BuildCustomQueryResult {
        @ApiProperty({ description: "전체 개수" })
        totalCount: number;
        @ApiProperty({ description: "노드", type: node, isArray: true })
        result: typeof node[];
        @ApiProperty({ description: "전체 개수", type: PageInfo })
        pageInfo: PageInfo;
    }
    return BuildCustomQueryResult
}

export class CustomQueryResult<T> {
    @ApiProperty({ description: "전체 개수" })
    totalCount: number;
    @ApiProperty({ description: "노트" })
    result: T[];
    @ApiProperty({ description: "전체 개수" })
    pageInfo: {
        hasNextPage: boolean;
    };
    constructor(partial: Partial<CustomQueryResult<T>>) {
        Object.assign(this, partial);
    }
}
type Constructor<T> = new (...args: any[]) => T;
export type ModelType<T extends Model<T>> = Constructor<T> & typeof Model;

export class CustomQueryGenerator<T extends Model<T>> {

    private readonly DEFAULT_LIMIT = 10;

    constructor(protected model: ModelType<T>) {
    }

    async find(options?: FindAndCountOptions): Promise<CustomQueryResult<T>> {
        const data = await this.model.findAndCountAll({ ...options, limit: options.limit ? options.limit : this.DEFAULT_LIMIT, raw: false })

        const limit = options.limit ? options.limit : this.DEFAULT_LIMIT;
        const offset = options.offset ? options.offset : 0;
        const totalCont = data.count;

        // console.log(data.rows.map(item => {
        //     console.log(item.get({ plain: true }));
        //     return item
        // }));

        // const totalPage = Math.floor(totalCont / limit) + ((totalCont % limit) > 0 ? 1 : 0);


        return new CustomQueryResult<T>(
            {
                totalCount: totalCont,
                result: data.rows.map(item => item.get({ plain: true }) as T),
                pageInfo: {
                    hasNextPage: (limit + offset) < totalCont ? true : false
                }
            }
        )
    }
}