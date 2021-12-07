import { BaseEntity } from "src/abstract/base-entity";
import { Column, DataType, Table } from "sequelize-typescript";
import { LikeType } from "../enum/liketype.enum";

@Table({ tableName: "like_log", timestamps: true, paranoid: true })
export class LikeLog extends BaseEntity {
    @Column({
        allowNull: false
    })
    user_id: number;

    @Column({
        type: DataType.ENUM(LikeType.POST, LikeType.COMMENT)
    })
    type: LikeType;

    @Column({
        allowNull: false
    })
    object_id: string;
}
