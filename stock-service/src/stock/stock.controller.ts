import { BadRequestException, Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { StockService } from './stock.service';
import { Stock } from './entity/stock.entity';

@Controller('stock')
export class StockController {
  constructor(private readonly stockService: StockService) {}
  @MessagePattern('get-stock')
  async getStock({ q, userId }): Promise<Stock | Error> {
    try {
      const stockCsvJson = await this.stockService.fetchStock(q);
      const stock = this.stockService.saveStock({ ...stockCsvJson, userId });
      return stock;
    } catch (err) {
      throw new BadRequestException();
    }
  }
  @MessagePattern('get-stats')
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async getStats({ id }): Promise<Array<Stock> | Error> {
    const stocks = await this.stockService.retriveStats();
    return stocks;
  }
  @MessagePattern('get-history')
  async getHistory({ id }): Promise<Array<Stock> | Error> {
    const stock = await this.stockService.retriveUserHistory(id);
    return stock;
  }
}
