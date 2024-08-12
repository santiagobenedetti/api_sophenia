import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { WineRoleEnum } from '../enums';
import { Exclude } from 'class-transformer';
import { RolesEnum } from 'src/auth/enums';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  _id: Types.ObjectId;

  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: true, unique: true })
  email: string;

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

  @Prop({
    type: [String],
    required: true,
    enum: RolesEnum,
  })
  roles: RolesEnum[];
}

export const UserSchema = SchemaFactory.createForClass(User);
