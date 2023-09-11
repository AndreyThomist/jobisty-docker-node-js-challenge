import {
  ConflictException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { User } from '../entities/User.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { RegisterDTO } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { RequestToken } from './dto/request-token.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  public async findByUserEmail(email: string): Promise<User> {
    return await this.userRepository.findOne({ where: { email: email } });
  }

  public async register({ email, password, role }: RegisterDTO) {
    //check if this user email already is being used
    const foundEmail = await this.findByUserEmail(email);
    if (foundEmail) {
      throw new ConflictException('Email already being used');
    }
    const salt = process.env.PASSWORD_SALT;
    const hashPassword = await bcrypt.hash(password, salt);
    const temporaryCreatedUser = this.userRepository.create({
      email: email,
      password: hashPassword,
      role: role,
    });
    await this.userRepository.save(temporaryCreatedUser);
    delete temporaryCreatedUser.password;
    return temporaryCreatedUser;
  }

  protected async validateUserInfo({
    email,
    password,
  }: RequestToken): Promise<boolean> {
    const foundUser = await this.findByUserEmail(email);
    if (!foundUser) {
      return false;
    }
    const isMatch = await bcrypt.compare(password, foundUser.password);
    return isMatch;
  }

  public async requestToken({ email, password }: RequestToken) {
    const isValidated = await this.validateUserInfo({ email, password });
    if (!isValidated) {
      throw new ForbiddenException('invalid credentials');
    }
    const id = (await this.findByUserEmail(email)).id;
    const token = await this.jwtService.signAsync({ email, id });
    return {
      token,
      message: 'token valid for 3 hours',
    };
  }
}
