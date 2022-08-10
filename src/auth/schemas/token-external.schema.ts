import mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { User } from '@/users/schemas/user.schema';

export type TokenExternalDocument = TokenExternal & Document;

@Schema()
export class TokenExternal {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
    user: User;

  @Prop()
    token: string;

  @Prop()
    ip: string;
}

export const TokenExternalSchema = SchemaFactory.createForClass(TokenExternal);
