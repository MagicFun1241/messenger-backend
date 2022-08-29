import { Document, ObjectId, Types } from 'mongoose';
import { Timestamps } from '@/@types/mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { UserDocument } from '@/users/schemas/user.schema';

export type ShortNameDocument = ShortName & Document<ObjectId> & Timestamps;

@Schema({ timestamps: true })
export class ShortName {
  @Prop({ unique: true })
    value: string;

  @Prop({ type: Types.ObjectId, ref: 'User' })
    user?: UserDocument;

  // @Prop({ type: Types.ObjectId, ref: 'Bot' })
  //   bot?: BotDocument;
}

export const ShortNameSchema = SchemaFactory.createForClass(ShortName);
