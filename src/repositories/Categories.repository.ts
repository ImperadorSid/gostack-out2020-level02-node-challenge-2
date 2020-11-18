import { EntityRepository, Repository } from 'typeorm';

import Category from '../models/Category.model';

@EntityRepository(Category)
class CategoriesRepository extends Repository<Category> {
  async findOrCreate(title: string): Promise<Category> {
    const categoryMatched = await this.findOne({
      where: { title },
    });

    if (!categoryMatched) {
      const newCategory = this.create({ title });
      await this.save(newCategory);

      return newCategory;
    }

    return categoryMatched;
  }
}

export default CategoriesRepository;
