import { CanActivate, UseGuards } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";
import { applyDecorators } from '@nestjs/common';

export function ZempieUseGuards(...guards: (CanActivate | Function)[]) {
    return applyDecorators(
        UseGuards(...guards),
        ApiBearerAuth(),
    );
}
