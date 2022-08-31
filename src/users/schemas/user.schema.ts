import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId } from 'mongoose';
import { Timestamps } from '@/@types/mongoose';
// import { ShortNameDocument } from '@/names/schemas/name.schema';

export type UserDocument = User & Document<ObjectId> & Timestamps;

export type UserType = 'userTypeRegular' | 'userTypeDeleted' | 'userTypeUnLinked' | 'userTypeUnknown';

export interface ExternalAccount { service: string, id: string }

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
    firstName: string;

  @Prop({ required: true })
    userName: string;

  // @Prop({
  //   type: Types.ObjectId,
  //   ref: 'ShortName',
  //   required: true,
  //   unique: true,
  // })
  //   shortName: ShortNameDocument;

  @Prop({ required: true })
    type: UserType;

  @Prop()
    lastName?: string;

  @Prop({ unique: true })
    email?: string;

  @Prop()
    phoneNumber?: string;

  @Prop()
    photos?: string[];

  @Prop()
    dateOfBirth?: Date;

  @Prop({ default: new Date() })
    lastActivity?: Date;

  @Prop({ default: false })
    isVerified?: boolean;

  @Prop({ default: [] })
    tags?: Array<string>;

  @Prop()
    externalAccounts?: Array<ExternalAccount>;
}

export const UserSchema = SchemaFactory.createForClass(User);
