import { Column, DataType, Table } from "sequelize-typescript";
import { BaseEntity } from "src/abstract/base-entity";
import { Visibility } from "src/posts/enum/post-visibility.enum";
import { ChannelPostType } from "./enum/channelposttype.enum";

@Table({ tableName: "channel_post", paranoid: true, timestamps: true })
export class ChannelPost extends BaseEntity {
    @Column
    community_id: string;

    @Column
    channel_id: string;

    @Column
    post_id: string;

    @Column({
        type: DataType.ENUM(ChannelPostType.USER, ChannelPostType.COMMUNITY)
    })
    type: ChannelPostType;

    @Column({
        type: DataType.ENUM(Visibility.FOLLOWER, Visibility.PUBLIC, Visibility.PRIVATE)
    })
    visibility: Visibility;

    @Column({
        defaultValue: false
    })
    is_pinned: boolean;
}
