import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import mongoose, { Document } from 'mongoose';
import { Timestamps } from '@/@types/mongoose';
import { ConversationDocument } from '@/conversations/schemas/conversation.schema';
import { UserDocument } from '@/users/schemas/user.schema';

export type MessageDocument = Message & Document<string> & Timestamps;

@Schema({ timestamps: true })
export class Message {
  @Prop()
    text?: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
    sender: UserDocument;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Conversation', required: true })
    conversation: ConversationDocument;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
