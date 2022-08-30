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
  userId: string;
  joinedDate?: Date;
  inviterId?: string;
  kickedByUserId?: string;
}

export enum ChatPrivacy {
  public = 'public',
}

export type ChatDocument = Chat & Document<ObjectId> & Timestamps;

@Schema({ timestamps: true })
export class Chat {
  @Prop({ required: true })
    type: ChatType;

  @Prop(raw({
    userId: { type: [{ type: Types.ObjectId, ref: 'User' }], required: true },
    joinedDate: { type: Date },
    inviterId: { type: [{ type: Types.ObjectId, ref: 'User' }] },
    kickedByUserId: { type: [{ type: Types.ObjectId, ref: 'User' }] },
  }))
    members: Array<ChatMember>;

  @Prop()
    title?: string;

  @Prop()
    about?: string;

  @Prop()
    privacy?: ChatPrivacy;
}

export const ChatSchema = SchemaFactory.createForClass(Chat);
