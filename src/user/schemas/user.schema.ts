import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { WineRoleEnum } from '../enums';
import { Exclude } from 'class-transformer';
import { RolesEnum } from 'src/auth/enums';
import { UserStatusEnum } from 'src/auth/enums/userStatus.enum';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  _id: Types.ObjectId;

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

  @Prop({
    type: [String],
    required: true,
    enum: RolesEnum,
  })
  roles: RolesEnum[];

  @Prop({ required: true, default: UserStatusEnum.ACTIVE })
  status: UserStatusEnum;
}

export const UserSchema = SchemaFactory.createForClass(User);
