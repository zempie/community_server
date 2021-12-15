import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString } from "class-validator";

export class File {
    @ApiProperty({ description: "순서" })
    @IsNumber()
    priority: number;

    @ApiProperty({ description: "파일 URL" })
    @IsString()
    url: string;
}
