import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import {
  ChangePasswordDto,
  CreatePasswordDto,
  ForgotPasswordDto,
  LoginDto,
  RegisterDto,
} from './dtos';
import * as bcrypt from 'bcrypt';
import { NotificatorService } from 'src/notificator/notificator.service';
import { TemplatesEnum } from 'src/notificator/enums';
import { generate } from 'generate-password';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
    private notificatorService: NotificatorService,
  ) {}

  async login(loginDto: LoginDto) {
    const user = await this.userService.getUserByUsername(loginDto.username);
    if (!user) {
      throw new UnauthorizedException();
    }

    const isMatch = await bcrypt.compare(loginDto.password, user?.password);
    if (!isMatch) {
      throw new UnauthorizedException();
    }

    const hasRole = user.roles.some((r) => r == loginDto.role);
    if (!hasRole) {
      throw new UnauthorizedException();
    }

    const payload = {
      sub: user._id,
      username: user.username,
      fullname: user.fullname,
      role: loginDto.role,
    };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async register(registerDto: RegisterDto) {
    const user = await this.userService.getUserByUsername(registerDto.username);
    if (user) {
      throw new ConflictException('Already existing username');
    }

    return this.userService.createUser(registerDto);
  }

  async createPassword(createPasswordDto: CreatePasswordDto) {
    const user = await this.userService.getUserByUsername(
      createPasswordDto.username,
    );
    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (user.password) {
      throw new ConflictException('Password already generated');
    }

    const saltOrRounds = 10;
    const hash = await bcrypt.hash(createPasswordDto.password, saltOrRounds);

    return this.userService.changePassword(createPasswordDto.username, hash);
  }

  async changePassword(changePasswordDto: ChangePasswordDto, userId: string) {
    const user = await this.userService.getUserById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const saltOrRounds = 10;
    const hashedPassword = await bcrypt.hash(
      changePasswordDto.newPassword,
      saltOrRounds,
    );

    return this.userService.changePassword(user.username, hashedPassword);
  }

  async forgotPassword(forgotPassword: ForgotPasswordDto) {
    const user = await this.userService.getUserByEmail(forgotPassword.email);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const newPassword = generate({
      length: 8,
      numbers: true,
    });
    const saltOrRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltOrRounds);

    try {
      await this.userService.changePassword(user.username, hashedPassword);
      await this.notificatorService.send(
        user.email,
        'SophenIA - Nueva contraseña',
        TemplatesEnum.forgotPassword,
        {
          newPassword: newPassword,
          fullname: user.fullname,
        },
      );
    } catch (e) {
      throw new InternalServerErrorException(e);
    } finally {
      return true;
    }
  }
}
