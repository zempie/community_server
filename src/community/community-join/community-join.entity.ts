import { BelongsTo, Column, DataType, ForeignKey, Table } from "sequelize-typescript";
import { JoinState } from "./enum/joinstate.enum";
import { JoinStatus } from "./enum/joinststus.enum";
import { BaseEntity } from "src/abstract/base-entity";
import { User } from "src/user/user.entity";

@Table({ tableName: "community_join", paranoid: true })
export class CommunityJoin extends BaseEntity {
    @Column({
        allowNull: false
    })
    community_id: string;

    @ForeignKey(() => User)
    @Column({
        allowNull: false
    })
    user_id: number;

    @BelongsTo(() => User)
    user: User

    @Column({
        type: DataType.ENUM(JoinStatus.MANAGER, JoinStatus.SUBMANAGER, JoinStatus.MEMBER, JoinStatus.OWNER),
        allowNull: false
    })
    status: JoinStatus;

    @Column({
        type: DataType.ENUM(JoinState.ACTIVE, JoinState.BLOCK, JoinState.KICK),
        defaultValue: JoinState.ACTIVE
    })
    state: JoinState;
}
