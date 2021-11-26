import { ApiProperty } from "@nestjs/swagger";

export class CreateChoiceDto {
    @ApiProperty({description:"제목"})
    title: string;

}

export class CreateChoice extends CreateChoiceDto {
    pollId: string;
}
