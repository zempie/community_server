import { Column, CreatedAt, DataType, DeletedAt, Model, Table, UpdatedAt } from "sequelize-typescript";

@Table({ tableName: "follow", timestamps: true, paranoid: true })
export class Follow extends Model{

    @Column({
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4,
        primaryKey: true
    })
    id: string;

    @CreatedAt
    @Column({
        type: DataType.DATE,
        field:"created_at",
        // defaultValue: new Date().getTime()
        get(this: Follow) {
            return this.getDataValue("createdAt")?.getTime() ?? null;
        },
    })
    createdAt: Date;

    @UpdatedAt
    @Column({
        type: DataType.DATE,
        field: "updated_at",
        // defaultValue: new Date().getTime()
        get(this: Follow) {
            return this.getDataValue("updatedAt")?.getTime() ?? null;
        }
    })
    updatedAt: Date;

    @DeletedAt
    @Column({
        type: DataType.DATE,
        allowNull: true,
        defaultValue: null,
        field: "deleted_at",
        get(this: Follow) {
            const data = this.getDataValue("deletedAt");
            return data ? data.getTime() : null;
        }
    })
    deletedAt: Date;

    @Column({
        allowNull: false
    })
    user_id: number;

    @Column({
        allowNull: false
    })
    follow_id: number;
}
