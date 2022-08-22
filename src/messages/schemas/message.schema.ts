import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class Message {
  @Prop()
    text?: string;

  @Prop()
    sender: string;

  @Prop()
    conversation: string;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
