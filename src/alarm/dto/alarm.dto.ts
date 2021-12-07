import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsOptional } from "class-validator";
import { BaseModel } from "src/abstract/base-model";
import { AlarmFormEnum } from "../alarm.enum";

// export class CreateAlarmDto {

// }
export class AlarmDTO extends BaseModel{
    isAllowLikes?: boolean

    likesForm?: AlarmFormEnum;

    isAllowComments?: boolean

    commentsForm?: AlarmFormEnum;

    isAllowCommentLikes?: boolean

    commentLikesForm?: AlarmFormEnum;

    //팔로우관련
    isAllowFollow?: boolean

    followForm?: AlarmFormEnum;

    //post에 멘션 알림
    isAllowMention?: boolean

    mentionForm?: AlarmFormEnum;

    //벤
    isAllowBen?: boolean

    benForm?: AlarmFormEnum;

    //리트윗
    isAllowRetweet?: boolean

    retweetForm?: AlarmFormEnum;

    //커뮤니티 매니저의 초대와 승낙 관련
    isAllowInviteAccept?: boolean

    inviteAcceptForm?: AlarmFormEnum;

    //DM 관련
    isAllowDM?: boolean

    DMForm?: AlarmFormEnum;
}

export class UpdateAlarmDto {
    @IsOptional()
    isAllowLikes?: boolean

    @IsOptional()
    @IsEnum(AlarmFormEnum)
    likesForm?: AlarmFormEnum;

    @IsOptional()
    isAllowComments?: boolean

    @IsOptional()
    @IsEnum(AlarmFormEnum)
    commentsForm?: AlarmFormEnum;

    @IsOptional()
    isAllowCommentLikes?: boolean

    @IsOptional()
    @IsEnum(AlarmFormEnum)
    commentLikesForm?: AlarmFormEnum;

    //팔로우관련
    @IsOptional()
    isAllowFollow?: boolean

    @IsOptional()
    @IsEnum(AlarmFormEnum)
    followForm?: AlarmFormEnum;

    //post에 멘션 알림
    @IsOptional()
    isAllowMention?: boolean

    @IsOptional()
    @IsEnum(AlarmFormEnum)
    mentionForm?: AlarmFormEnum;

    //벤
    @IsOptional()
    isAllowBen?: boolean

    @IsOptional()
    @IsEnum(AlarmFormEnum)
    benForm?: AlarmFormEnum;

    //리트윗
    @IsOptional()
    isAllowRetweet?: boolean

    @IsOptional()
    @IsEnum(AlarmFormEnum)
    retweetForm?: AlarmFormEnum;

    //커뮤니티 매니저의 초대와 승낙 관련
    @IsOptional()
    isAllowInviteAccept?: boolean

    @IsOptional()
    @IsEnum(AlarmFormEnum)
    inviteAcceptForm?: AlarmFormEnum;

    //DM 관련
    @IsOptional()
    isAllowDM?: boolean

    @IsOptional()
    @IsEnum(AlarmFormEnum)
    DMForm?: AlarmFormEnum;
}