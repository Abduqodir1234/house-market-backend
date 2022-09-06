import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { HouseListQueryGenerator } from './components/query-generator';
import { CreateHouseDto } from './dto/create-house.dto';
import { HouseListDto } from './dto/house-list.dto';
import { UpdateHouseDto } from './dto/update-house.dto';

@Injectable()
export class HouseService {
  private houses = this.prismaService.houses;

  constructor(private readonly prismaService: PrismaService) {}

  async create(
    createHouseDto: CreateHouseDto,
    userId: number,
    images: Express.Multer.File[]
  ) {
    let imgLinks = [];
    if (images || images.length > 0)
      imgLinks = images?.map((one) => one.filename);

    const longitude = +createHouseDto.longitude;
    const latitude = +createHouseDto.latitude;

    delete createHouseDto.latitude;
    delete createHouseDto.longitude;

    await this.houses.create({
      data: {
        ...createHouseDto,
        advertiserId: userId,
        area: +createHouseDto.area,
        price: +createHouseDto.price,
        images: imgLinks,
        location: [longitude, latitude],
      },
    });

    return { error: false, message: 'Created' };
  }

  async findAllWithLimit(listQuery: HouseListDto) {
    const query = HouseListQueryGenerator(listQuery);
    const count = await this.houses.count({ where: query });
    const data = await this.houses.findMany({
      where: query,
      skip: +listQuery.offset || 0,
      take: +listQuery.limit || 9,
    });
    return { data, count };
  }

  async findAllPersonalHouses(listQuery: HouseListDto, userId: number) {
    const query = HouseListQueryGenerator(listQuery);
    const count = await this.houses.count({
      where: {
        ...query,
        advertiserId: userId,
      },
    });
    const data = await this.houses.findMany({
      where: {
        ...query,
        advertiserId: userId,
      },
      skip: +listQuery.offset || 0,
      take: +listQuery.limit || 9,
    });
    return { data, count };
  }

  async findAll(listQuery: HouseListDto) {
    const query = HouseListQueryGenerator(listQuery);
    const data = [];

    /*
      This technique is used for performance issue and 
      taking all elements at once from db takes too much time and 
      it is not easy for db too.
      Now, We have only 100 data but when we have 10000 or 200000 or more,
      db may not handle this. 
    */
    const count = await this.houses.count({ where: query });
    const numberOfTakenData = 400;
    const remainder = count % numberOfTakenData;

    const countOfItemsDividableBy100 = count - remainder;
    for (let i = 0; i < countOfItemsDividableBy100; i += numberOfTakenData) {
      const houses = await this.houses.findMany({
        where: query,
        skip: i,
        select: { id: true, location: true },
        take: (i + 1) * numberOfTakenData,
      });

      data.push(...houses);
    }

    const remainderData = await this.houses.findMany({
      where: query,
      skip: countOfItemsDividableBy100,
      select: { id: true, location: true },
    });

    data.push(...remainderData);
    return data;
  }

  async findOne(id: number) {
    const data = await this.houses.findFirst({
      where: {
        id,
      },
      include: {
        advertiser: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!data) throw new NotFoundException('House not found');

    return data;
  }

  async update(
    id: number,
    updateHouseDto: UpdateHouseDto,
    userId: number,
    images: Express.Multer.File[]
  ) {
    let imgLinks = [];
    if (images && images.length > 0) imgLinks = images.map((one) => one.path);
    const longitude = +updateHouseDto.longitude;
    const latitude = +updateHouseDto.latitude;

    delete updateHouseDto.latitude;
    delete updateHouseDto.longitude;
    const updated = await this.houses.updateMany({
      where: { id, advertiserId: userId },
      data: {
        ...updateHouseDto,
        area: +updateHouseDto.area,
        price: +updateHouseDto.price,
        location: [longitude, latitude],
        images: { push: imgLinks },
      },
    });

    if (updated.count === 0) throw new NotFoundException('House not found');

    return { error: false, message: 'Successfully updated' };
  }
}
