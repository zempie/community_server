import { HttpException, HttpStatus, Inject, Injectable } from "@nestjs/common";
import axios from "axios";
import { Op } from "sequelize";
import { Transaction } from "sequelize/types";
import { CreatePostMetadataDto } from "./dto/create-post_metadata.dto";
import { PostMetadataDto } from "./dto/post_metadata.dto";
import { UpdatePostMetadataDto } from "./dto/update-post_metadata.dto";
import { metadataType } from "./enum/post_metadata.enum";
import { PostMetadata } from "./post_metadata.entity";

@Injectable()
export class PostMetadataService {
  constructor(
    @Inject("PostMetadataRepository")
    private readonly postMetadataRepository: typeof PostMetadata
) { }

  async getYoutubeTag( link: string ){
    const ytApi = process.env.YOUTUBE_VIDEO_API
    const API_KEY = process.env.FIREBASE_API_KEY
    const videoId = link.split('v=')[1];
    const isYtUrl= new URL(link).hostname.includes('youtube.com')
    const EMBED_LINK = process.env.YOUTUBE_EMBED_LINK

    if (isYtUrl && videoId) {
      try {
        const result = await axios.get(`${ytApi}?id=${videoId}&key=${API_KEY}&part=snippet`)
        const { items } = result.data
        if (items.length > 0) {
          return {
            type:metadataType.video,
            video_url:`${EMBED_LINK}/${videoId}`
          }
        }
       
      }catch(e){
        throw e;
      }
    
  }
  }

  async create(data:CreatePostMetadataDto, transaction?:Transaction){
      try{
        const {type, video_url} = await this.getYoutubeTag( data.url )
        data.type = type
        data.video_url = video_url
      }catch(e){
        throw e;
      }

    return await this.postMetadataRepository.create(data, {transaction});
  }

  async update(posts_id: string, data:UpdatePostMetadataDto, transaction:Transaction){

    try {
      const { type, video_url } = await this.getYoutubeTag( data.url )
      data.type = type
      data.video_url = video_url
    } catch(e) {
      throw e;
    }
    
      await this.postMetadataRepository.update(data, {
          where:{
            posts_id: posts_id
          },
          transaction
        })
      return await this.findByPostsId(posts_id)
    
  }

  async delete(post_id:string, transaction:Transaction){
    return await this.postMetadataRepository.destroy({
      where:{
        posts_id:post_id
      },
      transaction
    })
    
  }

  async findByPostsId(posts_id: string): Promise<PostMetadata>
  async findByPostsId(posts_ids: string[]): Promise<PostMetadata[]>
  async findByPostsId(posts_id: string | string[]): Promise<PostMetadata | PostMetadata[]>
  {
    if (Array.isArray(posts_id)) {
      return await this.postMetadataRepository.findAll({
        where:{
          posts_id: {
            [Op.in]: posts_id
        }
        },
        raw: true
      })
    }else {
      return await this.postMetadataRepository.findOne({
          where: {
              posts_id
          },
        raw: true

      });
   }
  }

}