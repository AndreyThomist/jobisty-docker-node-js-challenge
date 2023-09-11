import {
  BadGatewayException,
  Controller,
  Get,
  Headers,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { StockService } from './stock.service';
import { GetStockDTO } from './dto/get-stock.dto';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('stock')
export class StockController {
  constructor(private readonly stockService: StockService) {}
  @ApiBearerAuth('JWT-SWAGGER')
  @UseGuards(JwtAuthGuard)
  @Get('/')
  public async getStocks(@Query() data: GetStockDTO, @Headers() headers) {
    if (!data.q.trim()) {
      throw new BadGatewayException('Empty Parameter');
    }
    const stock = await this.stockService.getStock(
      data.q,
      headers.authorization,
    );
    return stock;
  }
  @ApiBearerAuth('JWT-SWAGGER')
  @UseGuards(JwtAuthGuard)
  @Get('/stats')
  public async getStats(@Headers() headers) {
    const stocks = await this.stockService.getStats(headers.authorization);
    return stocks;
  }
  @ApiBearerAuth('JWT-SWAGGER')
  @Get('/history')
  public async getHistoryUser(@Headers() headers) {
    const stocks = await this.stockService.getHistory(headers.authorization);
    return stocks;
  }
}
