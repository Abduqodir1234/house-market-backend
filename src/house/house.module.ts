import { CacheInterceptor, CacheModule, Module } from '@nestjs/common';
import { HouseService } from './house.service';
import { HouseController } from './house.controller';

@Module({
  imports: [
    CacheModule.register({
      ttl: 60 * 5,
    }),
  ],
  controllers: [HouseController],
  providers: [HouseService, CacheInterceptor],
})
export class HouseModule {}
