import { BaseEntity } from "src/abstract/base-entity";
import { Column, Table } from "sequelize-typescript";

@Table({ tableName: "community_visit_log", timestamps: true, paranoid: true })
export class CommunityVisitLog extends BaseEntity {
    @Column({
        allowNull: false
    })
    user_id: number;

    @Column({
        allowNull: false
    })
    community_id: string;
}
