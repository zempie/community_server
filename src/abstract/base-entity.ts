import { Column, CreatedAt, DataType, DeletedAt, Model, UpdatedAt } from "sequelize-typescript";

export abstract class BaseEntity extends Model {
    @Column({
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4,
        primaryKey: true
    })
    id: string;

    @CreatedAt
    @Column({
        type: DataType.DATE,
        field: 'created_at',
        // defaultValue: new Date().getTime()
        get(this: BaseEntity) {
            return this.getDataValue("created_at") ?? null;
        }
    })
    created_at: Date;

    @UpdatedAt
    @Column({
        type: DataType.DATE,
        // defaultValue: new Date().getTime()
        get(this: BaseEntity) {
            return this.getDataValue("updated_at") ?? null;
        }
    })
    updated_at: Date;

    @DeletedAt
    @Column({
        type: DataType.DATE,
        allowNull: true,
        defaultValue: null,
        get(this: BaseEntity) {
            const data = this.getDataValue("deleted_at");
            return data ? data.getTime() : null;
        }
    })
    deleted_at: Date;
}
