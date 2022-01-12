import { Column, Table } from "sequelize-typescript";
import { BaseEntity } from "src/abstract/base-entity";

@Table({ tableName: "fcm", paranoid: true })
export class Fcm extends BaseEntity {
    @Column({
        allowNull: false
    })
    user_id: number;

    @Column({})
    token: string;
}
