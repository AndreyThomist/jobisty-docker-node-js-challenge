import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ClientProxy } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/User.entity';
import { Repository } from 'typeorm';
import { ROLE } from '../entities/role.enum';

@Injectable()
export class StockService {
  constructor(
    @Inject('STOCK_SERVICE') private stockClient: ClientProxy,
    private readonly jwtService: JwtService,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}
  async getStock(q: string, authorization: string) {
    const jwt = authorization.replace('Bearer ', '');
    const json = this.jwtService.decode(jwt, { json: true }) as {
      id: string;
    };
    if (!json) {
      throw new ForbiddenException();
    }
    return this.stockClient.send('get-stock', { q, userId: json.id });
  }
  async getStats(authorization: string) {
    const jwt = authorization.replace('Bearer ', '');
    const json = this.jwtService.decode(jwt, { json: true }) as {
      id: string;
    };
    if (!json) {
      throw new ForbiddenException();
    }

    const user = await this.userRepository.findOne({
      where: { id: json.id },
    });
    if (!user || user.role !== ROLE.ADMIN) {
      throw new ForbiddenException();
    }
    return this.stockClient.send('get-stats', { id: user.id });
  }
  async getHistory(authorization: string) {
    const jwt = authorization.replace('Bearer ', '');
    const json = this.jwtService.decode(jwt, { json: true }) as {
      id: string;
    };
    if (!json) {
      throw new ForbiddenException();
    }
    const user = await this.userRepository.findOne({
      where: { id: json.id },
    });
    if (!user || user.role !== ROLE.ADMIN) {
      throw new ForbiddenException();
    }
    return this.stockClient.send('get-history', { id: user.id });
  }
}
