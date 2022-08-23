import { BelongsTo, Column, CreatedAt, DataType, DeletedAt, ForeignKey, Model, Table, UpdatedAt } from "sequelize-typescript";
import { User } from "src/user/user.entity";

@Table({ tableName: "follow", paranoid: true })
export class Follow extends Model {

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
        get(this: Follow) {
            return this.getDataValue("created_at")?.getTime() ?? null;
        },
    })
    created_at: Date;

    @UpdatedAt
    @Column({
        type: DataType.DATE,
        // defaultValue: new Date().getTime()
        get(this: Follow) {
            return this.getDataValue("updated_at")?.getTime() ?? null;
        }
    })
    updated_at: Date;

    @DeletedAt
    @Column({
        type: DataType.DATE,
        allowNull: true,
        defaultValue: null,
        get(this: Follow) {
            const data = this.getDataValue("deleted_at");
            return data ? data.getTime() : null;
        }
    })
    deleted_at: Date;

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
