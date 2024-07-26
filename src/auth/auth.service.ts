import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { CreatePasswordDto, LoginDto, RegisterDto } from './dtos';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
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

    const payload = {
      sub: user.id,
      username: user.username,
      fullname: user.fullname,
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
}
