import { BaseEntity } from "src/abstract/base-entity";
import { Column, DataType, Table } from "sequelize-typescript";
import { ShareType } from "./enum/sharetype.enum";

@Table({ tableName: "share_log", timestamps: true, paranoid: true })
export class ShareLog extends BaseEntity {
    @Column({
        allowNull: false
    })
    user_id: number;

    @Column({
        type: DataType.ENUM(ShareType.POST, ShareType.COMMENT)
    })
    type: ShareType;

    @Column({
        allowNull: false
    })
    object_id: string;
}
