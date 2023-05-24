START TRANSACTION;

USE `zempie_local`; /** live는 zempie */

DROP TABLE IF EXISTS `fcm`;
DROP TABLE IF EXISTS `posts`;
DROP TABLE IF EXISTS `follow`;
DROP TABLE IF EXISTS `alarms`;

CREATE OR REPLACE
ALGORITHM = UNDEFINED VIEW `adminsview` AS
select
    `admins`.`id` AS `id`,
    `admins`.`uid` AS `uid`,
    `admins`.`activated` AS `activated`,
    `admins`.`account` AS `account`,
    `admins`.`name` AS `name`,
    `admins`.`level` AS `level`,
    `admins`.`sub_level` AS `sub_level`,
    `admins`.`password` AS `password`,
    `admins`.`created_at` AS `created_at`,
    `admins`.`updated_at` AS `updated_at`,
    `admins`.`deleted_at` AS `deleted_at`
from
    `admins`;

CREATE OR REPLACE
ALGORITHM = UNDEFINED VIEW `gameview` AS
select
    `games`.`id` AS `id`,
    `games`.`activated` AS `activated`,
    `games`.`enabled` AS `enabled`,
    `games`.`official` AS `official`,
    `games`.`category` AS `category`,
    `games`.`user_id` AS `user_id`,
    `games`.`pathname` AS `pathname`,
    `games`.`title` AS `title`,
    `games`.`description` AS `description`,
    `games`.`version` AS `version`,
    `games`.`control_type` AS `control_type`,
    `games`.`hashtags` AS `hashtags`,
    `games`.`count_start` AS `count_start`,
    `games`.`count_over` AS `count_over`,
    `games`.`count_heart` AS `count_heart`,
    `games`.`url_game` AS `url_game`,
    `games`.`url_thumb` AS `url_thumb`,
    `games`.`url_thumb_webp` AS `url_thumb_webp`,
    `games`.`url_thumb_gif` AS `url_thumb_gif`,
    `games`.`game_type` AS `game_type`,
    `games`.`stage` AS `stage`,
    `games`.`created_at` AS `created_at`,
    `games`.`updated_at` AS `updated_at`,
    `games`.`deleted_at` AS `deleted_at`
from
    `games`;

CREATE OR REPLACE
ALGORITHM = UNDEFINED VIEW `usersview` AS
select
    `users`.`id` AS `id`,
    `users`.`uid` AS `uid`,
    `users`.`activated` AS `activated`,
    `users`.`banned` AS `banned`,
    `users`.`name` AS `name`,
    `users`.`nickname` AS `nickname`,
    `users`.`channel_id` AS `channel_id`,
    `users`.`picture` AS `picture`,
    `users`.`provider` AS `provider`,
    `users`.`email` AS `email`,
    `users`.`url_banner` AS `banner_img`,
    `users`.`email_verified` AS `email_verified`,
    `users`.`fcm_token` AS `fcm_token`,
    `users`.`is_developer` AS `is_developer`,
    `users`.`last_log_in` AS `last_log_in`,
    `users`.`created_at` AS `created_at`,
    `users`.`updated_at` AS `updated_at`,
    `users`.`deleted_at` AS `deleted_at`
from
    `users`;

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
`game` json DEFAULT NULL,
`portfolio_ids` json DEFAULT NULL,
PRIMARY KEY (`id`),
KEY `posts_id` (`posts_id`),
CONSTRAINT `posted_at_ibfk_1` FOREIGN KEY (`posts_id`) REFERENCES `posts` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
);


CREATE TABLE `post_metadata` (
`id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
`created_at` datetime DEFAULT NULL,
`updated_at` datetime DEFAULT NULL,
`deleted_at` datetime DEFAULT NULL,
`posts_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
`type` int NOT NULL,
`url` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
`site_name` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
`title` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
`description` varchar(5000) COLLATE utf8mb4_general_ci DEFAULT NULL,
`img` varchar(500) COLLATE utf8mb4_general_ci DEFAULT NULL,
`favicon` varchar(500) COLLATE utf8mb4_general_ci DEFAULT NULL,
`video_url` varchar(500) COLLATE utf8mb4_general_ci DEFAULT NULL,
PRIMARY KEY (`id`),
KEY `posts_id` (`posts_id`),
CONSTRAINT `post_metadata_ibfk_1` FOREIGN KEY (`posts_id`) REFERENCES `posts` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
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
ALGORITHM = UNDEFINED VIEW `community_timeline` AS
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
    (`channel_post` `cp`
left join `posts` `p` on
    ((`cp`.`post_id` = `p`.`id`)))
where  `p`.`scheduled_for` is null or `p`.`scheduled_for` <= UNIX_TIMESTAMP();

CREATE OR REPLACE
ALGORITHM = UNDEFINED VIEW `portfolio_timeline` AS
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
    (`portfolio_post` `cp`
left join `posts` `p` on
    ((`cp`.`post_id` = `p`.`id`)))
where
    ((`p`.`scheduled_for` is null)
        or (`p`.`scheduled_for` <= unix_timestamp()));

COMMIT;