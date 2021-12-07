import { ApiProperty } from "@nestjs/swagger";

export class ChoiceDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    title: string;

    @ApiProperty()
    is_voted?: boolean;

    @ApiProperty()
    voted_cnt: number;

    constructor(partial: Partial<ChoiceDto>) {
        Object.assign(this, partial);
        this.is_voted = false;
    }
}
