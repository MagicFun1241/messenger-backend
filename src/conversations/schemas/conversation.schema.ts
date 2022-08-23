import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Timestamps } from '@/@types/mongoose';
import { MessageDocument } from '@/messages/schemas/message.schema';
import { UserDocument } from '@/users/schemas/user.schema';

export enum ConversationType {
  direct = 'direct',
  group = 'group',
}

export enum GroupAccess {
  public = 'public',
}

export enum Role {
  basic,
  administrator,
  creator,
}

export interface ConversationRole {
  user?: string;
  bot?: string;
  value: Role;
}

export type ConversationDocument = Conversation & Document<string> & Timestamps;

@Schema({ timestamps: true })
export class Conversation {
  @Prop({ required: true })
    type: ConversationType;

  @Prop()
    name: string;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], required: true })
    members: Array<UserDocument>;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Message' })
    lastMessage: MessageDocument;

  @Prop()
    roles?: Array<ConversationRole>;

  @Prop()
    groupAccess?: GroupAccess;
}

export const ConversationSchema = SchemaFactory.createForClass(Conversation);
