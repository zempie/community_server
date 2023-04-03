import { BelongsTo, Column, DataType, ForeignKey, HasMany, HasOne, Model, Table } from "sequelize-typescript";
import { Posts } from "src/posts/posts.entity";
import { BaseEntity } from "src/abstract/base-entity";
import { metadataType } from "./enum/post_metadata.enum";

@Table({tableName: "post_metadata", paranoid: true, timestamps: true  })
export class PostMetadata extends BaseEntity{
  @ForeignKey(() => Posts)
  @Column({
      type: DataType.UUID,
      field: "posts_id"
  })
  posts_id: string;

  @BelongsTo(() => Posts)
  posts: Posts;

  @Column({
    defaultValue: metadataType.website
  })
  type: metadataType

  @Column({
    defaultValue: ''
  })
  url: string

  @Column({
    defaultValue: ''
  })
  title: string

  @Column({
    defaultValue: ''
  })
  site_name:string

  @Column({
    defaultValue: '',
    allowNull: true
  })
  description?: string

  @Column({
    defaultValue: '',
    allowNull: true
  })
  img?: string

  @Column({
    defaultValue: '',
    allowNull: true
  })
  favicon?: string

  @Column({
    defaultValue: '',
    allowNull: true
  })
  video_url?: string
  


}