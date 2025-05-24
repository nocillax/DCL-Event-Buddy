import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { SignupDto } from './dto/signup.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService
  ) {}

  async signup(data: SignupDto) {
    const existing = await this.userService.findByEmail(data.email);
    if (existing) throw new UnauthorizedException('Email already used');
    
    const hashed = await bcrypt.hash(data.password, 10);
    const user = await this.userService.create({
      ...data,
      password: hashed,
    });

    return this.getToken(user);
  }

async login(data: LoginDto) {
  const user = await this.userService.findByEmail(data.email);

  if (!user) {
    throw new UnauthorizedException('User not found');
  }

  const isMatch = await bcrypt.compare(data.password, user.password);
  
  if (!isMatch) {
    throw new UnauthorizedException('Invalid password');
  }

  return this.getToken(user);
}



  getToken(user: any) {
    const payload = { sub: user.id, name: user.name, email: user.email, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
