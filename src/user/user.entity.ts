import { Column, CreatedAt, DataType, DeletedAt, Model, Table, UpdatedAt } from "sequelize-typescript";

//쿼리 : select * from users

@Table({ tableName: "usersview", timestamps: true, paranoid: true })
export class User extends Model {
    @Column({
        type: DataType.INTEGER,
        autoIncrement: true,
        primaryKey: true
    })
    id: number;

    @Column({})
    uid: string;

    @Column({})
    name: string;

    @Column({})
    channel_id: string;

    @Column({})
    picture: string;

    @Column({})
    email: string;

    @Column({})
    is_developer: number;

    @Column({
        type: DataType.DATE
    })
    last_log_in: Date;

    @CreatedAt
    created_at: Date;

    @UpdatedAt
    updated_at: Date;

    @DeletedAt
    deleted_at: Date;
}
