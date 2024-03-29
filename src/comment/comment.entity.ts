import { CommentType } from "./enum/commenttype.enum";
import { BaseEntity } from "src/abstract/base-entity";
import { File } from "src/file/file.dto";
import {
    Column,
    DataType,
    Table,
} from "sequelize-typescript";

@Table({ tableName: "comment", paranoid: true, timestamps: true })
export class Comment extends BaseEntity {
    @Column({
        allowNull: false
    })
    user_id: number;

    @Column({
        allowNull: false
    })
    user_uid: string;

    @Column
    parent_id: string;

    @Column({
        allowNull: false
    })
    post_id: string;

    @Column({
        type: DataType.ENUM(CommentType.COMMENT, CommentType.REPLY)
    })
    type: CommentType;

    @Column({
        type: DataType.STRING(500),
        allowNull: true
    })
    content: string;

    @Column({
        defaultValue: false
    })
    is_private: boolean;

    @Column({
        defaultValue: false
    })
    is_pinned: boolean;

    @Column({
        type: DataType.JSON,
        get(this: Comment) {
            const item = this.getDataValue("attatchment_files");
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
    attatchment_files?: File[];

    @Column({
        defaultValue: 0
    })
    like_cnt: number;

    @Column({
        defaultValue: 0
    })
    dislike_cnt: number;
}
