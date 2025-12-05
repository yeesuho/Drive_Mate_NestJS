import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private usersRepo: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async signup(dto: SignupDto) {
    const exists = await this.usersRepo.findOne({
      where: { username: dto.username },
    });
    if (exists) {
      throw new BadRequestException('이미 사용 중인 아이디입니다.');
    }

    const hashed = await bcrypt.hash(dto.password, 10);
    const user = this.usersRepo.create({
      username: dto.username,
      password: hashed,
      displayName: dto.displayName,
    });
    await this.usersRepo.save(user);

    return { message: '회원가입이 완료되었습니다.' };
  }

  async validateUser(username: string, password: string): Promise<User> {
    const user = await this.usersRepo.findOne({ where: { username } });
    if (!user) throw new UnauthorizedException('아이디 또는 비밀번호가 올바르지 않습니다.');

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) throw new UnauthorizedException('아이디 또는 비밀번호가 올바르지 않습니다.');

    return user;
  }

  async login(dto: LoginDto) {
    const user = await this.validateUser(dto.username, dto.password);

    const payload = { sub: user.id, username: user.username };
    const accessToken = await this.jwtService.signAsync(payload);

    return {
      accessToken,
      tokenType: 'Bearer',
    };
  }

  async profile(userId: number) {
    const user = await this.usersRepo.findOne({
      where: { id: userId },
      relations: ['vehicles'],
    });
    return user;
  }
}
