import * as mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { User } from '@/users/schemas/user.schema';

export type SessionDocument = Session & Document;

@Schema({ timestamps: true })
export class Session {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
    user: User;

  @Prop({ required: true })
    accessToken: string;

  @Prop({ required: true })
    refreshToken: string;

  @Prop({ required: true })
    lastIp: string;

  @Prop({ required: true, default: Date.now })
    lastActivityDateTime: Date;
}

export const SessionSchema = SchemaFactory.createForClass(Session);
