import { Schema, model } from "mongoose";
import { User, UserModel } from "../types/interfaces";

const userSchema = new Schema<User>({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  uid: {
    type: String,
    required: true,
    unique: true,
  },
  roles: {
    type: Array,
    required: true,
  },
  requestNo: {
    type: Number,
  },
});

userSchema.statics.findById = async function (username: string) {
  return await this.findOne({ username });
};
userSchema.statics.updateRequest = async function (
  username: string,
  num: number
) {
  return await this.findOneAndUpdate(
    { username },
    {
      requestNo: num,
    },
    {
      new: true,
      runValidators: true,
    }
  );
};
userSchema.statics.createUser = async function (body: User) {
  return await this.create(body);
};

const model_ = model<User, UserModel>("user", userSchema);

export default model_;
