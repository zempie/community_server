START TRANSACTION;

CREATE OR REPLACE
ALGORITHM = UNDEFINED VIEW `zempie`.`adminsview` AS
select
    `zempie`.`admins`.`id` AS `id`,
    `zempie`.`admins`.`uid` AS `uid`,
    `zempie`.`admins`.`activated` AS `activated`,
    `zempie`.`admins`.`account` AS `account`,
    `zempie`.`admins`.`name` AS `name`,
    `zempie`.`admins`.`level` AS `level`,
    `zempie`.`admins`.`sub_level` AS `sub_level`,
    `zempie`.`admins`.`password` AS `password`,
    `zempie`.`admins`.`created_at` AS `created_at`,
    `zempie`.`admins`.`updated_at` AS `updated_at`,
    `zempie`.`admins`.`deleted_at` AS `deleted_at`
from
    `zempie`.`admins`;

CREATE OR REPLACE
ALGORITHM = UNDEFINED VIEW `zempie`.`gameview` AS
select
    `zempie`.`games`.`id` AS `id`,
    `zempie`.`games`.`activated` AS `activated`,
    `zempie`.`games`.`enabled` AS `enabled`,
    `zempie`.`games`.`official` AS `official`,
    `zempie`.`games`.`category` AS `category`,
    `zempie`.`games`.`user_id` AS `user_id`,
    `zempie`.`games`.`pathname` AS `pathname`,
    `zempie`.`games`.`title` AS `title`,
    `zempie`.`games`.`description` AS `description`,
    `zempie`.`games`.`version` AS `version`,
    `zempie`.`games`.`control_type` AS `control_type`,
    `zempie`.`games`.`hashtags` AS `hashtags`,
    `zempie`.`games`.`count_start` AS `count_start`,
    `zempie`.`games`.`count_over` AS `count_over`,
    `zempie`.`games`.`count_heart` AS `count_heart`,
    `zempie`.`games`.`url_game` AS `url_game`,
    `zempie`.`games`.`url_thumb` AS `url_thumb`,
    `zempie`.`games`.`url_thumb_webp` AS `url_thumb_webp`,
    `zempie`.`games`.`url_thumb_gif` AS `url_thumb_gif`,
    `zempie`.`games`.`created_at` AS `created_at`,
    `zempie`.`games`.`updated_at` AS `updated_at`,
    `zempie`.`games`.`deleted_at` AS `deleted_at`
from
    `zempie`.`games`;

CREATE OR REPLACE
ALGORITHM = UNDEFINED VIEW `zempie`.`usersview` AS
select
    `zempie`.`users`.`id` AS `id`,
    `zempie`.`users`.`uid` AS `uid`,
    `zempie`.`users`.`activated` AS `activated`,
    `zempie`.`users`.`banned` AS `banned`,
    `zempie`.`users`.`name` AS `name`,
    `zempie`.`users`.`channel_id` AS `channel_id`,
    `zempie`.`users`.`picture` AS `picture`,
    `zempie`.`users`.`provider` AS `provider`,
    `zempie`.`users`.`email` AS `email`,
    `zempie`.`users`.`email_verified` AS `email_verified`,
    `zempie`.`users`.`fcm_token` AS `fcm_token`,
    `zempie`.`users`.`is_developer` AS `is_developer`,
    `zempie`.`users`.`last_log_in` AS `last_log_in`,
    `zempie`.`users`.`created_at` AS `created_at`,
    `zempie`.`users`.`updated_at` AS `updated_at`,
    `zempie`.`users`.`deleted_at` AS `deleted_at`
from
    `zempie`.`users`;

CREATE TABLE `fcm` (
`id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
`created_at` datetime DEFAULT NULL,
`updated_at` datetime DEFAULT NULL,
`deleted_at` datetime DEFAULT NULL,
`user_id` int NOT NULL,
`token` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
PRIMARY KEY (`id`)
);

CREATE TABLE `adminfcm` (
`id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
`created_at` datetime DEFAULT NULL,
`updated_at` datetime DEFAULT NULL,
`deleted_at` datetime DEFAULT NULL,
`user_id` int NOT NULL,
`token` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
PRIMARY KEY (`id`)
);

