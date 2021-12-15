import { Inject, Injectable } from "@nestjs/common";
import { CreateReportCommentDto, CreateReportPostDto } from "./dto/create-report.dto";

import { Report } from "./report.entity";

@Injectable()
export class ReportService {
    constructor(
        @Inject("ReportRepository")
        private readonly reportRepository: typeof Report
    ) {}

    async findAll() {
        return await this.reportRepository.findAll();
    }

    async findOne(id: string) {
        return await this.reportRepository.findOne({
            where: {
                id: id
            }
        });
    }

    async createCommmentreport(data: CreateReportCommentDto) {
        return await this.reportRepository.create(data);
    }

    async createPostreport(data: CreateReportPostDto) {
        return await this.reportRepository.create(data);
    }

    async existPostreport(user_id: number, post_id: string) {
        return await this.reportRepository.findOne({
            where: {
                user_id: user_id,
                post_id: post_id
            }
        });
    }

    async existCommentreport(user_id: number, comment_id: string) {
        return await this.reportRepository.findOne({
            where: {
                user_id: user_id,
                comment_id: comment_id
            }
        });
    }

    async setTrue(id: string) {
        await this.reportRepository.update(
            { isDone: true },
            {
                where: {
                    id: id
                }
            }
        );
        return await this.findOne(id);
    }

    async setFalse(id: string) {
        await this.reportRepository.update(
            { isDone: false },
            {
                where: {
                    id: id
                }
            }
        );
        return await this.findOne(id);
    }

    async delete(id: string) {
        const exist = await this.reportRepository.findOne({
            where: {
                id: id
            }
        });
        if (exist === null) {
            throw new Error();
        }
        await this.reportRepository.destroy({
            where: {
                id: id
            }
        });
        return true;
    }
}
