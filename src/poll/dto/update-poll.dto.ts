import { CreatePostsDto } from "src/posts/dto/create-posts.dto";
import { CreateChoiceDto } from "../choice/dto/create-choice.dto";
import { CreatePoll, CreatePollDto } from "./create-poll.dto";

export class UpdatePollDto extends CreatePollDto { }

export class UpdatePostsPollDto {
    postsData?: Partial<CreatePostsDto>;
    pollData?: Partial<CreatePoll>;
    addChoice?: CreateChoiceDto[];
    delChoice?: string[]
}