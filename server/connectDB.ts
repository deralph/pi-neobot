import { connect, set } from "mongoose";

const connectDB = () => {
  set("strictQuery", true);
  connect(
    'mongodb+srv://raphael:ralph@nodeexpressprojecttaskm.mzoibkt.mongodb.net/PI-NEOBOT?retryWrites=true&w=majority',
    () => console.log(`connected to db`)
  );
};

export default connectDB;
