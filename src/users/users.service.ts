import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '@/users/schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  findOne(userId: string): Promise<UserDocument> {
    return new Promise(async (resolve, reject) => {
      try {
        resolve(await this.userModel.findById(userId).exec());
      } catch (e) {
        reject(e);
      }
    });
  }

  search(query: string): Promise<User[]> {
    return new Promise<User[]>(async (resolve, reject) => {
      try {
        resolve(await this.userModel.aggregate([
          {
            $addFields: {
              fullName: { $concat: ['$firstName', '$lastName', '$userName'] },
            },
          },
          {
            $search: { fullName: query },
          },
        ]));
      } catch (e) {
        reject(e);
      }
    });
  }

  delete(userId: string): Promise<void> {
    return new Promise(async (resolve) => {
      await this.userModel.deleteOne({
        _id: userId,
      });

      resolve();
    });
  }
}
