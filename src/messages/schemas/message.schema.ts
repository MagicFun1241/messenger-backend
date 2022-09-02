import {
  Prop, raw, Schema, SchemaFactory,
} from '@nestjs/mongoose';
import { Document, Types, ObjectId } from 'mongoose';
import { Timestamps } from '@/@types/mongoose';

import { ChatDocument } from '@/chats/schemas/chats.schema';
import { UserDocument } from '@/users/schemas/user.schema';

import { ApiChatContent } from '../@types/api/messages.type';

export type MessageDocument = Message & Document<ObjectId> & Timestamps;

@Schema({ timestamps: true })
export class Message {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
    sender: UserDocument;

  @Prop({ type: Types.ObjectId, ref: 'Chat', required: true })
    chat: ChatDocument;

  @Prop({ type: Types.ObjectId, ref: 'Chat' })
    replyToChat?: ChatDocument;

  @Prop(raw({
    text: { type: String },
  }))
    content: ApiChatContent;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
