import { Injectable, UnauthorizedException } from '@nestjs/common';
import { SignInDto } from './dto/signIn-dto';
import { SignUpDto } from './dto/signUp.dto';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  private userModel = this.prismaService.users;

  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService
  ) {}

  async signIn(signInData: SignInDto) {
    const user = await this.userModel.findUnique({
      where: { email: signInData.email },
    });

    if (!user) throw new UnauthorizedException('User not found');

    const correctPassword = await bcrypt.compare(
      signInData.password,
      user.password
    );

    if (!correctPassword) throw new UnauthorizedException('Wrong password');
    return await this.signToken(user.id);
  }

  async signUp(signUpData: SignUpDto) {
    const hashedPassword = await bcrypt.hash(signUpData.password, 10);
    delete signUpData.confirmPassword;

    const newUser = {
      ...signUpData,
      password: hashedPassword,
    };

    await this.userModel.create({ data: newUser });

    return { error: false, message: 'Successfully registered' };
  }

  private async signToken(userId: number): Promise<{ access_token: string }> {
    const payload = {
      sub: userId,
    };

    const secret = this.config.get('JWT_SECRET');
    const jwtExpires = this.config.get('JWT_EXPIRES');

    const token = await this.jwt.signAsync(payload, {
      expiresIn: jwtExpires,
      secret: secret,
    });

    return {
      access_token: token,
    };
  }
}
