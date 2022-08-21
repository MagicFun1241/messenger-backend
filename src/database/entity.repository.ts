import {
  Document, FilterQuery, Model, UpdateQuery,
} from 'mongoose';

export abstract class EntityRepository<T extends Document> {
  constructor(protected readonly EntityModel: Model<T>) {}

  async findOne(
    entityFilterQuery: FilterQuery<T>,
    projection?: Record<string, unknown>,
  ): Promise<T | null> {
    return this.EntityModel.findOne(entityFilterQuery, {
      _id: 0,
      __v: 0,
      ...projection,
    }).exec();
  }

  async find(
    entityFilterQuery: FilterQuery<T>,
  ): Promise<T[] | null> {
    return this.EntityModel.find(entityFilterQuery);
  }

  async create(createEntityData: unknown): Promise<T> {
    const entity = new this.EntityModel(createEntityData);
    return entity.save();
  }

  async findOneAndUpdate(
    entityFilterQuery: FilterQuery<T>,
    updateEntityData: UpdateQuery<unknown>,
  ): Promise<T | null> {
    return this.EntityModel.findOneAndUpdate(
      entityFilterQuery,
      updateEntityData,
      {
        new: true,
      },
    );
  }

  async deleteMany(entityFilterQuery: FilterQuery<T>): Promise<boolean> {
    const deleteResult = await this.EntityModel.deleteMany(entityFilterQuery);
    return deleteResult.deletedCount >= 1;
  }
}
