import { Inject, Injectable } from "@nestjs/common";
import * as path from "path";
import { FcmEnumType } from "src/fcm/fcm.enum";
import { FcmService } from "src/fcm/fcm.service";
import { Firebase } from "src/fcm/firebase";
import { AdminFcm } from "./admin.fcm.entity";


export class AdminFcmService {

    constructor(
        @Inject("AdminFcmRepository")
        private readonly fcmRepository: typeof AdminFcm,
        private readonly fcmService: FcmService
    ) {

    }

    async findOneByUserId(user_id: number | string) {
        return await this.fcmRepository.findOne({ where: { user_id: user_id } });
    }

    async getTokenByUserId(user_id: number | string): Promise<string[]> {
        const data = await this.fcmRepository.findOne({ where: { user_id: user_id } });
        return data !== null ? [data.token] : [];
    }

    async findOneByUserIds(user_id: number[]) {
        return await this.fcmRepository.findAll({ where: { user_id: user_id } });
    }

    async create(user_id: number, token: string) {
        return await this.fcmRepository.create({
            user_id: user_id,
            token: token
        });
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

    async sendFCM(title: string, body: string, type: FcmEnumType, value = "", image = null) {
        const adminUsers = await this.fcmRepository.findAll();
        return await this.fcmService.sendFCM(adminUsers.map(item => item.token), title, body, type, value, image);
    }

    async sendTopicFCM(topic: string, title: string, body: string, type: FcmEnumType, value = "", image = null) {
        return await this.fcmService.sendTopicFCM(topic, title, body, type, value, image);
    }

    async subscribeTopic(token: string, topic: string) {
        return this.fcmService.subscribeTopic(token, topic);
    }

    async unsubscribeTopic(token: string, topic: string) {
        return this.fcmService.unsubscribeTopic(token, topic);
    }
}
