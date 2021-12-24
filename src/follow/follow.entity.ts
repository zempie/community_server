import { BelongsTo, Column, CreatedAt, DataType, DeletedAt, ForeignKey, Model, Table, UpdatedAt } from "sequelize-typescript";
import { User } from "src/user/user.entity";

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

    @ForeignKey(() => User)
    @Column({
        allowNull: false
    })
    user_id: number;

    @BelongsTo(() => User)
    user: User

    @Column({
        allowNull: false
    })
    follow_id: number;
}
