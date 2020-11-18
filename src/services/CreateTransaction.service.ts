import { getCustomRepository } from 'typeorm';

import Transaction from '../models/Transaction.model';
import TransactionsRepository from '../repositories/Transactions.repository';
import CategoriesRepository from '../repositories/Categories.repository';
import AppError from '../errors/AppError';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class CreateTransactionService {
  async execute({
    title,
    value,
    type,
    category,
  }: Request): Promise<Transaction> {
    const transactionsRepository = getCustomRepository(TransactionsRepository);
    const categoriesRepository = getCustomRepository(CategoriesRepository);

    const categoryMatched = await categoriesRepository.findOrCreate(category);

    const { total } = await transactionsRepository.getBalance();

    if (type === 'outcome' && total < value) {
      throw new AppError('Not enough balance to make this transaction');
    }

    const newTransaction = transactionsRepository.create({
      title,
      value,
      type,
      categoryId: categoryMatched.id,
    });

    await transactionsRepository.save(newTransaction);

    return newTransaction;
  }
}

export default CreateTransactionService;
