import {
  Prop, Schema, SchemaFactory, raw,
} from '@nestjs/mongoose';
import { Document, ObjectId, Types } from 'mongoose';
import { Timestamps } from '@/@types/mongoose';
import { UserDocument } from '@/users/schemas/user.schema';

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
  userId: Types.ObjectId | UserDocument
  ;
  joinedDate?: Date;
  inviterId?: Types.ObjectId;
  kickedByUserId?: Types.ObjectId;
}

export interface ChatFullInfo {
  about?: string;
  onlineCount?: number;
  members: ChatMember[];
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
    about: { type: String },
    onlineCount: { type: Number },
    members: [{
      userId: { type: Types.ObjectId, ref: 'User', required: true },
      joinedDate: { type: Date },
      inviterId: { type: Types.ObjectId, ref: 'User' },
      kickedByUserId: { type: Types.ObjectId, ref: 'User' },
    }],
  }))
    fullInfo: ChatFullInfo;

  @Prop()
    title?: string;

  @Prop()
    about?: string;

  @Prop()
    privacy?: ChatPrivacy;
}

export const ChatSchema = SchemaFactory.createForClass(Chat);
