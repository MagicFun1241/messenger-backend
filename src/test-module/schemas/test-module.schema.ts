import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type TestModuleDocument = TestModule & Document;

@Schema()
export class TestModule {
  @Prop()
    name: string;

  @Prop()
    surname: string;

  @Prop()
    age: number;
}

export const TestModuleSchema = SchemaFactory.createForClass(TestModule);
