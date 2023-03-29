import { Schema, model } from "mongoose";
import { User, UserModel } from "../types/interfaces";

const userSchema = new Schema<User>({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  subscribedIn: {
    type: String,
  },
  expiresIn: {
    type: String,
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
userSchema.statics.subscribeUser = async function (username: string) {
  const expiresIn = new Date(
    new Date().setDate(new Date().getDate() + 30)
  ).toLocaleDateString();
  return await this.findOneAndUpdate(
    { username },
    {
      subscribedIn: new Date().toLocaleDateString(),
      expiresIn,
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
userSchema.statics.findAll = async function () {
  return await this.find({});
};

const model_ = model<User, UserModel>("user", userSchema);

export default model_;
