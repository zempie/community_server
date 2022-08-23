import { Column, HasOne, Table } from "sequelize-typescript";
import { BaseEntity } from "src/abstract/base-entity";
import { Posts } from "src/posts/posts.entity";

@Table({ tableName: "portfolio_post", paranoid: true })
export class PortfolioPost extends BaseEntity {
    @Column
    channel_id: string;

    @Column
    portfolio_id: string;

    @Column
    post_id: string;

    @Column({
        defaultValue: false
    })
    is_pinned: boolean;

    // @HasOne(() => Posts)
    // posts: Posts;
}
