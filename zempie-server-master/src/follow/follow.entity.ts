import { Column, Table } from "sequelize-typescript";
import { BaseEntity } from "src/abstract/base-entity";

@Table({ tableName: "follow", timestamps: true, paranoid: true })
export class Follow extends BaseEntity {
    @Column({
        allowNull: false
    })
    user_id: number;

    @Column({
        allowNull: false
    })
    follow_id: number;
}
