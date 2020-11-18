import { getCustomRepository } from 'typeorm';

import TransactionsRepository from '../repositories/Transactions.repository';
import AppError from '../errors/AppError';

interface Request {
  id: string;
}

class DeleteTransactionService {
  async execute({ id }: Request): Promise<void> {
    const transactionsRepository = getCustomRepository(TransactionsRepository);

    const transactionMatched = await transactionsRepository.findOne(id);

    if (!transactionMatched) {
      throw new AppError('Transaction not found');
    }

    await transactionsRepository.delete(id);
  }
}

export default DeleteTransactionService;
