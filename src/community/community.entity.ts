import { Column, DataType, HasMany, Table } from "sequelize-typescript";
import { BaseEntity } from "src/abstract/base-entity";
import { CommunityState } from "src/community/enum/communitystate.enum";
import { CommunityChannel } from "./community-channel/community-channel.entity";

@Table({ tableName: "community", timestamps: true, paranoid: true })
export class Community extends BaseEntity {
    //커뮤나티 생성자
    @Column({
        allowNull: false
    })
    owner_id: number;

    @Column
    manager_id: number;

    @Column
    submanager_id: number;

    @Column({
        type: DataType.STRING(50),
        allowNull: false
    })
    name: string;

    @Column({
        type: DataType.STRING(50),
        allowNull: true,
        unique: true
    })
    url: string;

    @HasMany(() => CommunityChannel)
    channels: CommunityChannel[];

    @Column({
        type: DataType.STRING(2000),
        allowNull: false
    })
    description: string;

    @Column
    profile_img: string;

    @Column
    banner_img: string;

    @Column({
        defaultValue: 0
    })
    member_cnt: number;

    @Column({
        defaultValue: 0
    })
    posts_cnt: number;

    @Column({
        defaultValue: 0
    })
    visit_cnt: number;

    @Column({
        type: DataType.ENUM(CommunityState.PRIVATE, CommunityState.PUBLIC),
        defaultValue: CommunityState.PUBLIC
    })
    state: CommunityState;

    @Column({
        defaultValue: true
    })
    is_certificated: boolean;
}
