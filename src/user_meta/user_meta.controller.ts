import { Body, Controller, Get, Post, Put, Query, UnauthorizedException } from "@nestjs/common";
import { UserService } from "src/user/user.service";
import { UserMetaService } from "src/user_meta/user_meta.service";


@Controller("api/v1")
export class UserMetaController {
  constructor(
    private userMetaService: UserMetaService, 
  ){}


}