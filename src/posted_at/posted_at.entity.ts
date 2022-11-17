import { BelongsTo, Column, DataType, ForeignKey, HasMany, HasOne, Model, Table } from "sequelize-typescript";
import { Posts } from "src/posts/posts.entity";
import { Community } from "src/community/community.entity";
import { BaseEntity } from "src/abstract/base-entity";
import { PostedAtCommunityDto, PostedAtGameDto } from "./dto/posted_at.dto";

@Table({ tableName: "posted_at", paranoid: true, timestamps: true })
export class PostedAt extends BaseEntity {
    @ForeignKey(() => Posts)
    @Column({
        type: DataType.UUID,
        field: "posts_id"
    })
    posts_id: string;

    @BelongsTo(() => Posts)
    posts: Posts;

    //내 채널에 올린 경우
    @Column
    channel_id: string;

    //게임페이지에 올린경우
    @Column({
        type: DataType.JSON,
        get(this: PostedAt) {
            const item = this.getDataValue("game");
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
    game: PostedAtGameDto[];

    //커뮤니티페이지에 올린경우
    //    채널 선택
    @Column({
        type: DataType.JSON,
        get(this: PostedAt) {
            const item = this.getDataValue("community");
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
    community: PostedAtCommunityDto[]
    // @Column
    // community_id: string;

    // @Column
    // community_channel_id: string;

    //포트폴리오에 추가한경우
    @Column({
        type: DataType.JSON,
        get(this: PostedAt) {
            const item = this.getDataValue("portfolio_ids");
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
    portfolio_ids: string[];
}
