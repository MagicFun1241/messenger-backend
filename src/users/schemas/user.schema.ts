import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId } from 'mongoose';
import { Timestamps } from '@/@types/mongoose';

export type UserDocument = User & Document<ObjectId> & Timestamps;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
    firstName: string;

  @Prop({ required: true })
    lastName: string;

  @Prop()
    middleName?: string;

  @Prop()
    photos?: string[];

  @Prop({ required: true, unique: true })
    userName: string;

  @Prop({ required: true, unique: true })
    email: string;

  @Prop({ required: true })
    dateOfBirth: Date;

  @Prop({ required: true })
    type: 'userTypeBot' | 'userTypeRegular'
  | 'userTypeDeleted' | 'userTypeUnLinked' | 'userTypeUnknown';

  @Prop({ required: true, default: new Date() })
    wasOnline: Date;

  @Prop({ required: true, default: false })
    isVerified: boolean;

  @Prop()
    phoneNumber?: string;

  @Prop({ default: [] })
    tags?: Array<string>;

  @Prop({ required: true })
    externalAccounts: Array<{ service: string, id: string }>;
}

export const UserSchema = SchemaFactory.createForClass(User);
