import csvParse from 'csv-parse';
import fs from 'fs';
import path from 'path';

import Transaction from '../models/Transaction.model';
import CreateTransactionService from './CreateTransaction.service';
import uploadConfig from '../config/upload';

interface Request {
  filename: string;
}

class ImportTransactionsService {
  private async loadFile(file: string): Promise<string[]> {
    const fileStream = fs.createReadStream(file);
    const parseStream = csvParse({
      from_line: 2,
      ltrim: true,
      rtrim: true,
    });
    const parsedFile = fileStream.pipe(parseStream);

    const lines = [''];
    parsedFile.on('data', line => lines.push(line));
    // Hack para utilizar async/await
    await new Promise(resolve => parsedFile.on('end', resolve));

    return lines;
  }

  async execute({ filename }: Request): Promise<Transaction[]> {
    const filePath = path.join(uploadConfig.directory, filename);

    const fileEntries = await this.loadFile(filePath);
    fileEntries.shift();

    const createTransaction = new CreateTransactionService();
    const newTransactionsList: Transaction[] = [];

    /* eslint-disable no-restricted-syntax, no-await-in-loop */
    for (const entry of fileEntries) {
      const newTransaction = await createTransaction.execute({
        title: entry[0],
        type: entry[1] as 'income' | 'outcome',
        value: Number(entry[2]),
        category: entry[3],
      });

      newTransactionsList.push(newTransaction);
    }
    /* eslint-enable */

    return newTransactionsList;
  }
}

export default ImportTransactionsService;
