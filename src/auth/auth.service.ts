import {
  BadRequestException,
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
import { isUserActive } from 'src/shared/models/users';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
    private notificatorService: NotificatorService,
  ) {}

  async login(loginDto: LoginDto) {
    const user = await this.userService.getUserByEmail(loginDto.email);
    if (!user) {
      throw new UnauthorizedException();
    }

    if (!isUserActive(user)) {
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
      email: user.email,
      fullname: user.fullname,
      role: loginDto.role,
    };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async register(registerDto: RegisterDto) {
    const user = await this.userService.getUserByEmail(registerDto.email);
    if (user) {
      throw new ConflictException('Already existing email');
    }

    try {
      const password = this.generateNewRandomPassword();
      const hashedPassword = await this.hashPassword(password);
      const newUser = await this.userService.createUser({
        ...registerDto,
        password: hashedPassword,
      });
      await this.notificatorService.send(
        newUser.email,
        'SophenIA - Bienvenido',
        TemplatesEnum.createUserWithTemporalPassword,
        {
          newPassword: password,
          email: newUser.email,
        },
      );
      return newUser;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async createPassword(createPasswordDto: CreatePasswordDto) {
    const user = await this.userService.getUserByEmail(createPasswordDto.email);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (!isUserActive(user)) {
      throw new UnauthorizedException('User is not active');
    }

    if (user.password) {
      throw new ConflictException('Password already generated');
    }

    const saltOrRounds = 10;
    const hash = await bcrypt.hash(createPasswordDto.password, saltOrRounds);

    return this.userService.changePassword(createPasswordDto.email, hash);
  }

  async changePassword(changePasswordDto: ChangePasswordDto, userId: string) {
    const user = await this.userService.getUserById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (!isUserActive(user)) {
      throw new BadRequestException('User is not active');
    }

    const saltOrRounds = 10;
    const hashedPassword = await bcrypt.hash(
      changePasswordDto.newPassword,
      saltOrRounds,
    );

    return this.userService.changePassword(user.email, hashedPassword);
  }

  async forgotPassword(forgotPassword: ForgotPasswordDto) {
    const user = await this.userService.getUserByEmail(forgotPassword.email);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (!isUserActive(user)) {
      throw new BadRequestException('User is not active');
    }

    const newPassword = generate({
      length: 8,
      numbers: true,
    });
    const saltOrRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltOrRounds);

    try {
      await this.userService.changePassword(user.email, hashedPassword);
      await this.notificatorService.send(
        user.email,
        'SophenIA - Nueva contraseña',
        TemplatesEnum.forgotPassword,
        {
          newPassword: newPassword,
          email: user.email,
        },
      );
    } catch (e) {
      throw new InternalServerErrorException(e);
    } finally {
      return true;
    }
  }

  /**
   * Returns a random password
   */
  private generateNewRandomPassword() {
    return generate({
      length: 8,
      numbers: true,
    });
  }

  /**
   * Returns the hash of the password
   */
  private async hashPassword(pass: string): Promise<string> {
    const saltOrRounds = 10;
    return bcrypt.hash(pass, saltOrRounds);
  }
}
