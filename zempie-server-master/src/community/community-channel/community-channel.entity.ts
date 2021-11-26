import { BelongsTo, Column, DataType, ForeignKey, Index, Table } from "sequelize-typescript";
import { BaseEntity } from "src/abstract/base-entity";
import { Community } from "../community.entity";
import { ChannelState } from "./channelstate.enum";

@Table({
    tableName: "community_channel",
    timestamps: true,
    paranoid: true,
    // indexes: [{ name: "channelsortUnique", unique: true, fields: ["community_id"] }]
})
@Index({})
export class CommunityChannel extends BaseEntity {
    @Column
    user_id: number;

    @ForeignKey(() => Community)
    @Column({
        type: DataType.UUID,
        field: "community_id",
    })
    community_id: string;

    @BelongsTo(() => Community)
    community: Community;

    @Column({
        type: DataType.STRING(50),
        allowNull: false
    })
    title: string;

    @Column
    description: string;

    @Column
    profile_img: string;

    // @Column
    // sort: number;

    @Column({
        type: DataType.ENUM(ChannelState.PRIVATE, ChannelState.PUBLIC),
        defaultValue: ChannelState.PUBLIC
    })
    state: ChannelState;
}
