import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';

import { CurrentUser } from 'src/modules/auth/decorators/current-user.decorator';
import { JwtGuard } from 'src/modules/auth/guards/jwt.guard';
import { OptionalJwtGuard } from 'src/modules/auth/guards/optional-jwt.guard';
import { JwtPayload } from 'src/modules/auth/interfaces/jwt-payload.interface';
import { CreateCarRequestDto } from 'src/modules/car/dtos/requests/create-car-request.dto';
import { UpdateCarRequestDto } from 'src/modules/car/dtos/requests/update-car-request.dto';
import { CreateCarResponseDto } from 'src/modules/car/dtos/responses/create-car-response.dto';
import { DeleteCarResponseDto } from 'src/modules/car/dtos/responses/delete-car-response.dto';
import { UpdateCarResponseDto } from 'src/modules/car/dtos/responses/update-car-response.dto';
import { CarListItemResponseDto } from 'src/modules/car/dtos/responses/car-list-item-response.dto';
import { CarResponseDto } from 'src/modules/car/dtos/responses/car-response.dto';
import { CarService } from 'src/modules/car/car.service';

@ApiTags('cars')
@Controller('cars')
export class CarController {
  constructor(private readonly carService: CarService) {}

  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @Post()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FilesInterceptor('images'))
  async createCar(
    @Body() body: CreateCarRequestDto,
    @UploadedFiles() files: Express.Multer.File[],
    @CurrentUser() user: JwtPayload,
  ): Promise<CreateCarResponseDto> {
    const { sub: userId } = user;

    return await this.carService.createCar(userId, body, files ?? []);
  }

  @UseGuards(OptionalJwtGuard)
  @Get()
  async getCars(): Promise<CarListItemResponseDto[]> {
    return await this.carService.getCars();
  }

  @UseGuards(OptionalJwtGuard)
  @Get(':id')
  async getCarById(
    @Param('id') id: string,
    @CurrentUser() user: JwtPayload | undefined,
  ): Promise<CarResponseDto> {
    return await this.carService.getCarById(id, user);
  }

  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @Patch(':id')
  async updateCar(
    @Param('id') id: string,
    @Body() body: UpdateCarRequestDto,
    @CurrentUser() user: JwtPayload,
  ): Promise<UpdateCarResponseDto> {
    return await this.carService.updateCar(id, user.sub, body);
  }

  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async deleteCar(
    @Param('id') id: string,
    @CurrentUser() user: JwtPayload,
  ): Promise<DeleteCarResponseDto> {
    return await this.carService.deleteCar(id, user.sub);
  }
}
