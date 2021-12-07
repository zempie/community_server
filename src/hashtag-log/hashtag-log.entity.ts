import { Column, Table } from "sequelize-typescript";
import { BaseEntity } from "src/abstract/base-entity";

@Table({ tableName: "hashtaglog", timestamps: true, paranoid: true })
export class HashTagLog extends BaseEntity {

    @Column
    user_id: number;

    @Column
    text: string;

}