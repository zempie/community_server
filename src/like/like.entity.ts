import { Column, DataType, Table } from "sequelize-typescript";
import { BaseEntity } from "src/abstract/base-entity";
import { LikeType } from "./enum/liketype.enum";

@Table({ tableName: "like", paranoid: true })
export class Like extends BaseEntity {
    @Column({
        allowNull: false
    })
    post_id: string;

    @Column
    comment_id: string;

    @Column
    user_id: number;

    @Column({
        type: DataType.ENUM(LikeType.POST, LikeType.COMMENT)
    })
    type: LikeType;

    @Column({
        defaultValue: true
    })
    state: boolean;
}
