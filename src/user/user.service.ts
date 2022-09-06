import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  private user = this.prismaService.users;

  constructor(private readonly prismaService: PrismaService) {}



  async findOne(id: number) {
    const user = await this.user.findFirst({
      where: { id },
      select: { id: true, email: true, name: true, phone: true, isAdmin: true },
    });

    if (!user) throw new NotFoundException('User not found');

    return user;
  }

}
