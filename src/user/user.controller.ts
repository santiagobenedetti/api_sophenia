import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UserRoutesEnum } from './enums';
import { UpdateUserDto } from './dtos';
import { UserService } from './user.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { UserId } from 'src/shared/decorators/userId.decorator';
import { RoleGuard } from 'src/auth/guards/role.guard';
import { Roles } from 'src/auth/decorators/role.decorator';
import { RolesEnum } from 'src/auth/enums';
import { PaginationPipe } from 'src/shared/pipes/pagination.pipe';
import { GetUsersQueryParams } from 'src/shared/types/users';
import { mapGetUserData } from './mappers/getUser.mapper';
import { mapGetUsersData } from './mappers/getUsers.mapper';

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

  @UseGuards(JwtGuard, RoleGuard)
  @Roles(RolesEnum.ADMIN)
  @ApiBearerAuth('access-token')
  @Get(UserRoutesEnum.workers)
  async getWorkerUsers() {
    return this.userService.getWorkerUsers();
  }

  @UseGuards(JwtGuard)
  @ApiBearerAuth('access-token')
  @Patch(UserRoutesEnum.userById)
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

  @UseGuards(JwtGuard, RoleGuard)
  @Roles(RolesEnum.ADMIN)
  @ApiBearerAuth('access-token')
  @UsePipes(new PaginationPipe())
  @Get()
  async getUsers(@Query() getUsersQueryParams: GetUsersQueryParams) {
    const response = await this.userService.getUsers(getUsersQueryParams);
    return {
      ...response,
      data: mapGetUsersData(response.data),
    };
  }

  @UseGuards(JwtGuard, RoleGuard)
  @Roles(RolesEnum.ADMIN)
  @ApiBearerAuth('access-token')
  @Delete(UserRoutesEnum.userById)
  async deleteUser(@Param('id') userId: string) {
    return this.userService.deleteUser(userId);
  }

  @UseGuards(JwtGuard, RoleGuard)
  @Roles(RolesEnum.ADMIN)
  @ApiBearerAuth('access-token')
  @Get(UserRoutesEnum.userById)
  async getUserById(@Param('id') userId: string) {
    const user = await this.userService.getUserById(userId);
    return mapGetUserData(user);
  }
}
