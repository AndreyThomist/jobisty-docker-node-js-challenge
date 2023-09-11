import { Controller, Get, Headers, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { StockService } from './stock.service';

@Controller('stock')
export class StockController {
  constructor(private readonly stockService: StockService) {}
  @UseGuards(JwtAuthGuard)
  @Get('/')
  public async getStocks(@Query('q') q: string, @Headers() headers) {
    try {
      return this.stockService.getStock(q, headers.authorization);
    } catch (err) {
      return err;
    }
  }
  @UseGuards(JwtAuthGuard)
  @Get('/stats')
  public async getStats(@Headers() headers) {
    const stocks = await this.stockService.getStats(headers.authorization);
    return stocks;
  }
  @Get('/history')
  public async getHistoryUser(@Headers() headers) {
    const stocks = await this.stockService.getHistory(headers.authorization);
    return stocks;
  }
}
