import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import mongoose, { Document } from 'mongoose';
import { Timestamps } from '@/@types/mongoose';
import { ConversationDocument } from '@/conversations/schemas/conversation.schema';

export type MessageDocument = Message & Document<string> & Timestamps;

@Schema({ timestamps: true })
export class Message {
  @Prop()
    text?: string;

  @Prop({ required: true })
    sender: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Conversation', required: true })
    conversation: ConversationDocument;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
