export class CreateNotificationDto {
  id:number;
  user_id:number;
  target_user_id:number;
  target_id:string;
  content:string;
  is_read:boolean;
  type:number;
}