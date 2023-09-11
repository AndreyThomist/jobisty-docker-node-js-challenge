import { Module } from '@nestjs/common';
import { StockController } from './stock.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { StockService } from './stock.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities/User.entity';

@Module({
  controllers: [StockController],
  imports: [
    PassportModule,
    TypeOrmModule.forFeature([User]),
    ClientsModule.register([
      {
        name: 'STOCK_SERVICE',
        transport: Transport.TCP,
        options: {
          host: 'stock-services',
          port: 3000,
        },
      },
    ]),
  ],
  providers: [JwtAuthGuard, StockService],
})
export class StockModule {}
