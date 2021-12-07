import * as request from "supertest";
import { BASE_URL, USER_ID, USER_UID } from "./utils";

describe("커뮤니티 E2E 테스트", () => {
    let token: string = global.token;
    let user_id = USER_ID;
    let new_community_id: string;
    let new_channel_id: string;
    let new_portfolio_id: string;
    let new_post_id: string;
    let game_id = USER_ID;

    test("/api/v1/community / 로그인 O )", async () => {
        const res = await request(BASE_URL)
            .post("/api/v1/community")
            .set("Authorization", `Bearer ${global.token}`)
            .send({
                community_name: "A 커뮤니티",
                community_url: "A 커뮤니티 주소",
                community_desc: "A 커뮤니티 설명",
                community_profile_img: "wwww.asdf.com",
                community_banner_img: "www.dasf.com"
            })
            .expect(201);
        new_community_id = res.body.dataValues.id;
        return res;
    });

    test("/api/v1/community/:community_id  / 로그인 O)", async () => {
        const res = await request(BASE_URL)
            .get("/api/v1/community/" + new_community_id)
            .set("Authorization", `Bearer ${global.token}`)
            .expect(200);
        return res;
    });

    test("/api/v1/community/:community_id/channel  / 로그인 O )", async () => {
        const res = await request(BASE_URL)
            .post("/api/v1/community/" + new_community_id + "/channel")
            .set("Authorization", `Bearer ${token}`)
            .send({
                title: "A 채널",
                description: "A 채널 설명",
                profile_img: "wwww.asdf.com",
                state: "PUBLIC"
            })
            .expect(201);
        new_channel_id = res.body.dataValues.id;
        return res;
    });

    test("/api/v1/community/:community_id/channel/:channel_id / 로그인 O )", async () => {
        const res = await request(BASE_URL)
            .post("/api/v1/community/" + new_community_id + "/channel/" + new_channel_id)
            .set("Authorization", `Bearer ${token}`)
            .send({
                title: "A 채널 수정",
                description: "A 채널 설명 수정"
            })
            .expect(201);

        return res;
    });

    test("/api/v1/user/:user_id/portfolio / 로그인 O)", async () => {
        const res = await request(BASE_URL)
            .post("/api/v1/user/" + user_id + "/portfolio")
            .set("Authorization", `Bearer ${global.token}`)
            .send({
                title: "포트폴리오 제목 2",
                desciption: "포트폴리오 설명 입니다.",
                thumbnail_img: "image234.jpg"
            })
            .expect(201);
        new_portfolio_id = res.body.id;
        return res;
    });

    test("/api/v1/post / 로그인 O)", async () => {
        const res = await request(BASE_URL)
            .post("/api/v1/post")
            .set("Authorization", `Bearer ${token}`)
            .send({
                user_uid: USER_UID,
                post_state: "SNS",
                post_contents: "포스팅 내용입니다.",
                visibility: "PUBLIC",
                community: [
                    {
                        id: new_community_id
                    }
                ]
            })
            .expect(201);
        new_post_id = res.body.id;
        return res;
    });

    test("/api/v1/channel/:channel_id/portfolio/:portfolio_id )", async () => {
        const res = await request(BASE_URL)
            .get("/api/v1/channel/" + new_channel_id + "/portfolio/" + new_portfolio_id)
            .set("Authorization", `Bearer ${global.token}`)
            .expect(200);
        return res;
    });

    test("/api/v1/community/:community_id/members/block   / 로그인 O )", async () => {
        const res = await request(BASE_URL)
            .get("/api/v1/community/" + new_community_id + "/members/block")
            .set("Authorization", `Bearer ${token}`)
            .expect(200);

        return res;
    });

    test("/api/v1/community/:community_id/member/:user_id/kick   / 로그인 O )", async () => {
        const res = await request(BASE_URL)
            .post("/api/v1/community/" + new_community_id + "/member/" + USER_ID + "/kick")
            .set("Authorization", `Bearer ${token}`)
            .expect(201);

        return res;
    });

    test("/api/v1/community/:community_id/members/kick   / 로그인 O )", async () => {
        const res = await request(BASE_URL)
            .get("/api/v1/community/" + new_community_id + "/members/kick")
            .set("Authorization", `Bearer ${token}`)
            .expect(200);
        return res;
    });

    test("/api/v1/community/:community_id/member/:user_id/unkick   / 로그인 O )", async () => {
        const res = await request(BASE_URL)
            .post("/api/v1/community/" + new_community_id + "/member/" + USER_ID + "/kick")
            .set("Authorization", `Bearer ${token}`)
            .expect(201);

        return res;
    });

    test("/api/v1/community/:community_id/member/:user_id/block   / 로그인 O )", async () => {
        const res = await request(BASE_URL)
            .post("/api/v1/community/" + new_community_id + "/member/" + USER_ID + "/block")
            .set("Authorization", `Bearer ${token}`)
            .expect(201);

        return res;
    });

    test("/api/v1/community/:community_id/member/:user_id/unblock   / 로그인 O )", async () => {
        const res = await request(BASE_URL)
            .post("/api/v1/community/" + new_community_id + "/member/" + USER_ID + "/unblock")
            .set("Authorization", `Bearer ${token}`)
            .expect(201);

        return res;
    });

    test("/api/v1/community/:community_id/subscribe   / 로그인 O )", async () => {
        const res = await request(BASE_URL)
            .post("/api/v1/community/" + new_community_id + "/subscribe")
            .set("Authorization", `Bearer ${token}`)
            .query({
                user_id: USER_ID
            })
            .expect(400);

        return res;
    });

    test("/api/v1/community/:community_id/unsubscribe   / 로그인 O )", async () => {
        const res = await request(BASE_URL)
            .post("/api/v1/community/" + new_community_id + "/unsubscribe")
            .set("Authorization", `Bearer ${token}`)
            .query({
                user_id: USER_ID
            })
            .expect(201);

        return res;
    });
    test("/api/v1/post / 로그인 O)", async () => {
        const res = await request(BASE_URL)
            .post("/api/v1/post")
            .set("Authorization", `Bearer ${token}`)
            .send({
                user_uid: USER_UID,
                post_state: "SNS",
                post_contents: "포스팅 내용입니다.",
                visibility: "PUBLIC",
                community: [
                    {
                        id: new_community_id
                    }
                ]
            })
            .expect(201);
        new_post_id = res.body.id;
        return res;
    });

    test("/api/v1/timeline/:community_id/pin/:post_id )", async () => {
        const res = await request(BASE_URL)
            .post("/api/v1/timeline/" + new_community_id + "/pin/" + new_post_id)
            .set("Authorization", `Bearer ${token}`)
            .expect(200);
        return res;
    });

    test("/api/v1/timeline/:community_id/unpin/:post_id )", async () => {
        const res = await request(BASE_URL)
            .post("/api/v1/timeline/" + new_community_id + "/unpin/" + new_post_id)
            .set("Authorization", `Bearer ${token}`)
            .expect(200);
        return res;
    });

    test("/api/v1/community/list / 로그인 O)", async () => {
        const res = await request(BASE_URL)
            .get("/api/v1/community/list")
            .set("Authorization", `Bearer ${token}`)
            .query({
                limit: 4,
                offset: 0,
                sort: "ALPAHBETIC"
            })
            .expect(200);
        return res;
    });

    test("/api/v1/community/:community_id/tag/count/ )", async () => {
        const res = await request(BASE_URL)
            .get("/api/v1/community/" + new_community_id + "/tag/count/")
            .expect(200);
        return res;
    });

    test("/api/v1/community/:community_id / 로그인 O)", async () => {
        const res = await request(BASE_URL)
            .get("/api/v1/community/" + new_community_id)
            .set("Authorization", `Bearer ${token}`)
            .expect(200);
        return res;
    });

    test("/api/v1/community/:community_id/channels )", async () => {
        const res = await request(BASE_URL)
            .get("/api/v1/community/" + new_community_id + "/channels")
            .expect(200);
        return res;
    });

    test("/api/v1/community/:community_id/members  / 로그인 O )", async () => {
        const res = await request(BASE_URL)
            .get("/api/v1/community/" + new_community_id + "/members")
            .set("Authorization", `Bearer ${token}`)
            .query({
                limit: 4,
                offset: 0
            })
            .expect(200);
        return res;
    });

    //좋아요 30개 이상
    test("/api/v1/timeline/:community_id/post )", async () => {
        const res = await request(BASE_URL)
            .get("/api/v1/timeline/" + new_community_id + "/post")
            .expect(200);
        return res;
    });

    test("/api/v1/timeline/:community_id/channel/:channel_id )", async () => {
        const res = await request(BASE_URL)
            .get("/api/v1/timeline/" + new_community_id + "/channel/" + new_channel_id)

            .expect(200);
        return res;
    });

    test("/api/v1/timeline/channel/:channel_id )", async () => {
        const res = await request(BASE_URL)
            .get("/api/v1/timeline/channel/" + USER_UID)
            .set("Authorization", `Bearer ${token}`)
            .query({
                sort: "POPULAR"
            })
            .expect(200);
        return res;
    });

    test("/api/v1/timeline/game/:game_id )", async () => {
        const res = await request(BASE_URL)
            .get("/api/v1/timeline/game/113")
            .expect(200);
        return res;
    });

    test("/api/v1/community/:community_id/channel/:channel_id/remove / 로그인 O )", async () => {
        const res = await request(BASE_URL)
            .post("/api/v1/community/" + new_community_id + "/channel/" + new_channel_id + "/remove")
            .set("Authorization", `Bearer ${token}`)
            .expect(201);

        return res;
    });

    test("/api/v1/community/:community_id/remove / 로그인 O )", async () => {
        const res = await request(BASE_URL)
            .post("/api/v1/community/" + new_community_id + "/remove")
            .set("Authorization", `Bearer ${token}`)
            .expect(401);

        return res;
    });
});
