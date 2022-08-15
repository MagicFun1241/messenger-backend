import { Types, Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Timestamps } from '@/@types/mongoose';

export type SessionDocument = Session & Document<string> & Timestamps;

@Schema({ timestamps: true })
export class Session {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
    userId: string;

  @Prop({ required: true })
    token: string;

  @Prop({ required: true })
    lastIp: string;

  @Prop({ required: true, default: Date.now })
    lastActivityDateTime: Date;
}

export const SessionSchema = SchemaFactory.createForClass(Session);