CREATE TABLE `alarm_community` (
`id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
`created_at` datetime DEFAULT NULL,
`updated_at` datetime DEFAULT NULL,
`deleted_at` datetime DEFAULT NULL,
`userId` int DEFAULT NULL,
`isAllowLikes` tinyint(1) DEFAULT '1',
`likesForm` enum('everyone','people_or_follow','COMMUNITY_GROUP_MEMBER') COLLATE utf8mb4_general_ci DEFAULT 'everyone',
`isAllowComments` tinyint(1) DEFAULT '1',
`commentsForm` enum('everyone','people_or_follow','COMMUNITY_GROUP_MEMBER') COLLATE utf8mb4_general_ci DEFAULT 'everyone',
`isAllowCommentLikes` tinyint(1) DEFAULT '1',
`commentLikesForm` enum('everyone','people_or_follow','COMMUNITY_GROUP_MEMBER') COLLATE utf8mb4_general_ci DEFAULT 'everyone',
`isAllowFollow` tinyint(1) DEFAULT '1',
`followForm` enum('everyone','people_or_follow','COMMUNITY_GROUP_MEMBER') COLLATE utf8mb4_general_ci DEFAULT 'everyone',
`isAllowMention` tinyint(1) DEFAULT '1',
`mentionForm` enum('everyone','people_or_follow','COMMUNITY_GROUP_MEMBER') COLLATE utf8mb4_general_ci DEFAULT 'everyone',
`isAllowBen` tinyint(1) DEFAULT '1',
`benForm` enum('everyone','people_or_follow','COMMUNITY_GROUP_MEMBER') COLLATE utf8mb4_general_ci DEFAULT 'everyone',
`isAllowRetweet` tinyint(1) DEFAULT '1',
`retweetForm` enum('everyone','people_or_follow','COMMUNITY_GROUP_MEMBER') COLLATE utf8mb4_general_ci DEFAULT 'everyone',
`isAllowInviteAccept` tinyint(1) DEFAULT '1',
`inviteAcceptForm` enum('everyone','people_or_follow','COMMUNITY_GROUP_MEMBER') COLLATE utf8mb4_general_ci DEFAULT 'everyone',
`isAllowDM` tinyint(1) DEFAULT '1',
`DMForm` enum('everyone','people_or_follow','COMMUNITY_GROUP_MEMBER') COLLATE utf8mb4_general_ci DEFAULT 'everyone',
PRIMARY KEY (`id`)
);

CREATE TABLE `alarms` (
`id` int DEFAULT NULL,
`user_uid` varchar(36) COLLATE utf8mb4_general_ci DEFAULT NULL,
`target_uid` varchar(36) COLLATE utf8mb4_general_ci DEFAULT NULL,
`type` smallint DEFAULT NULL,
`extra` varchar(200) COLLATE utf8mb4_general_ci DEFAULT NULL,
`created_at` datetime NOT NULL,
`updated_at` datetime NOT NULL,
`deleted_at` datetime DEFAULT NULL
);

CREATE TABLE `posts` (
`id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
`created_at` datetime DEFAULT NULL,
`updated_at` datetime DEFAULT NULL,
`deleted_at` datetime DEFAULT NULL,
`user_id` int DEFAULT NULL,
`post_type` enum('BLOG','SNS') COLLATE utf8mb4_general_ci DEFAULT NULL,
`funtion_type` enum('NONE','POLL') COLLATE utf8mb4_general_ci DEFAULT 'NONE',
`attatchment_files` json DEFAULT NULL,
`visibility` enum('FOLLOWER','PUBLIC','PRIVATE') COLLATE utf8mb4_general_ci DEFAULT 'PUBLIC',
`content` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
`hashtags` json DEFAULT NULL,
`user_tag` json DEFAULT NULL,
`like_cnt` int DEFAULT '0',
`comment_cnt` int DEFAULT '0',
`read_cnt` int DEFAULT '0',
`shared_cnt` int DEFAULT '0',
`scheduled_for` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
`status` enum('ACTIVE','DRAFT') COLLATE utf8mb4_general_ci DEFAULT 'ACTIVE',
`is_retweet` tinyint(1) DEFAULT '0',
`retweet_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
PRIMARY KEY (`id`)
);

CREATE TABLE `posted_at` (
`id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
`created_at` datetime DEFAULT NULL,
`updated_at` datetime DEFAULT NULL,
`deleted_at` datetime DEFAULT NULL,
`posts_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
`channel_id` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
`game_id` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
`community` json DEFAULT NULL,
`portfolio_ids` json DEFAULT NULL,
PRIMARY KEY (`id`),
KEY `posts_id` (`posts_id`),
CONSTRAINT `posted_at_ibfk_1` FOREIGN KEY (`posts_id`) REFERENCES `posts` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE `file` (
`id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
`created_at` datetime DEFAULT NULL,
`updated_at` datetime DEFAULT NULL,
`deleted_at` datetime DEFAULT NULL,
`filename` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
`mimetype` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
`md5` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
`url` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
`priority` int DEFAULT NULL,
PRIMARY KEY (`id`)
);

