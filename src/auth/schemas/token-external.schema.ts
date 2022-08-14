import { Types, Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Timestamps } from '@/@types/mongoose';

export type TokenExternalDocument = TokenExternal & Document<string> & Timestamps;

@Schema({ timestamps: true })
export class TokenExternal {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
    userId: string;

  @Prop({ required: true })
    token: string;

  @Prop({ required: true })
    ip: string;
}

export const TokenExternalSchema = SchemaFactory.createForClass(TokenExternal);
