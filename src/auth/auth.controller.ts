import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthRoutesEnum } from './enums/authRoutes.enum';
import { AuthService } from './auth.service';
import { CreatePasswordDto, LoginDto, RegisterDto } from './dtos';
import { JwtGuard } from './guards/jwt.guard';
import { RoleGuard } from './guards/role.guard';
import { Roles } from './decorators/role.decorator';
import { RolesEnum } from './enums';

@ApiTags(AuthRoutesEnum.auth)
@Controller(AuthRoutesEnum.auth)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(JwtGuard, RoleGuard)
  @Roles(RolesEnum.ADMIN)
  @ApiBearerAuth('access-token')
  @Post(AuthRoutesEnum.register)
  registerUser(
    @Body(
      new ValidationPipe({
        expectedType: RegisterDto,
        transformOptions: {
          excludeExtraneousValues: true,
          exposeUnsetFields: false,
        },
      }),
    )
    registerDto: RegisterDto,
  ) {
    return this.authService.register(registerDto);
  }

  // A little unsecure, anyone that finds the username can set the password
  @Post(AuthRoutesEnum.createPassword)
  generatePassword(
    @Body(
      new ValidationPipe({
        expectedType: CreatePasswordDto,
        transformOptions: {
          excludeExtraneousValues: true,
          exposeUnsetFields: false,
        },
      }),
    )
    createPasswordDto: CreatePasswordDto,
  ) {
    return this.authService.createPassword(createPasswordDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post(AuthRoutesEnum.login)
  async login(
    @Body(
      new ValidationPipe({
        expectedType: LoginDto,
        transformOptions: {
          excludeExtraneousValues: true,
          exposeUnsetFields: false,
        },
      }),
    )
    loginDto: LoginDto,
  ) {
    return this.authService.login(loginDto);
  }
}
