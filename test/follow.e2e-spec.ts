import * as request from "supertest";
import { BASE_URL, USER_ID } from "./utils";

describe("팔로잉 E2E 테스트", () => {
    let user_id = USER_ID;

    test("/api/v1/user/:user_id/list/following / 로그인 O)", async () => {
        const res = await request(BASE_URL)
            .get("/api/v1/user/" + user_id + "/list/following")
            .set("Authorization", `Bearer ${global.token}`)
            .expect(200);
        return res;
    });

    test("/api/v1/user/:user_id/list/follower )", async () => {
        const res = await request(BASE_URL)
            .get("/api/v1/user/" + user_id + "/list/follower")
            .set("Authorization", `Bearer ${global.token}`)
            .expect(200);
        return res;
    });
});
