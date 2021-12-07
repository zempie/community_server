import { Column, Table } from "sequelize-typescript";
import { BaseEntity } from "src/abstract/base-entity";

@Table({ tableName: "adminfcm", timestamps: true, paranoid: true })
export class AdminFcm extends BaseEntity {
    @Column({
        allowNull: false
    })
    user_id: number;

    @Column({})
    token: string;
}
