import { Column, CreatedAt, DataType, DeletedAt, Model, Table, UpdatedAt } from "sequelize-typescript";


@Table({ tableName: "user_meta", paranoid: true })
export class UserMeta extends Model {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true
  })
  id: number;

  @Column({ type: DataType.INTEGER })
  user_id: number;

  @Column({ type: DataType.DATE })
  notification_check_time: Date

  @CreatedAt
  created_at: Date;

  @UpdatedAt
  updated_at: Date;

  @DeletedAt
  deleted_at: Date;

}