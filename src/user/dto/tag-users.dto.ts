import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { BaseQuery } from 'src/abstract/base-query';

export class TagUsersDto extends BaseQuery {
    @ApiPropertyOptional({description:"검색어"})
    @Type(()=>String)
    search:string;
}