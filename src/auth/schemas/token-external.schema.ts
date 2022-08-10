import mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type TokenExternalDocument = TokenExternal & Document;

@Schema({ timestamps: true })
export class TokenExternal {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
    user: number;

  @Prop({ required: true })
    token: string;

  @Prop({ required: true })
    ip: string;
}

export const TokenExternalSchema = SchemaFactory.createForClass(TokenExternal);
