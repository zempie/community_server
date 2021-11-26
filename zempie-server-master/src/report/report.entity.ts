import { Column, DataType, Model, Table } from "sequelize-typescript";
import { BaseEntity } from "src/abstract/base-entity";
import { targetType } from "./enum/reporttargettype.enum";

@Table({ tableName: "report", timestamps: true, paranoid: true })
export class Report extends BaseEntity {
    @Column
    reporter_user_id: number;

    @Column
    user_id: number;

    @Column
    post_id: string;

    @Column
    comment_id: string;

    @Column({
        type: DataType.ENUM(targetType.COMMENT, targetType.POST, targetType.USER)
    })
    targetType: targetType;

    @Column({
        type: DataType.STRING(100),
        allowNull: false
    })
    report_reason: string;

    @Column({
        defaultValue: false
    })
    isDone: Boolean;
}
