import { Column, Table } from "sequelize-typescript";
import { BaseEntity } from "src/abstract/base-entity";

@Table({ tableName: "portfolio", paranoid: true })
export class Portfolio extends BaseEntity {
    @Column
    title: string;

    @Column
    description: string;

    @Column
    thumbnail_img: string;

    @Column({
        defaultValue: true
    })
    is_public: boolean;

    @Column
    user_id: number;

    @Column({
        defaultValue: false
    })
    is_pinned: boolean;
}
