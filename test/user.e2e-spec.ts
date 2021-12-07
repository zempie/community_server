import * as request from "supertest";
import { BASE_URL, USER_ID } from "./utils";

describe("유저 E2E 테스트", () => {
    let user_id = USER_ID;
    let portfolio_id: string;

    test("/api/v1/user/mine / 로그인 O)", async () => {
        const res = await request(BASE_URL)
            .get("/api/v1/user/mine")
            .set("Authorization", `Bearer ${global.token}`)
            .expect(200);
        return res;
    });

    test("/api/v1/user/:user_id/totalPost / 로그인 O)", async () => {
        const res = await request(BASE_URL)
            .get("/api/v1/user/" + user_id + "/totalPost")
            .set("Authorization", `Bearer ${global.token}`)
            .expect(200);
        return res;
    });

    test("/api/v1/user/:user_id/list/userblock / 로그인 O)", async () => {
        const res = await request(BASE_URL)
            .get("/api/v1/user/" + user_id + "/list/userblock")
            .set("Authorization", `Bearer ${global.token}`)
            .expect(200);
        return res;
    });

    test("/api/v1/user/:user_id/list/usermute / 로그인 O)", async () => {
        const res = await request(BASE_URL)
            .get("/api/v1/user/" + user_id + "/list/usermute")
            .set("Authorization", `Bearer ${global.token}`)
            .expect(200);
        return res;
    });

    test("/api/v1/user/:user_id/list/portfolio / 로그인 O)", async () => {
        const res = await request(BASE_URL)
            .get("/api/v1/user/" + user_id + "/list/portfolio")
            .set("Authorization", `Bearer ${global.token}`)
            .expect(200);
        return res;
    });

    test("/api/v1/user/:user_id/list/community / 로그인 O)", async () => {
        const res = await request(BASE_URL)
            .get("/api/v1/user/" + user_id + "/list/community")
            .set("Authorization", `Bearer ${global.token}`)
            .expect(200);
        return res;
    });

    test("/api/v1/user/:user_id/follow / 로그인 O)", async () => {
        const res = await request(BASE_URL)
            .post("/api/v1/user/" + "80" + "/follow")
            .set("Authorization", `Bearer ${global.token}`)
            .expect(201);
        return res;
    });

    test("/api/v1/user/:user_id/unfollow / 로그인 O)", async () => {
        const res = await request(BASE_URL)
            .post("/api/v1/user/" + "80" + "/unfollow")
            .set("Authorization", `Bearer ${global.token}`)
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
        portfolio_id = res.body.id;
        return res;
    });

    test("/api/v1/user/:user_id/portfolio/:portfolio_id/delete / 로그인 O)", async () => {
        const res = await request(BASE_URL)
            .delete("/api/v1/user/" + user_id + "/portfolio/" + portfolio_id + "/delete")
            .set("Authorization", `Bearer ${global.token}`)
            .expect(200);
        return res;
    });
});
