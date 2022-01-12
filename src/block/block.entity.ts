import { Column, CreatedAt, DataType, Model, Table, UpdatedAt } from "sequelize-typescript";
import { BaseEntity } from "src/abstract/base-entity";
import { BlockType } from "./enum/blocktype.enum";

@Table({ tableName: "block", paranoid: true })
export class Block extends BaseEntity {
    @Column
    community_id: string;

    @Column
    user_id: number;

    @Column
    target_id: number;

    @Column({
        type: DataType.BIGINT
    })
    blocked_at: number;

    @Column({
        type: DataType.BIGINT
    })
    expires_on: number;

    @Column
    reason: string;

    @Column({
        type: DataType.ENUM(BlockType.USERBLOCK, BlockType.COMMUNITYBLOCK, BlockType.MUTE, BlockType.KICK)
    })
    type: BlockType;
}
