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
        // defaultValue: new Date().getTime()
        get(this: BaseEntity) {
            return this.getDataValue("createdAt")?.getTime() ?? null;
        }
    })
    createdAt: Date;

    @UpdatedAt
    @Column({
        type: DataType.DATE,
        // defaultValue: new Date().getTime()
        get(this: BaseEntity) {
            return this.getDataValue("updatedAt")?.getTime() ?? null;
        }
    })
    updatedAt: Date;

    @DeletedAt
    @Column({
        type: DataType.DATE,
        allowNull: true,
        defaultValue: null,
        get(this: BaseEntity) {
            const data = this.getDataValue("deletedAt");
            return data ? data.getTime() : null;
        }
    })
    deletedAt: Date;
}