CREATE TABLE `poll` (
`id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
`created_at` datetime DEFAULT NULL,
`updated_at` datetime DEFAULT NULL,
`deleted_at` datetime DEFAULT NULL,
`posts_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
`duration` bigint DEFAULT NULL,
`end_time` bigint DEFAULT NULL,
PRIMARY KEY (`id`),
KEY `posts_id` (`posts_id`),
CONSTRAINT `poll_ibfk_1` FOREIGN KEY (`posts_id`) REFERENCES `posts` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE `choice` (
`id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
`created_at` datetime DEFAULT NULL,
`updated_at` datetime DEFAULT NULL,
`deleted_at` datetime DEFAULT NULL,
`poll_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
`title` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
`voted_cnt` int DEFAULT '0',
PRIMARY KEY (`id`),
KEY `poll_id` (`poll_id`),
CONSTRAINT `choice_ibfk_1` FOREIGN KEY (`poll_id`) REFERENCES `poll` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE `portfolio` (
`id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
`created_at` datetime DEFAULT NULL,
`updated_at` datetime DEFAULT NULL,
`deleted_at` datetime DEFAULT NULL,
`title` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
`description` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
`thumbnail_img` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
`is_public` tinyint(1) DEFAULT '1',
`user_id` int DEFAULT NULL,
`is_pinned` tinyint(1) DEFAULT '0',
PRIMARY KEY (`id`)
);

CREATE TABLE `comment` (
`id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
`created_at` datetime DEFAULT NULL,
`updated_at` datetime DEFAULT NULL,
`deleted_at` datetime DEFAULT NULL,
`user_id` int NOT NULL,
`user_uid` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
`parent_id` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
`post_id` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
`type` enum('COMMENT','REPLY') COLLATE utf8mb4_general_ci DEFAULT NULL,
`content` varchar(500) COLLATE utf8mb4_general_ci DEFAULT NULL,
`is_private` tinyint(1) DEFAULT '0',
`is_pinned` tinyint(1) DEFAULT '0',
`attatchment_files` json DEFAULT NULL,
`like_cnt` int DEFAULT '0',
`dislike_cnt` int DEFAULT '0',
PRIMARY KEY (`id`)
);


CREATE TABLE `community` (
`id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
`created_at` datetime DEFAULT NULL,
`updated_at` datetime DEFAULT NULL,
`deleted_at` datetime DEFAULT NULL,
`owner_id` int NOT NULL,
`manager_id` int DEFAULT NULL,
`submanager_id` int DEFAULT NULL,
`name` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
`url` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
`description` varchar(2000) COLLATE utf8mb4_general_ci NOT NULL,
`profile_img` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
`banner_img` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
`member_cnt` int DEFAULT '0',
`posts_cnt` int DEFAULT '0',
`visit_cnt` int DEFAULT '0',
`state` enum('PRIVATE','PUBLIC') COLLATE utf8mb4_general_ci DEFAULT 'PUBLIC',
`is_certificated` tinyint(1) DEFAULT '1',
PRIMARY KEY (`id`),
UNIQUE KEY `url` (`url`)
);

CREATE TABLE `community_block` (
`id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
`created_at` datetime DEFAULT NULL,
`updated_at` datetime DEFAULT NULL,
`deleted_at` datetime DEFAULT NULL,
`communityId` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
`userId` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
`active` tinyint(1) DEFAULT '1',
PRIMARY KEY (`id`)
);

CREATE TABLE `community_channel` (
`id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
`created_at` datetime DEFAULT NULL,
`updated_at` datetime DEFAULT NULL,
`deleted_at` datetime DEFAULT NULL,
`user_id` int DEFAULT NULL,
`community_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
`title` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
`description` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
`profile_img` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
`state` enum('PRIVATE','PUBLIC') COLLATE utf8mb4_general_ci DEFAULT 'PUBLIC',
PRIMARY KEY (`id`),
KEY `community_id` (`community_id`),
CONSTRAINT `community_channel_ibfk_1` FOREIGN KEY (`community_id`) REFERENCES `community` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE `community_join` (
`id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
`created_at` datetime DEFAULT NULL,
`updated_at` datetime DEFAULT NULL,
`deleted_at` datetime DEFAULT NULL,
`community_id` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
`user_id` int NOT NULL,
`status` enum('MANAGER','SUBMANAGER','MEMBER','OWNER') COLLATE utf8mb4_general_ci NOT NULL,
`state` enum('ACTIVE','BLOCK','KICK') COLLATE utf8mb4_general_ci DEFAULT 'ACTIVE',
PRIMARY KEY (`id`)
);



CREATE TABLE `channel_post` (
`id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
`created_at` datetime DEFAULT NULL,
`updated_at` datetime DEFAULT NULL,
`deleted_at` datetime DEFAULT NULL,
`community_id` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
`channel_id` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
`post_id` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
`type` enum('USER','COMMUNITY') COLLATE utf8mb4_general_ci DEFAULT NULL,
`visibility` enum('FOLLOWER','PUBLIC','PRIVATE') COLLATE utf8mb4_general_ci DEFAULT NULL,
`is_pinned` tinyint(1) DEFAULT '0',
PRIMARY KEY (`id`)
);

CREATE TABLE `portfolio_post` (
`id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
`created_at` datetime DEFAULT NULL,
`updated_at` datetime DEFAULT NULL,
`deleted_at` datetime DEFAULT NULL,
`channel_id` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
`portfolio_id` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
`post_id` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
`is_pinned` tinyint(1) DEFAULT '0',
PRIMARY KEY (`id`)
);

CREATE TABLE `game_post` (
`id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
`created_at` datetime DEFAULT NULL,
`updated_at` datetime DEFAULT NULL,
`deleted_at` datetime DEFAULT NULL,
`game_id` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
`post_id` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
`is_pinned` tinyint(1) DEFAULT '0',
PRIMARY KEY (`id`)
);



CREATE TABLE `follow` (
`id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
`created_At` datetime DEFAULT NULL,
`updated_At` datetime DEFAULT NULL,
`deleted_at` datetime DEFAULT NULL,
`user_id` int NOT NULL,
`follow_id` int NOT NULL,
PRIMARY KEY (`id`)
);

CREATE TABLE `like` (
`id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
`created_at` datetime DEFAULT NULL,
`updated_at` datetime DEFAULT NULL,
`deleted_at` datetime DEFAULT NULL,
`post_id` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
`comment_id` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
`user_id` int DEFAULT NULL,
`type` enum('POST','COMMENT') COLLATE utf8mb4_general_ci DEFAULT NULL,
`state` tinyint(1) DEFAULT '1',
PRIMARY KEY (`id`)
);

CREATE TABLE `block` (
`id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
`created_at` datetime DEFAULT NULL,
`updated_at` datetime DEFAULT NULL,
`deleted_at` datetime DEFAULT NULL,
`community_id` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
`user_id` int DEFAULT NULL,
`target_id` int DEFAULT NULL,
`blocked_at` bigint DEFAULT NULL,
`expires_on` bigint DEFAULT NULL,
`reason` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
`type` enum('USERBLOCK','COMMUNITYBLOCK','MUTE','KICK') COLLATE utf8mb4_general_ci DEFAULT NULL,
PRIMARY KEY (`id`) 
);

CREATE TABLE `report` (
`id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
`created_at` datetime DEFAULT NULL,
`updated_at` datetime DEFAULT NULL,
`deleted_at` datetime DEFAULT NULL,
`reporter_user_id` int DEFAULT NULL,
`user_id` int DEFAULT NULL,
`post_id` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
`comment_id` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
`targetType` enum('COMMENT','POST','USER') COLLATE utf8mb4_general_ci DEFAULT NULL,
`report_reason` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
`isDone` tinyint(1) DEFAULT '0',
PRIMARY KEY (`id`)
);

CREATE TABLE `search_keyword_log` (
`id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
`created_at` datetime DEFAULT NULL,
`updated_at` datetime DEFAULT NULL,
`deleted_at` datetime DEFAULT NULL,
`user_id` int DEFAULT NULL,
`keyword` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
PRIMARY KEY (`id`)
);

CREATE TABLE `posts_view_log` (
`id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
`created_at` datetime DEFAULT NULL,
`updated_at` datetime DEFAULT NULL,
`deleted_at` datetime DEFAULT NULL,
`user_id` int NOT NULL,
`post_id` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
PRIMARY KEY (`id`)
);

CREATE TABLE `share_log` (
`id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
`created_at` datetime DEFAULT NULL,
`updated_at` datetime DEFAULT NULL,
`deleted_at` datetime DEFAULT NULL,
`user_id` int NOT NULL,
`type` enum('POST','COMMENT') COLLATE utf8mb4_general_ci DEFAULT NULL,
`object_id` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
PRIMARY KEY (`id`)
);

CREATE TABLE `community_visit_log` (
`id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
`created_at` datetime DEFAULT NULL,
`updated_at` datetime DEFAULT NULL,
`deleted_at` datetime DEFAULT NULL,
`user_id` int NOT NULL,
`community_id` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
PRIMARY KEY (`id`)
);

CREATE TABLE `choicelog` (
`id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
`created_at` datetime DEFAULT NULL,
`updated_at` datetime DEFAULT NULL,
`deleted_at` datetime DEFAULT NULL,
`user_id` int DEFAULT NULL,
`choice_id` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
PRIMARY KEY (`id`)
);

CREATE TABLE `hashtaglog` (
`id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
`created_at` datetime DEFAULT NULL,
`updated_at` datetime DEFAULT NULL,
`deleted_at` datetime DEFAULT NULL,
`user_id` int DEFAULT NULL,
`text` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
PRIMARY KEY (`id`)
);

CREATE TABLE `like_log` (
`id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
`created_at` datetime DEFAULT NULL,
`updated_at` datetime DEFAULT NULL,
`deleted_at` datetime DEFAULT NULL,
`user_id` int NOT NULL,
`type` enum('POST','COMMENT') COLLATE utf8mb4_general_ci DEFAULT NULL,
`object_id` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
PRIMARY KEY (`id`)
);


CREATE OR REPLACE
ALGORITHM = UNDEFINED VIEW `zempie`.`community_timeline` AS
select
    `cp`.`id` AS `id`,
    `cp`.`created_at` AS `created_at`,
    `cp`.`updated_at` AS `updated_at`,
    `cp`.`deleted_at` AS `deleted_at`,
    `cp`.`community_id` AS `community_id`,
    `cp`.`channel_id` AS `channel_id`,
    `cp`.`post_id` AS `post_id`,
    `cp`.`type` AS `type`,
    `p`.`post_type` AS `post_type`,
    `p`.`user_id` AS `user_id`,
    `p`.`funtion_type` AS `funtion_type`,
    `p`.`attatchment_files` AS `attatchment_files`,
    `p`.`visibility` AS `visibility`,
    `p`.`hashtags` AS `hashtags`,
    `p`.`like_cnt` AS `like_cnt`,
    `p`.`status` AS `status`,
    `cp`.`is_pinned` as `is_pinned`,
    `p`.`is_retweet` as `is_retweet`
from
    (`zempie`.`channel_post` `cp`
left join `zempie`.`posts` `p` on
    ((`cp`.`post_id` = `p`.`id`)))
where  `p`.`scheduled_for` is null or `p`.`scheduled_for` <= UNIX_TIMESTAMP();

CREATE OR REPLACE
ALGORITHM = UNDEFINED VIEW `zempie`.`portfolio_timeline` AS
select
    `cp`.`id` AS `id`,
    `cp`.`created_at` AS `created_at`,
    `cp`.`updated_at` AS `updated_at`,
    `cp`.`deleted_at` AS `deleted_at`,
    `cp`.`channel_id` AS `channel_id`,
    `cp`.`portfolio_id` AS `portfolio_id`,
    `cp`.`post_id` AS `post_id`,
    `p`.`post_type` AS `post_type`,
    `p`.`funtion_type` AS `funtion_type`,
    `p`.`attatchment_files` AS `attatchment_files`,
    `p`.`visibility` AS `visibility`,
    `p`.`hashtags` AS `hashtags`,
    `p`.`like_cnt` AS `like_cnt`,
    `p`.`status` AS `status`,
    `cp`.`is_pinned` AS `is_pinned`
from
    (`zempie`.`portfolio_post` `cp`
left join `zempie`.`posts` `p` on
    ((`cp`.`post_id` = `p`.`id`)))
where
    ((`p`.`scheduled_for` is null)
        or (`p`.`scheduled_for` <= unix_timestamp()));

COMMIT;