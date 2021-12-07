import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post, Put } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { SuccessReturnModel } from "src/abstract/base-model";
import { ReportDto } from "./dto/report.dto";
import { ReportService } from "./report.service";

@Controller("api/v1/report")
@ApiTags("api/v1/report")
export class ReportController {
    constructor(private postReportService: ReportService) { }

    @Get()
    async findReports() {
        return await this.postReportService.findAll();
    }

    @Delete(":id")
    async delete(@Param("id") id: string): Promise<SuccessReturnModel> {
        try {
            await this.postReportService.delete(id);
            return { success: true }
        } catch (e) {
            throw new HttpException("NOT_FOUND", HttpStatus.NOT_FOUND);
        }
    }
}
