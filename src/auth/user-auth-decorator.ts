import { createParamDecorator, ExecutionContext, SetMetadata } from "@nestjs/common";
import { User } from "src/user/user.entity";
// import { Connection } from "typeorm";

/**
 * 현재 사용자 데코레이터
 * @description 가드 없이 사용 시 null로 나옵니다.
 */
export const CurrentUser = createParamDecorator<unknown, ExecutionContext, User | null>((_, ctx) => {
    const host = ctx.switchToHttp();
    return host.getRequest().user ?? null;
});
