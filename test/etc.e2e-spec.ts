import * as request from "supertest";
import { BASE_URL, getToken, USER_ID, USER_UID } from "./utils";

describe("그 외 E2E 테스트", () => {
    let user_id = USER_ID;
    let token: string = global.token;
    let portfolio_id: string;
    let community_id: string;
    let channel_id: string;

    test("/api/v1/search )", async () => {
        const res = await request(BASE_URL)
            .get("/api/v1/search")
            .query({
                hashtag: "a",
                limit: 5
            })
            .expect(200);
        return res;
    });

    test("/api/v1/search/header )", async () => {
        const res = await request(BASE_URL)
            .get("/api/v1/search/header")
            .query({
                q: "@a"
            })
            .expect(200);
        return res;
    });

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
        community_id = res.body.dataValues.id;
        return res;
    });

    test("/api/v1/community/:community_id/channel  / 로그인 O )", async () => {
        const res = await request(BASE_URL)
            .post("/api/v1/community/" + community_id + "/channel")
            .set("Authorization", `Bearer ${token}`)
            .send({
                title: "A 채널",
                description: "A 채널 설명",
                profile_img: "wwww.asdf.com",
                state: "PUBLIC"
            })
            .expect(201);
        channel_id = res.body.dataValues.id;
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
        portfolio_id = res.body.id;

        return res;
    });

    test("/api/v1/tag/users / 로그인 X)", async () => {
        const res = await request(BASE_URL)
            .get("/api/v1/tag/users")
            .set("Authorization", `Bearer ${global.token}`)
            .query({
                search: "젬"
            })
            .expect(200);
        return res;
    });

    test("/api/v1/tag/count/:user_id  / 로그인 X)", async () => {
        const res = await request(BASE_URL)
            .get("/api/v1/tag/count/" + USER_ID)
            .set("Authorization", `Bearer ${global.token}`)
            .expect(200);
        return res;
    });

    test("/api/v1/tag/all/count 로그인 X)", async () => {
        const res = await request(BASE_URL)
            .get("/api/v1/tag/all/count")
            .set("Authorization", `Bearer ${global.token}`)
            .expect(200);
        return res;
    });
});
