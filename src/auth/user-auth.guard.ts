import { ForbiddenException, Inject, UnauthorizedException } from '@nestjs/common';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';
import { Observable } from 'rxjs';
import { User } from 'src/user/user.entity';
import { Request } from "express";
import axios from 'axios'
import * as dotenv from "dotenv";
import { Logger } from '@nestjs/common';
import { AppController } from 'src/app.controller';
import { Admins } from 'src/admin/admin.entity';

interface FirebaseAccountInterface {
  localId: string,
  email: string,
  passwordHash: string,
  emailVerified: boolean,
  passwordUpdatedAt: number,
  providerUserInfo:
  {
    providerId: string,
    federatedId: string,
    email: string,
    rawId: string
  }[],
  validSince: string,
  lastLoginAt: string,
  created_at: string,
  lastRefreshAt: Date
}

interface FirebaseAccountResultInterface {
  kind: string,
  users: FirebaseAccountInterface[],
}
async function firebaseGetAccountInfo(API_KEY: string, idToken: string): Promise<FirebaseAccountInterface> {
  return new Promise((resolve, reject) => {
    axios.post(`https://www.googleapis.com/identitytoolkit/v3/relyingparty/getAccountInfo?key=${API_KEY}&idToken=${idToken}`, null)
      .then(result => {
        const resultData: FirebaseAccountResultInterface = result.data;

        if (resultData.users.length === 0) {
          reject(new Error("not_found_user"))
        }
        resolve(resultData.users[0])
      })
      .catch(err => {
        // console.error(err);
        reject(err);
      })
  })
}
@Injectable()
export class UserAuthGuard implements CanActivate {
  #userRepository: typeof User;
  private API_KEY = process.env.FIREBASE_API_KEY;
  private readonly logger = new Logger(AppController.name);
  constructor(
    @Inject("UserRepository")
    private readonly userRepository: typeof User
  ) {
    this.#userRepository = userRepository;
    if (this.API_KEY === undefined || this.API_KEY === null) {
      this.logger.error("파이어베이스 API 키가 없습니다.")
    }
  }
  async canActivate(
    executionContext: ExecutionContext,
  ): Promise<boolean> {
    let authorization: string;
    let host: HttpArgumentsHost;
    host = executionContext.switchToHttp();
    const req = host.getRequest<Request>();
    authorization = req.headers.authorization;
    if (authorization === undefined) {
      throw new UnauthorizedException();
    }

    // 토큰 타입 검사
    const [tokenType, token] = authorization.split(" ");
    if (tokenType.toLowerCase() !== "bearer") {
      throw new UnauthorizedException()
    }

    // 토큰 유효성 검사
    let payload: FirebaseAccountInterface;
    try {
      payload = await firebaseGetAccountInfo(this.API_KEY, token);
    } catch (e) {
      throw new UnauthorizedException();
    }

    // 유저 존재 검사
    const user: User | null = (await this.#userRepository.findOne({
      where: {
        uid: payload.localId
      }
    })) ?? null;
    if (user === null) {
      throw new ForbiddenException()
    }

    const c_req = (<HttpArgumentsHost>host).getRequest();
    c_req.user = user;

    return true;
  }
}

@Injectable()
export class UserTokenCheckGuard implements CanActivate {
  #userRepository: typeof User;
  private API_KEY = process.env.FIREBASE_API_KEY;
  private readonly logger = new Logger(AppController.name);
  constructor(
    @Inject("UserRepository")
    private readonly userRepository: typeof User
  ) {
    this.#userRepository = userRepository;
    if (this.API_KEY === undefined || this.API_KEY === null) {
      this.logger.error("파이어베이스 API 키가 없습니다.")
    }
  }

  async canActivate(
    executionContext: ExecutionContext,
  ): Promise<boolean> {
    let authorization: string;
    let host: HttpArgumentsHost;
    host = executionContext.switchToHttp();
    const req = host.getRequest<Request>();
    authorization = req.headers.authorization;
    if (authorization === undefined) {
      return true
    }

    // 토큰 타입 검사
    const [tokenType, token] = authorization.split(" ");
    if (tokenType.toLowerCase() !== "bearer") {
      return true;
    }

    // 토큰 유효성 검사
    let payload: FirebaseAccountInterface;
    try {
      payload = await firebaseGetAccountInfo(this.API_KEY, token);
    } catch (e) {
      return true;
    }

    // 유저 존재 검사
    const user: User | null = (await this.#userRepository.findOne({
      where: {
        uid: payload.localId
      }
    })) ?? null;
    if (user === null) {
      return true;
    }

    const c_req = (<HttpArgumentsHost>host).getRequest();
    c_req.user = user;

    return true;
  }
}

@Injectable()
export class AdminAuthGuard implements CanActivate {
  #userRepository: typeof Admins;
  private API_KEY = process.env.FIREBASE_API_KEY;
  private readonly logger = new Logger(AppController.name);
  constructor(
    @Inject("AdminsRepository")
    private readonly userRepository: typeof Admins
  ) {
    this.#userRepository = userRepository;
    if (this.API_KEY === undefined || this.API_KEY === null) {
      this.logger.error("파이어베이스 API 키가 없습니다.")
    }
  }
  async canActivate(
    executionContext: ExecutionContext,
  ): Promise<boolean> {
    let authorization: string;
    let host: HttpArgumentsHost;
    host = executionContext.switchToHttp();
    const req = host.getRequest<Request>();
    // authorization = req.headers.authorization;
    // if (authorization === undefined) {
    //   throw new UnauthorizedException();
    // }

    // // 토큰 타입 검사
    // const [tokenType, token] = authorization.split(" ");
    // if (tokenType.toLowerCase() !== "bearer") {
    //   throw new UnauthorizedException()
    // }

    // // 토큰 유효성 검사
    // let payload: FirebaseAccountInterface;
    // try {
    //   payload = await firebaseGetAccountInfo(this.API_KEY, token);
    // } catch (e) {
    //   throw new UnauthorizedException();
    // }

    // // 유저 존재 검사
    // const user: Admins | null = (await this.#userRepository.findOne({
    //   where: {
    //     uid: payload.localId
    //   }
    // })) ?? null;
    // if (user === null) {
    //   throw new ForbiddenException()
    // }

    // const c_req = (<HttpArgumentsHost>host).getRequest();
    // c_req.user = user;

    return true;
  }
}