import { BelongsTo, Column, CreatedAt, DataType, DeletedAt, ForeignKey, Model, Table, UpdatedAt } from "sequelize-typescript";
import { BaseEntity } from "src/abstract/base-entity";
import { User } from "src/user/user.entity";
import { AlarmFormEnum } from "./alarm.enum";

@Table({ tableName: "alarm_community", paranoid: true })
export class Alarm extends BaseEntity {

    // @ForeignKey(() => User)
    @Column
    userId: number

    // @BelongsTo(() => User)
    // user: User

    //post좋아요.
    @Column({
        type: DataType.BOOLEAN,
        defaultValue: true
    })
    isAllowLikes: boolean

    @Column({
        type: DataType.ENUM({ values: Object.values(AlarmFormEnum) }),
        defaultValue: AlarmFormEnum.EVERYONE
    })
    likesForm: AlarmFormEnum;

    //댓글알림
    @Column({
        type: DataType.BOOLEAN,
        defaultValue: true
    })
    isAllowComments: boolean

    @Column({
        type: DataType.ENUM({ values: Object.values(AlarmFormEnum) }),
        defaultValue: AlarmFormEnum.EVERYONE
    })
    commentsForm: AlarmFormEnum;

    //댓글 좋아요.
    @Column({
        type: DataType.BOOLEAN,
        defaultValue: true
    })
    isAllowCommentLikes: boolean

    @Column({
        type: DataType.ENUM({ values: Object.values(AlarmFormEnum) }),
        defaultValue: AlarmFormEnum.EVERYONE
    })
    commentLikesForm: AlarmFormEnum;

    //팔로우관련
    @Column({
        type: DataType.BOOLEAN,
        defaultValue: true
    })
    isAllowFollow: boolean

    @Column({
        type: DataType.ENUM({ values: Object.values(AlarmFormEnum) }),
        defaultValue: AlarmFormEnum.EVERYONE
    })
    followForm: AlarmFormEnum;

    //post에 멘션 알림
    @Column({
        type: DataType.BOOLEAN,
        defaultValue: true
    })
    isAllowMention: boolean

    @Column({
        type: DataType.ENUM({ values: Object.values(AlarmFormEnum) }),
        defaultValue: AlarmFormEnum.EVERYONE
    })
    mentionForm: AlarmFormEnum;

    //벤
    @Column({
        type: DataType.BOOLEAN,
        defaultValue: true
    })
    isAllowBen: boolean

    @Column({
        type: DataType.ENUM({ values: Object.values(AlarmFormEnum) }),
        defaultValue: AlarmFormEnum.EVERYONE
    })
    benForm: AlarmFormEnum;

    //리트윗
    @Column({
        type: DataType.BOOLEAN,
        defaultValue: true
    })
    isAllowRetweet: boolean

    @Column({
        type: DataType.ENUM({ values: Object.values(AlarmFormEnum) }),
        defaultValue: AlarmFormEnum.EVERYONE
    })
    retweetForm: AlarmFormEnum;

    //커뮤니티 매니저의 초대와 승낙 관련
    @Column({
        type: DataType.BOOLEAN,
        defaultValue: true
    })
    isAllowInviteAccept: boolean

    @Column({
        type: DataType.ENUM({ values: Object.values(AlarmFormEnum) }),
        defaultValue: AlarmFormEnum.EVERYONE
    })
    inviteAcceptForm: AlarmFormEnum;

    //DM 관련
    @Column({
        type: DataType.BOOLEAN,
        defaultValue: true
    })
    isAllowDM: boolean

    @Column({
        type: DataType.ENUM({ values: Object.values(AlarmFormEnum) }),
        defaultValue: AlarmFormEnum.EVERYONE
    })
    DMForm: AlarmFormEnum;
}
