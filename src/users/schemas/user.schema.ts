import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type UserDocument = User & Document;

export interface ExternalAccount {
  service: string;
  payload: any;
}

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
    firstName: string;

  @Prop({ required: true })
    lastName: string;

  @Prop()
    middleName: string;

  @Prop({ required: true })
    userName: string;

  @Prop({ required: true })
    email: string;

  @Prop({ required: true })
    dateOfBirth: Date;

  @Prop()
    externalAccounts: Array<ExternalAccount>;
}

export const UserSchema = SchemaFactory.createForClass(User);
