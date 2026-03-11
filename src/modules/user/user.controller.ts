import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { JwtGuard } from 'src/modules/auth/guards/jwt.guard';
import { DeleteUserResponseDto } from 'src/modules/user/dtos/responses/delete-user-response.dto';
import { UpdateUserResponseDto } from 'src/modules/user/dtos/responses/update-user-response.dto';
import { UserResponseDto } from 'src/modules/user/dtos/responses/user-response.dto';
import { UpdateUserRequestDto } from 'src/modules/user/dtos/requests/update-user-request.dto';
import { UserService } from 'src/modules/user/user.service';

@ApiTags('users')
@ApiBearerAuth()
@UseGuards(JwtGuard)
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':id')
  async getUserById(@Param('id') id: string): Promise<UserResponseDto> {
    return await this.userService.getUserById(id);
  }

  @Patch(':id')
  async updateUser(
    @Param('id') id: string,
    @Body() body: UpdateUserRequestDto,
  ): Promise<UpdateUserResponseDto> {
    return await this.userService.updateUser(id, body);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async deleteUser(@Param('id') id: string): Promise<DeleteUserResponseDto> {
    return await this.userService.deleteUser(id);
  }
}
