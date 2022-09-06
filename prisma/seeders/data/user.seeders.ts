import * as bcrypt from 'bcrypt';
export async function userSeeders() {
  return [
    {
      name: 'Alibek Bahronov',
      phone: '+998911234568',
      email: 'allakimovallakim@gmail.com',
      password: await bcrypt.hash('BahronovAlibekKhan', 10),
      isAdmin: true,
    },
    {
      name: 'Umid Berdiyev',
      phone: '+998911234569',
      email: 'umidberdiyev@gmail.com',
      password: await bcrypt.hash('UmidBerdiyevKhan', 10),
      isAdmin: false,
    },
    {
      name: 'Abduvali Ibragimov',
      phone: '+998911234561',
      email: 'abduvaliibragimov@gmail.com',
      password: await bcrypt.hash('IbragimovAbduvaliKhan', 10),
      isAdmin: false,
    },
  ];
}
