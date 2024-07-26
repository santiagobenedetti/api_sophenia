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

@ApiTags(AuthRoutesEnum.auth)
@Controller(AuthRoutesEnum.auth)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(JwtGuard)
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

  @Post(AuthRoutesEnum.generatePassword)
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
