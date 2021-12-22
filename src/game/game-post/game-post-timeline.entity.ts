import { Column, DataType, Table } from "sequelize-typescript";
import { PostAttatchmentFileDto } from "src/posts/dto/create-posts.dto";
import { PostType, PostFunctionType } from "src/posts/enum/post-posttype.enum";
import { PostStatus } from "src/posts/enum/post-status.enum";
import { Visibility } from "src/posts/enum/post-visibility.enum";
import { GamePost } from "./game-post.entity";

/*
CREATE view game_timeline as
select
    `cp`.`id` AS `id`,
    `cp`.`createdAt` AS `createdAt`,
    `cp`.`updatedAt` AS `updatedAt`,
    `cp`.`deletedAt` AS `deletedAt`,
    `cp`.`game_id` as `game_id`,
    `cp`.`post_id` AS `post_id`,
    `p`.`post_type` AS `post_type`,
    `p`.`funtion_type` AS `funtion_type`,
    `p`.`attatchment_files` AS `attatchment_files`,
    `p`.`visibility` AS `visibility`,
    `p`.`hashtags` AS `hashtags`,
    `p`.`like_cnt` AS `like_cnt`,
    `p`.`status` AS `status`,
    `cp`.`is_pinned` as `is_pinned`
from
    (`zempie`.`game_post` `cp`
left join `zempie`.`posts` `p` on
    ((`cp`.`post_id` = `p`.`id`)))
where `p`.`deletedAt` is null and (`p`.`scheduled_for` is null or `p`.`scheduled_for` <= UNIX_TIMESTAMP())
*/

@Table({ tableName: "game_timeline", timestamps: true, paranoid: true })
export class GamePostTimeLine extends GamePost {
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

    @Column({
        type: DataType.JSON,
        get(this: GamePostTimeLine) {
            const item = this.getDataValue("hashtags");
            if (typeof item === "object") {
                return item
            } else {
                try {
                    return JSON.parse(item);
                } catch (error) {
                    return []
                }
            }
        }
    })
    hashtags: string[];

    @Column({
        defaultValue: 0
    })
    like_cnt: number;

    @Column({
        type: DataType.ENUM(PostStatus.ACTIVE, PostStatus.DRAFT),
        defaultValue: PostStatus.ACTIVE
    })
    status: PostStatus;

    @Column({
        defaultValue: false
    })
    is_pinned: boolean;
}
