import axios from "axios";
import * as dotenv from "dotenv";
import cheerio from "cheerio";

dotenv.config();
export const BASE_URL = process.env.URL ?? "localhost:5000";
export const GOOGLE_API = process.env.GOOGLE_API;
export const LOGIN_KEY = process.env.LOGIN_KEY;
export const LOGIN_EMAIL = process.env.LOGIN_EMAIL;
export const LOGIN_PASSWORD = process.env.LOGIN_PASSWORD;
export const USER_ID = process.env.USER_ID;
export const USER_UID = process.env.USER_UID;

export async function getToken() {
    let formData = {
        key: LOGIN_KEY,
        email: LOGIN_EMAIL,
        password: LOGIN_PASSWORD,
        returnSecureToken: "true"
    };

    let result = await axios
        .post(
            GOOGLE_API +
                "/identitytoolkit/v3/relyingparty/verifyPassword?key=AIzaSyAE2WeLg2L9n2niQMysGbXzACLNIXd5msE&email=hj.lee@fromthered.com&password=ftr12345!&returnSecureToken=true",
            formData
        )
        .catch(err => {
            console.error(err);
            throw new Error();
        });

    let { idToken } = result.data;

    this.idToken = idToken;
    return idToken;
}
