import { Column, DataType, Table } from "sequelize-typescript";
import { JoinState } from "./enum/joinstate.enum";
import { JoinStatus } from "./enum/joinststus.enum";
import { BaseEntity } from "src/abstract/base-entity";

@Table({ tableName: "community_join", timestamps: true, paranoid: true })
export class CommunityJoin extends BaseEntity {
    @Column({
        allowNull: false
    })
    community_id: string;

    @Column({
        allowNull: false
    })
    user_id: number;

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
