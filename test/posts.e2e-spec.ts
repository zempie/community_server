import * as request from "supertest";
import { BASE_URL, getToken, USER_UID } from "./utils";

describe("포스팅 E2E 테스트", () => {
    let token = global.token;
    let post_id: string;
    let comment_id: string;

    beforeAll(async () => {
        token = await getToken();
    });

    test("/api/v1/post / 로그인 O)", async () => {
        const res = await request(BASE_URL)
            .post("/api/v1/post")
            .set("Authorization", `Bearer ${token}`)
            .send({
                user_uid: USER_UID,
                post_state: "SNS",
                post_contents: "포스팅 내용입니다.",
                visibility: "PUBLIC"
            })
            .expect(201);
        post_id = res.body.id;
        return res;
    });

    test("/api/v1/post/:post_id )", async () => {
        const res = await request(BASE_URL)
            .get("/api/v1/post/" + post_id)
            .set("Authorization", `Bearer ${token}`)
            .expect(200);
        return res;
    });

    test("/api/v1/post/:post_id/like/list )", async () => {
        const res = await request(BASE_URL)
            .get("/api/v1/post/" + post_id + "/like/list")
            .expect(200);
        return res;
    });

    test("/api/v1/post/:post_id/comment )", async () => {
        const res = await request(BASE_URL)
            .post("/api/v1/post/" + post_id + "/comment")
            .set("Authorization", `Bearer ${token}`)
            .send({
                user_uid: "LlmyPDTH61X3fzdqbRwisIcP2pH2",
                type: "COMMENT",
                content: "댓글 내용 입니다.",
                is_private: false
            })
            .expect(201);
        comment_id = res.body.dataValues.id;
        return res;
    });

    test("/api/v1/post/:post_id/comment/:comment_id )", async () => {
        const res = await request(BASE_URL)
            .post("/api/v1/post/" + post_id + "/comment/" + comment_id)
            .set("Authorization", `Bearer ${token}`)
            .send({
                content: "댓글 내용 수정 입니다."
            })
            .expect(201);
        return res;
    });

    test("/api/v1/post/:post_id/recomment )", async () => {
        const res = await request(BASE_URL)
            .post("/api/v1/post/" + post_id + "/recomment")
            .set("Authorization", `Bearer ${token}`)
            .send({
                user_uid: "LlmyPDTH61X3fzdqbRwisIcP2pH2",
                type: "REPLY",
                content: "대댓글 내용 입니다.",
                parent_id: comment_id,
                is_private: false
            })
            .expect(201);

        return res;
    });

    test("/api/v1/post/:post_id/comment/list )", async () => {
        const res = await request(BASE_URL)
            .get("/api/v1/post/" + post_id + "/comment/list")
            .set("Authorization", `Bearer ${token}`)
            .expect(200);

        return res;
    });

    test("/api/v1/post/:post_id/comment/:comment_id/like )", async () => {
        const res = await request(BASE_URL)
            .post("/api/v1/post/" + post_id + "/comment/" + comment_id + "/like")
            .set("Authorization", `Bearer ${token}`)
            .expect(201);

        return res;
    });

    test("/api/v1/post/:post_id/comment/:comment_id/unlike )", async () => {
        const res = await request(BASE_URL)
            .post("/api/v1/post/" + post_id + "/comment/" + comment_id + "/unlike")
            .set("Authorization", `Bearer ${token}`)
            .expect(201);

        return res;
    });

    test("/api/v1/post/:post_id/comment/:comment_id/dislike )", async () => {
        const res = await request(BASE_URL)
            .post("/api/v1/post/" + post_id + "/comment/" + comment_id + "/dislike")
            .set("Authorization", `Bearer ${token}`)
            .expect(201);

        return res;
    });

    test("/api/v1/post/:post_id/comment/:comment_id/undislike )", async () => {
        const res = await request(BASE_URL)
            .post("/api/v1/post/" + post_id + "/comment/" + comment_id + "/undislike")
            .set("Authorization", `Bearer ${token}`)
            .expect(201);

        return res;
    });

    test("/api/v1/post/:post_id/recomment/:comment_id )", async () => {
        const res = await request(BASE_URL)
            .put("/api/v1/post/" + post_id + "/recomment/" + comment_id)
            .set("Authorization", `Bearer ${token}`)
            .send({
                type: "REPLY",
                content: "대댓글 내용 수정 입니다.",
                parent_id: comment_id,
                is_private: false
            })
            .expect(200);

        return res;
    });

    test("/api/v1/post/:post_id/comment/:comment_id/pin )", async () => {
        const res = await request(BASE_URL)
            .post("/api/v1/post/" + post_id + "/comment/" + comment_id + "/pin")
            .set("Authorization", `Bearer ${token}`)
            .expect(201);

        return res;
    });

    test("/api/v1/post/:post_id/comment/:comment_id/unpin )", async () => {
        const res = await request(BASE_URL)
            .post("/api/v1/post/" + post_id + "/comment/" + comment_id + "/unpin")
            .set("Authorization", `Bearer ${token}`)
            .expect(201);

        return res;
    });

    test("/api/v1/post/:post_id/report )", async () => {
        const res = await request(BASE_URL)
            .post("/api/v1/post/" + post_id + "/report")
            .set("Authorization", `Bearer ${token}`)
            .send({
                post_id: post_id,
                report_reason: "2"
            })
            .expect(201);

        return res;
    });

    test("/api/v1/post/:post_id/like )", async () => {
        const res = await request(BASE_URL)
            .post("/api/v1/post/" + post_id + "/like")
            .set("Authorization", `Bearer ${token}`)
            .expect(201);

        return res;
    });

    test("/api/v1/post/:post_id/unlike )", async () => {
        const res = await request(BASE_URL)
            .post("/api/v1/post/" + post_id + "/unlike")
            .set("Authorization", `Bearer ${token}`)
            .expect(201);

        return res;
    });

    test("/api/v1/post/:post_id/retweet )", async () => {
        const res = await request(BASE_URL)
            .post("/api/v1/post/" + post_id + "/retweet")
            .set("Authorization", `Bearer ${token}`)
            .expect(201);

        return res;
    });

    test("/api/v1/post/:post_id/unretweet )", async () => {
        const res = await request(BASE_URL)
            .post("/api/v1/post/" + post_id + "/unretweet")
            .set("Authorization", `Bearer ${token}`)
            .expect(201);

        return res;
    });

    test("/api/v1/channel/pin/:post_id )", async () => {
        const res = await request(BASE_URL)
            .post("/api/v1/channel/pin/" + post_id)
            .set("Authorization", `Bearer ${token}`)
            .expect(201);

        console.log(res.body);

        return res;
    });

    test("/api/v1/channel/unpin/:post_id )", async () => {
        const res = await request(BASE_URL)
            .post("/api/v1/channel/unpin/" + post_id)
            .set("Authorization", `Bearer ${token}`)
            .expect(201);

        return res;
    });

    test("/api/v1/post/:post_id/comment/:comment_id )", async () => {
        const res = await request(BASE_URL)
            .delete("/api/v1/post/" + post_id + "/comment/" + comment_id)
            .set("Authorization", `Bearer ${token}`)
            .expect(200);

        return res;
    });

    test("/api/v1/post/:post_id  (delete))", async () => {
        const res = await request(BASE_URL)
            .delete("/api/v1/post/" + post_id)
            .set("Authorization", `Bearer ${token}`)
            .expect(200);

        return res;
    });
});
