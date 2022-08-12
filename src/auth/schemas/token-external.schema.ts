import { Schema as MongooseSchema, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type TokenExternalDocument = TokenExternal & Document;

@Schema({ timestamps: true })
export class TokenExternal {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
    user: Types.ObjectId;

  @Prop({ required: true })
    token: string;

  @Prop({ required: true })
    ip: string;
}

export const TokenExternalSchema = SchemaFactory.createForClass(TokenExternal);
