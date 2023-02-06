import { Column, CreatedAt, DataType, DeletedAt, Model, Table, UpdatedAt } from "sequelize-typescript";
import { eNotificationType } from "./enum/notification.enum";


@Table({ tableName: "notifications", paranoid: true })
export class Notification extends Model {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true
  })
  id: number;

  @Column({ type: DataType.INTEGER })
  user_id: number;

  @Column({ type: DataType.INTEGER })
  target_user_id: number;      
  
  @Column({ type: DataType.STRING(36) })
  target_id: string;     

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  is_read: boolean;
  
  @Column({ type: DataType.STRING(500), allowNull:false })
  content: string;       
  
  @Column({ type: DataType.SMALLINT, allowNull:false, defaultValue:eNotificationType.notice })
  type: number;    
  
  @CreatedAt
  created_at: Date;

  @UpdatedAt
  updated_at: Date;

  @DeletedAt
  deleted_at: Date;
}