import { Controller, Get, Query } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { CurrentUser } from "src/auth/user-auth-decorator";
import { UserTokenCheckGuard } from "src/auth/user-auth.guard";
import { Community } from "src/community/community.entity";
import { CommunityService } from "src/community/community.service";
import { Game } from "src/game/game.entity";
import { GameService } from "src/game/game.service";
import { LikeService } from "src/like/like.service";
import { PostsDto } from "src/posts/dto/posts.dto";
import { Posts } from "src/posts/posts.entity";
import { PostsService } from "src/posts/posts.service";
import { UserDto } from "src/user/dto/user.dto";
import { User } from "src/user/user.entity";
import { UserService } from "src/user/user.service";
import { ZempieUseGuards } from "src/util/decorators/ZempieUseGaurd";
import { CustomQueryResult } from "src/util/pagination-builder";
import { SearchAllDto } from "./dto/search-all-dto";
import { SearchHashtagDto } from "./dto/search-hashtag.dto";
import { SearchHeaderQuery, SearchQueryDto } from "./dto/search-query.dto";
import { SearchKeywordLogService } from "./search_keyword_log/search_keyword_log.service";

@Controller("api/v1/search")
@ApiTags("api/v1/search")
export class SearchController {
    constructor(
        private communityService: CommunityService,
        private postService: PostsService,
        private gameService: GameService,
        private userService: UserService,
        private searchKeywordLogService: SearchKeywordLogService,
        private likeService: LikeService,
    ) { }

    @Get()
    @ApiOperation({ description: "검색" })
    @ZempieUseGuards(UserTokenCheckGuard)
    async searchCommunity(
        @CurrentUser() user: User,
        @Query() query: SearchQueryDto
    ): Promise<CustomQueryResult<Community | PostsDto | Game | UserDto> | SearchHashtagDto[] | SearchAllDto> {
        if (query.community !== undefined) {
            await this.searchKeywordLogService.create(user ? user.id : null, decodeURI(query.community));
            return await this.communityService.findAll({
                community: decodeURI(query.community),
                gametitle: decodeURI(query.gametitle),
                hashtag: decodeURI(query.hashtag),
                limit: query.limit,
                offset: query.offset,
                posting: decodeURI(query.posting),
                show: query.show,
                sort: query.sort
            });
        } else if (query.posting !== undefined) {
            await this.searchKeywordLogService.create(user ? user.id : null, decodeURI(query.posting));
            const list = await this.postService.findAll({
                community: decodeURI(query.community),
                gametitle: decodeURI(query.gametitle),
                hashtag: decodeURI(query.hashtag),
                limit: query.limit,
                offset: query.offset,
                posting: decodeURI(query.posting),
                show: query.show,
                sort: query.sort
            });
            const users = await this.userService.findByIds(list.result.map(item => item.user_id));
            const likeInfos = user !== null ? await this.likeService.likePostByUserId(list.result.map(item=>item.id), user.id) : [];
            return {
                ...list,
                result: list.result.map((item: any) => {
                    const postUser = users.find(user => user.id === item.user_id);
                    const like = likeInfos.find(lItem=>lItem.post_id === item.id);
                    return new PostsDto({
                        ...item, user: new UserDto({ ...postUser }),
                        liked: like != null ? true : false,
                        is_pinned: null
                    })
                })
            }
        } else if (query.hashtag !== undefined) {
            await this.searchKeywordLogService.create(user ? user.id : null, decodeURI(query.hashtag));
            const result: SearchHashtagDto[] = [];
            const gameInfo = await this.gameService.findAllActivated({
                community: decodeURI(query.community),
                gametitle: decodeURI(query.gametitle),
                hashtag: decodeURI(query.hashtag),
                limit: query.limit,
                offset: query.offset,
                posting: decodeURI(query.posting),
                show: query.show,
                sort: query.sort
            });
            const postsInfo = await this.postService.findAll({
                community: decodeURI(query.community),
                gametitle: decodeURI(query.gametitle),
                hashtag: decodeURI(query.hashtag),
                limit: query.limit,
                offset: query.offset,
                posting: decodeURI(query.posting),
                show: query.show,
                sort: query.sort
            });
            const users = await this.userService.findByIds(postsInfo.result.map(item => item.user_id));
            const likeInfos = user !== null ? await this.likeService.likePostByUserId(postsInfo.result.map(item => item.id), user.id) : [];
            const list = postsInfo.result.map((item: any) => {
                const postUser = users.find(user => user.id === item.user_id);
                const like = likeInfos.find(lItem => lItem.post_id === item.id);
                return new PostsDto({
                    ...item, user: new UserDto({ ...postUser }),
                    liked: like != null ? true : false,
                    is_pinned: null
                })
            })
            result.push({ game: gameInfo.result, posts: list });
            return result;
        } else if (query.gametitle !== undefined) {
            await this.searchKeywordLogService.create(user ? user.id : null, decodeURI(query.gametitle));
            return await this.gameService.findAllActivated(query);
        } else if (query.username !== undefined) {
            await this.searchKeywordLogService.create(user ? user.id : null, decodeURI(query.username));
            const users = await this.userService.search({
                username: decodeURI(query.username),
                limit: query.limit,
                offset: query.offset
            });
            return {
                ...users,
                result: users.result.map(item => new UserDto({ ...item }))
            };
        } else {
            await this.searchKeywordLogService.create(user ? user.id : null, decodeURI(query.q));
            const posts = await this.postService.findAll({
                community: decodeURI(query.q),
                gametitle: decodeURI(query.q),
                hashtag: decodeURI(query.q),
                limit: 10,
                offset: 0,
                posting: decodeURI(query.q),
                show: query.show,
                sort: query.sort
            });
            const postUsers = await this.userService.findByIds(posts.result.map(item => item.user_id));
            const likeInfos = user !== null ? await this.likeService.likePostByUserId(posts.result.map(item => item.id), user.id) : [];
            const list = posts.result.map((item: any) => {
                const postUser = postUsers.find(user => user.id === item.user_id);
                const like = likeInfos.find(lItem => lItem.post_id === item.id);
                return new PostsDto({
                    ...item, user: new UserDto({ ...postUser }),
                    liked: like != null ? true : false,
                    is_pinned: null
                })
            })
            const gameInfo = await this.gameService.findAllActivated({
                community: decodeURI(query.q),
                gametitle: decodeURI(query.q),
                hashtag: decodeURI(query.q),
                limit: 10,
                offset: 0,
                posting: decodeURI(query.q),
                show: query.show,
                sort: query.sort
            });
            const communitys = await this.communityService.findAll({
                community: decodeURI(query.q),
                gametitle: decodeURI(query.q),
                hashtag: decodeURI(query.q),
                limit: 5,
                offset: 0,
                posting: decodeURI(query.q),
                show: query.show,
                sort: query.sort
            });
            const users = await this.userService.search({ username: decodeURI(query.q), limit: 3, offset: 0 });
            return new SearchAllDto({
                posts: list,
                games: gameInfo.result,
                community: communitys.result,
                users: users.result.map(item => new UserDto({ ...item }))
            });
        }
    }

