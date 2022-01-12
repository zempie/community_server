import { Column, HasOne, Table } from "sequelize-typescript";
import { BaseEntity } from "src/abstract/base-entity";
import { Posts } from "src/posts/posts.entity";

@Table({ tableName: "game_post", paranoid: true })
export class GamePost extends BaseEntity {
    @Column
    game_id: string;

    @Column
    post_id: string;

    @Column({
        defaultValue: false
    })
    is_pinned: boolean;

    // @HasOne(() => Posts)
    // posts: Posts;
}
