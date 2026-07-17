import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @ApiProperty({ example: 'John Doe', description: 'User full name' })
  @Prop({ required: true })
  name: string;

  @ApiProperty({ example: 'john@example.com', description: 'User email' })
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
