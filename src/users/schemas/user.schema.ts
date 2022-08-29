import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId, Types } from 'mongoose';
import { Timestamps } from '@/@types/mongoose';
import { ShortNameDocument } from '@/names/schemas/name.schema';

export type UserDocument = User & Document<ObjectId> & Timestamps;

export type UserType = 'userTypeRegular' | 'userTypeDeleted' | 'userTypeUnLinked' | 'userTypeUnknown';

export interface ExternalAccount { service: string, id: string }

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
    firstName: string;

  @Prop({ required: true })
    lastName: string;

  @Prop()
    middleName?: string;

  @Prop({
    type: Types.ObjectId,
    ref: 'ShortName',
    required: true,
    unique: true,
  })
    shortName: ShortNameDocument;

  @Prop()
    phoneNumber?: string;

  @Prop()
    photos?: string[];

  @Prop({ required: true, unique: true })
    email: string;

  @Prop({ required: true })
    dateOfBirth: Date;

  @Prop({ required: true })
    type: UserType;

  @Prop({ required: true, default: new Date() })
    lastActivity: Date;

  @Prop({ required: true, default: false })
    verified: boolean;

  @Prop({ default: [] })
    tags?: Array<string>;

  @Prop({ required: true })
    externalAccounts: Array<ExternalAccount>;
}

export const UserSchema = SchemaFactory.createForClass(User);
