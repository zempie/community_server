import { Table, Model, Column, DataType } from "sequelize-typescript";

/*
CREATE OR REPLACE
ALGORITHM = UNDEFINED VIEW `zempie`.`adminsview` AS
select
    `zempie`.`admins`.`id` AS `id`,
    `zempie`.`admins`.`uid` AS `uid`,
    `zempie`.`admins`.`activated` AS `activated`,
    `zempie`.`admins`.`account` AS `account`,
    `zempie`.`admins`.`name` AS `name`,
    `zempie`.`admins`.`level` AS `level`,
    `zempie`.`admins`.`sub_level` AS `sub_level`,
    `zempie`.`admins`.`password` AS `password`,
    `zempie`.`admins`.`created_at` AS `created_at`,
    `zempie`.`admins`.`updated_at` AS `updated_at`,
    `zempie`.`admins`.`deleted_at` AS `deleted_at`
from
    `zempie`.`admins`
*/

@Table({ tableName: "adminsview", timestamps: true, paranoid: true })
export class Admins extends Model{
    @Column({
        type: DataType.INTEGER,
        autoIncrement: true,
        primaryKey: true
    })
    id: number;

    @Column({})
    uid:string;

    @Column({})
    activated:number;

    @Column({})
    account: string;

    @Column({})
    name: string;

    @Column({})
    level: number;

    @Column({})
    sub_level: number;
}