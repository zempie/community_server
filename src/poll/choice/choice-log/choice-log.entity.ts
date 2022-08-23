import { BelongsTo, Column, CreatedAt, DataType, ForeignKey, Model, Table, UpdatedAt } from "sequelize-typescript";
import { BaseEntity } from "src/abstract/base-entity";

@Table({ tableName: "choicelog", paranoid: true })
export class ChoiceLog extends BaseEntity {

    @Column
    user_id: number;

    @Column
    choice_id: string;
}
