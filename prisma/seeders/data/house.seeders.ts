import * as randomCoordinates from 'random-coordinates';
export function houseSeeders() {
  const seeders = [];

  for (let i = 0; i < 100; i = i + 3) {
    const randomCoorDinate1 = randomCoordinates().split(',');
    const randomCoorDinate2 = randomCoordinates().split(',');
    const randomCoorDinate3 = randomCoordinates().split(',');
    seeders.push({
      price: Math.floor(Math.random() * 10000),
      location: [+randomCoorDinate1[0], +randomCoorDinate1[1]],
      address: `Beruniy Street, ${Math.floor(Math.random() * 10)}`,
      area: Math.floor(Math.random() * 100),
      advertiserId: 1,
    });

    seeders.push({
      price: Math.floor(Math.random() * 10000),
      location: [+randomCoorDinate2[0], +randomCoorDinate2[1]],
      address: `Random Street, ${Math.floor(Math.random() * 10)}`,
      area: Math.floor(Math.random() * 100),
      advertiserId: 2,
    });

    seeders.push({
      price: Math.floor(Math.random() * 10000),
      location: [+randomCoorDinate3[0], +randomCoorDinate3[1]],
      address: `Random Street, ${Math.floor(Math.random() * 10)}`,
      area: Math.floor(Math.random() * 100),
      advertiserId: 3,
    });
  }

  return seeders;
}
