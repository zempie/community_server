import { BelongsTo, Column, CreatedAt, DataType, ForeignKey, Model, Table, UpdatedAt } from "sequelize-typescript";
import { BaseEntity } from "src/abstract/base-entity";
import { Poll } from "../poll.entity";

@Table({ tableName: "choice", timestamps: true, paranoid: true })
export class Choice extends BaseEntity {
    @ForeignKey(() => Poll)
    @Column({
        type: DataType.UUID,
        field: "poll_id",
        onDelete: "CASCADE"
    })
    pollId: string;

    @BelongsTo(() => Poll)
    poll: Poll;

    @Column
    title: string;

    // @Column({
    //     defaultValue: false
    // })
    // is_voted: boolean;

    @Column({
        defaultValue: 0
    })
    voted_cnt: number;
}
