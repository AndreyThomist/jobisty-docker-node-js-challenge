import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { StockService } from './stock.service';
import { Stock } from './entity/stock.entity';

@Controller('stock')
export class StockController {
  constructor(private readonly stockService: StockService) {}
  @MessagePattern('get-stock')
  async getStock({
    q,
    userId,
  }): Promise<Stock | { error: boolean; message: string }> {
    const alreadyExistsStock = await this.stockService.findStockBySymbol(
      (q as string).toLocaleUpperCase(),
    );
    if (alreadyExistsStock) {
      const updatedStock = this.stockService.updateStock(alreadyExistsStock);
      return updatedStock;
    }
    const stockCsvJson = await this.stockService.fetchStock(q);
    console.log(stockCsvJson);
    if (stockCsvJson.Open === 'N/D') {
      return {
        error: true,
        message: 'NOT ABLE TO PROCESS STOCK: INVALID INFO',
      };
    }
    const stock = this.stockService.saveStock({ ...stockCsvJson, userId });
    return stock;
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
