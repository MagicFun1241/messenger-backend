import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Timestamps } from '@/@types/mongoose';

export type UserDocument = User & Document<string> & Timestamps;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
    firstName: string;

  @Prop({ required: true })
    lastName: string;

  @Prop()
    middleName: string;

  @Prop()
    photo?: string;

  @Prop({ required: true, unique: true })
    userName: string;

  @Prop({ required: true, unique: true })
    email: string;

  @Prop({ required: true })
    dateOfBirth: Date;

  @Prop({ default: [] })
    tags?: Array<string>;

  @Prop({ required: true })
    externalAccounts: Array<{ service: string, id: string }>;
}

export const UserSchema = SchemaFactory.createForClass(User);
