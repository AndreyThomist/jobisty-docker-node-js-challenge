import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StockModule } from './stock/stock.module';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'db',
      port: 5432,
      username: process.env.POSGRES_USERNAME,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DATABASE,
      entities: [__dirname + '/../**/*.entity{.ts,.js}'],
      synchronize: true,
      autoLoadEntities: true,
    }),
    StockModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
