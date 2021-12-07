import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { CreateChoiceDto } from "./dto/create-choice.dto";
import { ChoiceDto } from "./dto/choice.dto";
import { UpdateChoiceDto } from "./dto/update-choice.dto";
import { ChoiceService } from "./choice.service";

@Controller("choice")
@ApiTags("choice")
export class ChoiceController {
    constructor(private choiceService: ChoiceService) {}

    // @Get()
    // async findChoices() {
    //     return await this.choiceService.findAll();
    // }

    // @Get(":id")
    // async findChoice(@Param("id") id: string): Promise<ChoiceDto> {
    //     const poll = await this.choiceService.findOne(id);
    //     if (!poll) {
    //         throw new Error("NOT EXIST");
    //     }
    //     return poll;
    // }

    // @Post()
    // async create(@Body() data: CreateChoiceDto) {
    //     return await this.choiceService.create(data);
    // }
}
