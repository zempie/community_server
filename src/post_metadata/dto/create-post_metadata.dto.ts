import { ApiProperty } from "@nestjs/swagger";
import { metadataType } from "../enum/post_metadata.enum";

export class CreatePostMetadataDto{
  @ApiProperty()
  posts_id: string;


  @ApiProperty({
    description: "메타데이터 타입"
  }) 
  type: metadataType

  @ApiProperty({
    description: "메타데이터 url"
  }) 
  url: string

  @ApiProperty({
    description: "메타데이터 사이트 이름"
  }) 
  site_name: string
  
  @ApiProperty({
    description: "메타데이터 타이틀"
  }) 
  title: string

  @ApiProperty({
    description: "메타데이터 설명"
  }) 
  description?: string    

  @ApiProperty({
    description: "메타데이터 이미지"
  }) 
  img?: string

  @ApiProperty({
    description: "메타데이터 파비콘"
  }) 
  favicon?: string

  @ApiProperty({
    description: "메타데이터가 비디오 타입인 경우 비디오 url"
  }) 
  video_url?: string


}