import { BaseEntity } from "src/abstract/base-entity";
import { Column, Table } from "sequelize-typescript";

@Table({ tableName: "posts_view_log", paranoid: true, timestamps: true })
export class PostsViewLog extends BaseEntity {
    @Column({
        allowNull: false
    })
    user_id: number;

    @Column({
        allowNull: false
    })
    post_id: string;
}
