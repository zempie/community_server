import { ApiProperty } from "@nestjs/swagger";
import { Visibility } from "src/posts/enum/post-visibility.enum";
import { ChannelPostType } from "../enum/channelposttype.enum";

export class CreateChannelPostDto {
    @ApiProperty({
        description: "속한 커뮤니틴 id"
    })
    community_id: string;

    @ApiProperty({
        description: "속한 채널 id"
    })
    channel_id: string;

    @ApiProperty({
        description: "포스팅 id"
    })
    post_id: string;

    @ApiProperty({
        description: "포스팅 타입"
    })
    type: ChannelPostType;

    @ApiProperty({ enum: Visibility, enumName: "Visibility" })
    visibility: Visibility;
}
