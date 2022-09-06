import { HouseListDto } from '../dto/house-list.dto';

// interface QueryDto{
//   address?:{contains:string,mode:string};
//   area?:{gte?:number,lte?:number};
//   price?:{gte?:number,lte?:number}
// }

export function HouseListQueryGenerator(data: HouseListDto) {
  const { address, area_gt, area_lt, price_gt, price_lt } = data;
  let query:any = {};

  if (address) query = { address: { contains: address, mode: 'insensitive' } };
  if (area_gt) query = { ...query, area: { gte: +area_gt } };
  if (area_lt) query = { ...query, area: { ...query?.area,lte: +area_lt } };
  if (price_gt) query = { ...query, price: { gte: +price_gt } };
  if (price_lt) query = { ...query, price: { ...query?.price,lte: +price_lt } };

  return query;
}
