import { Injectable } from '@nestjs/common';
import { get } from 'https';
import * as csv from 'csvtojson';
import { Readable } from 'stream';
import { StockDTO } from './dto/stock.csv';
import { Repository } from 'typeorm';
import { Stock } from './entity/stock.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class StockService {
  constructor(
    @InjectRepository(Stock)
    private readonly stockRepository: Repository<Stock>,
  ) { }

  fetchStock(q: string): Promise<StockDTO> {
    const endpoint = `https://stooq.com/q/l/?s=${q}&f=sd2t2ohlcvn&h&e=csv`;
    return new Promise((resolve, reject) => {
      get(endpoint, (res) => {
        res.on('data', async (data) => {
          const csvParsed = await csv().fromStream(Readable.from(data));
          resolve(csvParsed[0] as StockDTO);
        });

        res.on('error', (err) => {
          reject(err.message);
        });
      });
    });
  }

  async retriveUserHistory(userId: string): Promise<Array<Stock>> {
    return await this.stockRepository.find({
      select: {
        name: true,
        close: true,
        date: true,
        low: true,
        high: true,
        symbol: true,
        open: true,
      },
      where: {
        userId,
      },
      order: {
        date: 'DESC',
      },
    });
  }

  async retriveStats(): Promise<Array<Stock>> {
    return await this.stockRepository
      .createQueryBuilder('stock')
      .select('lower(symbol) as stock,MAX(times_requested)', 'times_requested')
      .groupBy('stock')
      .orderBy('stock', 'DESC')
      .limit(5)
      .getRawMany();
  }

  private async findStockBySymbol(symbol: string) {
    return this.stockRepository.findOne({ where: { symbol: symbol } });
  }

  async saveStock({
    Close: close,
    Date: date,
    High: high,
    Name: name,
    Low: low,
    Open: open,
    Symbol: symbol,
    userId,
  }: StockDTO) {
    try {
      const stockExists = await this.findStockBySymbol(symbol);
      if (!stockExists) {
        const stock = this.stockRepository.create({
          symbol,
          name,
          close,
          low,
          open,
          date: new Date(date),
          high,
          userId,
          times_requested: 1,
        });
        await this.stockRepository.save(stock);
        delete stock.times_requested;
        return stock;
      }
      stockExists.times_requested++;
      await this.stockRepository.save(stockExists);
      delete stockExists.times_requested;
      delete stockExists.id;
      return stockExists;
    } catch (err) {
      throw new Error(err.message);
    }
  }
}
