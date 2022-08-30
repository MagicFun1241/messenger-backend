import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { Document, Types, ObjectId } from 'mongoose';
import { Timestamps } from '@/@types/mongoose';
import { ChatDocument } from '@/chats/schemas/chats.schema';
import { UserDocument } from '@/users/schemas/user.schema';

export type MessageDocument = Message & Document<ObjectId> & Timestamps;

@Schema({ timestamps: true })
export class Message {
  @Prop()
    text?: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
    sender: UserDocument;

  @Prop({ type: Types.ObjectId, ref: 'Conversation', required: true })
    conversation: ChatDocument;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
