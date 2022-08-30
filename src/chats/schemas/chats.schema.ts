import {
  Prop, Schema, SchemaFactory, raw,
} from '@nestjs/mongoose';
import { Document, ObjectId, Types } from 'mongoose';
import { Timestamps } from '@/@types/mongoose';

// TODO: Оставить одно определение
export type ChatType = (
  'chatTypePrivate' | 'chatTypeSecret' |
  'chatTypeBasicGroup' | 'chatTypeSuperGroup' |
  'chatTypeChannel'
  );

export enum ChatTypeEnum {
  chatTypePrivate = 'chatTypePrivate',
  chatTypeSecret = 'chatTypeSecret',
  chatTypeBasicGroup = 'chatTypeBasicGroup',
  chatTypeSuperGroup = 'chatTypeSuperGroup',
  chatTypeChannel = 'chatTypeChannel',
}

export interface ChatMember {
  userId: Types.ObjectId;
  joinedDate?: Date;
  inviterId?: Types.ObjectId;
  kickedByUserId?: Types.ObjectId;
}

export enum ChatPrivacy {
  public = 'public',
}

export type ChatDocument = Chat & Document<ObjectId> & Timestamps;

@Schema({ timestamps: true })
export class Chat {
  @Prop({ required: true })
    type: ChatType;

  @Prop(raw([{
    userId: { type: Types.ObjectId, ref: 'User', required: true },
    joinedDate: { type: Date },
    inviterId: { type: Types.ObjectId, ref: 'User' },
    kickedByUserId: { type: Types.ObjectId, ref: 'User' },
  }]))
    members: Array<ChatMember>;

  @Prop()
    title?: string;

  @Prop()
    about?: string;

  @Prop()
    privacy?: ChatPrivacy;
}

export const ChatSchema = SchemaFactory.createForClass(Chat);
