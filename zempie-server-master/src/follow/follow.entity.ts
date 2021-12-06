import {Column, CreatedAt, DataType, DeletedAt, Model, Table, UpdatedAt} from "sequelize-typescript";
import { BaseEntity } from "src/abstract/base-entity";

@Table({ tableName: "follow", timestamps: true, paranoid: true })
export class Follow extends Model {
    @Column({
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4,
        primaryKey: true
    })
    id: string;

    @Column({
        allowNull: false
    })
    user_id: number;

    @Column({
        allowNull: false
    })
    follow_id: number;

    @CreatedAt
    created_at: Date;

    @UpdatedAt
    updated_at: Date;

    @DeletedAt
    deleted_at: Date;
}
