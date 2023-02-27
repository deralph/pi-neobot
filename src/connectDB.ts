import { connect, set } from "mongoose";

const connectDB = (url: string) => {
  set("strictQuery", true);
  connect(url, () => console.log(`connected to db`));
};

export default connectDB;