    @Get("/header")
    @ApiOperation({ description: "종합 검색" })
    @ZempieUseGuards(UserTokenCheckGuard)
    async headerSearch(
        @CurrentUser() user: User,
        @Query() query: SearchHeaderQuery
    ): Promise<{ users?: UserDto[]; games?: Game[]; community?: Community[] }> {
        if (query.q === undefined) {
            query.q = "";
        }
        if (query.q.startsWith("@")) {
            const onlyString = query.q.replace("@", "");
            await this.searchKeywordLogService.create(user ? user.id : null, onlyString);
            const users = await this.userService.search({ username: onlyString, limit: 3, offset: 0 });
            return {
                users: users.result.map(item => new UserDto({ ...item }))
            };
        } else if (query.q.startsWith("#")) {
            const onlyString = query.q.replace("#", "");
            await this.searchKeywordLogService.create(user ? user.id : null, onlyString);
            const gameInfo = await this.gameService.findAllActivated({ gametitle: onlyString, limit: 5, offset: 0 });
            return {
                games: gameInfo.result.map(item => item)
            };
        } else {
            await this.searchKeywordLogService.create(user ? user.id : null, query.q);
            const users = await this.userService.search({ username: query.q, limit: 3, offset: 0 });
            const gameInfo = await this.gameService.findAllActivated({ gametitle: query.q, limit: 5, offset: 0 });
            const communitys = await this.communityService.findAll({
                community: query.q,
                gametitle: query.q,
                hashtag: query.q,
                limit: 5,
                offset: 0
            });

            return {
                users: users.result.map(item => new UserDto({ ...item })),
                games: gameInfo.result.map(item => item),
                community: communitys.result.map(item => item)
            };
        }
    }
}
