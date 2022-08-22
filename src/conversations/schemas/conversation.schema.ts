import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class Conversation {
  @Prop()
    members: Array<string>;
}

export const ConversationSchema = SchemaFactory.createForClass(Conversation);
