import { Column, CreatedAt, DataType, DeletedAt, Model, Table, UpdatedAt } from "sequelize-typescript";

/*
CREATE OR REPLACE
ALGORITHM = UNDEFINED VIEW `zempie`.`gameview` AS
select
    `zempie`.`games`.`id` AS `id`,
    `zempie`.`games`.`activated` AS `activated`,
    `zempie`.`games`.`enabled` AS `enabled`,
    `zempie`.`games`.`official` AS `official`,
    `zempie`.`games`.`category` AS `category`,
    `zempie`.`games`.`user_id` AS `user_id`,
    `zempie`.`games`.`pathname` AS `pathname`,
    `zempie`.`games`.`title` AS `title`,
    `zempie`.`games`.`description` AS `description`,
    `zempie`.`games`.`version` AS `version`,
    `zempie`.`games`.`control_type` AS `control_type`,
    `zempie`.`games`.`hashtags` AS `hashtags`,
    `zempie`.`games`.`count_start` AS `count_start`,
    `zempie`.`games`.`count_over` AS `count_over`,
    `zempie`.`games`.`count_heart` AS `count_heart`,
    `zempie`.`games`.`url_game` AS `url_game`,
    `zempie`.`games`.`url_thumb` AS `url_thumb`,
    `zempie`.`games`.`url_thumb_webp` AS `url_thumb_webp`,
    `zempie`.`games`.`url_thumb_gif` AS `url_thumb_gif`,
    `zempie`.`games`.`created_at` AS `created_at`,
    `zempie`.`games`.`updated_at` AS `updated_at`,
    `zempie`.`games`.`deleted_at` AS `deleted_at`
from
    `zempie`.`games`
*/
@Table({ tableName: "gameview", paranoid: true })
export class Game extends Model {
    @Column({
        type: DataType.INTEGER,
        autoIncrement: true,
        primaryKey: true
    })
    id: number;

    @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: false })
    activated: boolean;

    @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: false })
    enabled: boolean;

    @Column({ type: DataType.BOOLEAN, defaultValue: false })
    official: boolean;

    @Column({ type: DataType.INTEGER, allowNull: false, defaultValue: 0 })
    category: boolean;

    @Column({ type: DataType.INTEGER })
    user_id: number;

    @Column({ type: DataType.STRING(50), allowNull: false, unique: true })
    pathname: string;

    @Column({ type: DataType.STRING(50), allowNull: false, defaultValue: "" })
    title: string;

    @Column({ type: DataType.STRING(2000), defaultValue: "" })
    description: string;

    @Column({ type: DataType.STRING(20), defaultValue: "0.0.1" })
    version: string;

    @Column({ type: DataType.SMALLINT, defaultValue: 0 })
    control_type: string;

    @Column({ type: DataType.STRING, allowNull: false })
    hashtags: string;

    @Column({ type: DataType.INTEGER, allowNull: false, defaultValue: 0 })
    count_start: number;

    @Column({ type: DataType.INTEGER, allowNull: false, defaultValue: 0 })
    count_over: number;

    @Column({ type: DataType.INTEGER, allowNull: false, defaultValue: 0 })
    count_heart: number;

    @Column({})
    url_game: string;

    @Column({})
    url_thumb: string;

    @Column({})
    url_thumb_webp: string;

    @Column({})
    url_thumb_gif: string;

    @Column({ type: DataType.INTEGER, allowNull: false, defaultValue: 0 })
    game_type: number;

    @Column({ type: DataType.INTEGER, allowNull: false, defaultValue: 0 })
    stage: number;

    @CreatedAt
    created_at: Date;

    @UpdatedAt
    updated_at: Date;

    @DeletedAt
    deleted_at: Date;
}
