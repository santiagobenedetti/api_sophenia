import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { UserRoutesEnum } from './enums';
import { UpdateUserDto } from './dtos';
import { UserService } from './user.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { UserId } from 'src/shared/decorators/userId.decorator';

@ApiTags(UserRoutesEnum.user)
@Controller(UserRoutesEnum.user)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtGuard)
  @ApiBearerAuth('access-token')
  @Get(UserRoutesEnum.profile)
  async getProfile(@UserId() userId: string) {
    return this.userService.getUserById(userId);
  }

  @UseGuards(JwtGuard)
  @ApiBearerAuth('access-token')
  @Patch(UserRoutesEnum.update)
  async updateUser(
    @Body(
      new ValidationPipe({
        expectedType: UpdateUserDto,
        transformOptions: {
          excludeExtraneousValues: true,
          exposeUnsetFields: false,
        },
      }),
    )
    updateUserDto: UpdateUserDto,
    @Param('id') userId: string,
  ) {
    return this.userService.updateUser(userId, updateUserDto);
  }
}
