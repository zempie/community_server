import { Inject, Injectable } from "@nestjs/common";
import { Fcm } from "./fcm.entity";
import * as dotenv from "dotenv";
import { FcmEnumType } from "./fcm.enum";
import * as path from "path";
import { Firebase } from "./firebase";
import { User } from "src/user/user.entity";

dotenv.config();

const GOOGLE_APPLICATION_CREDENTIALS = process.env.GOOGLE_APPLICATION_CREDENTIALS;
const appRoot = process.env.PWD;
export class FcmService {
    private firebase: Firebase;
    constructor(
        @Inject("FcmRepository")
        private readonly fcmRepository: typeof Fcm
    ) {
        this.firebase = new Firebase({
            serviceAccountPath: path.join(appRoot,GOOGLE_APPLICATION_CREDENTIALS),
            types: {
                USER: "USER",
                ADMIN: "ADMIN"
            },
            topics: {
                USER: "USER",
                ADMIN: "ADMIN"
            }
        });
    }

    async findOneByUserId(user_id: number | string) {
        return await this.fcmRepository.findOne({ where: { user_id } });
    }

    async getTokenByUserId(user_id: number | string): Promise<string[]> {
        const userFcms =  await this.fcmRepository.findAll({ where: { user_id } });
        
        return userFcms.map((fcm) => {
            return fcm.token
        })
    }

    async findOneByUserIds(user_id: number[]) {
        return await this.fcmRepository.findAll({ where: { user_id } });
    }

    async create(user_id: number, token: string) {
        const hasSameToken = await this.fcmRepository.findAll({
            where:{
                token,
                user_id
            }
        })

        if(!hasSameToken.length){
            const result =  await this.fcmRepository.create({
                user_id,
                token
            });
            return result
        }
    }

    async delete(id: string) {
        await this.fcmRepository.destroy({
            where: { id: id }
        });
        return true;
    }

    async deletebyUserId(user_id: number) {
        await this.fcmRepository.destroy({
            where: { user_id: user_id }
        });
        return true;
    }

    async deleteByToken(token: string, user_id: number) {
        const tokenOwner = await this.fcmRepository.findOne({
            where:{
                token
            }
        })
        
        if(tokenOwner?.user_id === user_id){
            await this.fcmRepository.destroy({
                where: { 
                    user_id,
                    token
                 }
            });

            return true;
        }else{
            return false
        }
    
    }

    async sendFCM(tokens: string[], title: string, body: string, type: FcmEnumType, value = "", image = process.env.FCM_IMG) {
        if (tokens.length === 0) {
            return null;
        }
        return await this.firebase.SendFCM(tokens, title, body, type, value, image);
    }

    async sendTopicFCM(topic: string, title: string, body: string, type: FcmEnumType, value = "", image = null) {
        return await this.firebase.SendTopicPush(topic, title, body, type, value, image);
    }

    async subscribeTopic(token: string, topic: string) {
        return this.firebase.SubscribeTopic(token, topic);
    }

    async unsubscribeTopic(token: string, topic: string) {
        return this.firebase.UnSubscribeTopic(token, topic);
    }
}
