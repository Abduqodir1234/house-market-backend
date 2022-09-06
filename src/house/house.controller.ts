import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Query,
  UseInterceptors,
  UploadedFile,
  Put,
  UploadedFiles,
  UseFilters,
  ParseIntPipe,
  CacheInterceptor,
} from '@nestjs/common';
import { HouseService } from './house.service';
import { CreateHouseDto } from './dto/create-house.dto';
import { UpdateHouseDto } from './dto/update-house.dto';
import { GetUser } from '../auth/decorator';
import { JwtGuard } from '../auth/guard';
import { HouseListDto } from './dto/house-list.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { multerConfig } from '../config/multer';
import { HouseCreateFilter } from './filters/exception.filter';

@Controller('house')
export class HouseController {
  constructor(private readonly houseService: HouseService) {}

  @Post('/')
  @UseGuards(JwtGuard)
  @UseInterceptors(FilesInterceptor('files', 10, multerConfig))
  @UseFilters(HouseCreateFilter)
  create(
    @Body() createHouseDto: CreateHouseDto,
    @GetUser('id') userId: number,
    @UploadedFiles() images: Array<Express.Multer.File>
  ) {
    return this.houseService.create(createHouseDto, userId, images);
  }

  @Get()
  findAllWithLimit(@Query() query: HouseListDto) {
    return this.houseService.findAllWithLimit(query);
  }

  @Get('all')
  @UseInterceptors(CacheInterceptor)
  findAll(@Query() query: HouseListDto) {
    return this.houseService.findAll(query);
  }

  @Get('personal')
  @UseGuards(JwtGuard)
  findAllPersonalHouses(
    @Query() query: HouseListDto,
    @GetUser('id') userId: number
  ) {
    return this.houseService.findAllPersonalHouses(query, userId);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.houseService.findOne(id);
  }

  @Put(':id')
  @UseGuards(JwtGuard)
  @UseInterceptors(FilesInterceptor('files', 10, multerConfig))
  @UseFilters(HouseCreateFilter)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateHouseDto: UpdateHouseDto,
    @GetUser('id') userId: number,
    @UploadedFile() images: Express.Multer.File[]
  ) {
    return this.houseService.update(id, updateHouseDto, userId, images);
  }
}
