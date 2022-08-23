import {
    AllowNull,
    BelongsTo,
    Column,
    CreatedAt,
    DataType,
    ForeignKey,
    HasMany,
    Model,
    Table,
    UpdatedAt
} from "sequelize-typescript";
import { BaseEntity } from "src/abstract/base-entity";
import { Posts } from "src/posts/posts.entity";
import { Choice } from "./choice/choice.entity";

@Table({ tableName: "poll", paranoid: true })
export class Poll extends BaseEntity {
    @ForeignKey(() => Posts)
    @Column({
        type: DataType.UUID,
        field: "posts_id"
    })
    postsId: string;

    @BelongsTo(() => Posts)
    posts: Posts;

    @HasMany(() => Choice)
    choices: Choice[];

    @Column({
        type: DataType.BIGINT
    })
    duration: number;

    @Column({
        type: DataType.BIGINT
    })
    end_time: number;
}
