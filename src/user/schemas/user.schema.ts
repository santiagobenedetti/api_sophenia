import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { WineRoleEnum } from '../enums';
import { Exclude } from 'class-transformer';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop({ required: true, unique: true })
  username: string;

  @Exclude()
  @Prop()
  password: string;

  @Prop({ required: true })
  fullname: string;

  // This refers to Gerencial / Operativo
  @Prop({
    type: String,
    required: true,
    enum: WineRoleEnum,
  })
  wineRole: WineRoleEnum;

  @Prop({ required: true, default: true })
  available: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
