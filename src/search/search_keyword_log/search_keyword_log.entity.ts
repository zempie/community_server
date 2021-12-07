import { BaseEntity } from "src/abstract/base-entity";
import { Column, Table } from "sequelize-typescript";

@Table({ tableName: "search_keyword_log", timestamps: true, paranoid: true })
export class SearchKeywordLog extends BaseEntity {
    @Column({
        allowNull: true
    })
    user_id: number;

    @Column({
        allowNull: false
    })
    keyword: string;
}
