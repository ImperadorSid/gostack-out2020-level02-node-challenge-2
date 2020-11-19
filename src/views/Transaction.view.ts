import Transaction from '../models/Transaction';

export default {
  render(transaction: Transaction): Omit<Transaction, 'categoryId'> {
    return {
      id: transaction.id,
      title: transaction.title,
      value: transaction.value,
      type: transaction.type,
      category: transaction.category,
      createdAt: transaction.createdAt,
      updatedAt: transaction.updatedAt,
    };
  },
  renderAll(transactions: Transaction[]): Omit<Transaction, 'categoryId'>[] {
    return transactions.map(this.render);
  },
};
