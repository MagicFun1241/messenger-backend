import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ShortName, ShortNameDocument } from '@/names/schemas/name.schema';

@Injectable()
export class NamesService {
  constructor(
    @InjectModel(ShortName.name) private nameModel: Model<ShortNameDocument>,
  ) {}

  async findByValue(text: string) {
    return this.nameModel.findOne({ value: text }).populate('user', ['_id']);
  }
}
