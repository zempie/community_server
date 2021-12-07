import { Column, DataType, HasMany, HasOne, Table } from "sequelize-typescript";
import { Poll } from "src/poll/poll.entity";
import { PostedAt } from "src/posted_at/posted_at.entity";
import { PostFunctionType, PostType } from "./enum/post-posttype.enum";
import { PostStatus } from "./enum/post-status.enum";
import { Visibility } from "./enum/post-visibility.enum";
import { BaseEntity } from "src/abstract/base-entity";
import { PostAttatchmentFileDto } from "./dto/create-posts.dto";
import { UserDto } from "src/user/dto/user.dto";

@Table({ tableName: "posts", timestamps: true, paranoid: true })
export class Posts extends BaseEntity {
    @Column
    user_id: number;

    @Column({
        type: DataType.ENUM(PostType.BLOG, PostType.SNS)
    })
    post_type: PostType;

    @Column({
        type: DataType.ENUM(PostFunctionType.NONE, PostFunctionType.POLL),
        defaultValue: PostFunctionType.NONE
    })
    funtion_type: PostFunctionType;

    @Column({
        type: DataType.JSON
    })
    attatchment_files?: PostAttatchmentFileDto[];

    @Column({
        type: DataType.ENUM(Visibility.FOLLOWER, Visibility.PUBLIC, Visibility.PRIVATE),
        defaultValue: Visibility.PUBLIC
    })
    visibility: Visibility;

    @Column
    content: string;

    @Column({
        type: DataType.JSON
    })
    hashtags: string[];

    @Column({
        type: DataType.JSON
    })
    user_tag: UserDto[];

    @Column({
        defaultValue: 0
    })
    like_cnt: number;

    @Column({
        defaultValue: 0
    })
    comment_cnt: number;

    @Column({
        defaultValue: 0
    })
    read_cnt: number;

    @Column({
        defaultValue: 0
    })
    shared_cnt: number;

    @HasOne(() => Poll)
    poll: Poll;

    @HasMany(() => PostedAt)
    posted_at: PostedAt;

    @Column
    scheduled_for: string;

    @Column({
        type: DataType.ENUM(PostStatus.ACTIVE, PostStatus.DRAFT),
        defaultValue: PostStatus.ACTIVE
    })
    status: PostStatus;

    @Column({
        defaultValue: false
    })
    is_retweet: boolean;

    @Column({
        type: DataType.UUID,
        allowNull: true
    })
    retweet_id?: string;
}
