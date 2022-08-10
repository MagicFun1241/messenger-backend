import * as mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { User } from '@/users/schemas/user.schema';

export type SessionDocument = Session & Document;

@Schema()
export class Session {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
    user: User;

  @Prop()
    accessToken: string;

  @Prop()
    refreshToken: string;

  @Prop()
    lastIp: string;

  @Prop()
    lastLoginDateTime: Date;
}

export const SessionSchema = SchemaFactory.createForClass(Session);
