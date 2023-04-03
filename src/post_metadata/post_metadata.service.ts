import { HttpException, HttpStatus, Inject, Injectable } from "@nestjs/common";
import axios from "axios";
import { Op } from "sequelize";
import { Transaction } from "sequelize/types";
import { CreatePostMetadataDto } from "./dto/create-post_metadata.dto";
import { metadataType } from "./enum/post_metadata.enum";
import { PostMetadata } from "./post_metadata.entity";

@Injectable()
export class PostMetadataService {
  constructor(
    @Inject("PostMetadataRepository")
    private readonly postMetadataRepository: typeof PostMetadata
) { }

  async create(data:CreatePostMetadataDto, transaction?:Transaction){
    const videoId = data.url.split('v=')[1];
    const ytApi = process.env.YOUTUBE_VIDEO_API
    const API_KEY = process.env.FIREBASE_API_KEY
    const EMBED_LINK = process.env.YOUTUBE_EMBED_LINK
    const isYtUrl= new URL(data.url).hostname.includes('youtube.com')

    if (isYtUrl && videoId) {
      try{
        const result = await axios.get(`${ytApi}?id=${videoId}&key=${API_KEY}&part=snippet`)
        const { items } = result.data

        if (items.length > 0) {
          data.type = metadataType.video
          data.video_url = `${EMBED_LINK}/${videoId}`
        }
      }catch(e){
        throw e;
      }
    
  }

    return await this.postMetadataRepository.create(data, {transaction});
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