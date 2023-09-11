import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ClientProxy } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/User.entity';
import { Repository } from 'typeorm';
import { ROLE } from '../entities/role.enum';
import { Observable, lastValueFrom } from 'rxjs';

@Injectable()
export class StockService {
  constructor(
    @Inject('STOCK_SERVICE') private stockClient: ClientProxy,
    private readonly jwtService: JwtService,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}
  async getStock(
    q: string,
    authorization: string,
  ): Promise<Observable<Error | any>> {
    if (!authorization) {
      throw new ForbiddenException();
    }
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
    if (!user) {
      throw new ForbiddenException();
    }
    const stock = await lastValueFrom(
      this.stockClient.send('get-stock', { q, userId: json.id }),
    );
    if (stock.error) {
      throw new BadRequestException(stock.message);
    }
    return stock;
  }
  async getStats(authorization: string) {
    if (!authorization) {
      throw new ForbiddenException();
    }
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
    const clientObserver = this.stockClient.send('get-stats', { id: user.id });
    clientObserver.subscribe({
      error: () => {
        throw new NotFoundException();
      },
    });
    return clientObserver;
  }
  async getHistory(authorization: string) {
    if (!authorization) {
      throw new ForbiddenException();
    }
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
    if (!user) {
      throw new ForbiddenException();
    }
    return this.stockClient.send('get-history', { id: user.id });
  }
}
