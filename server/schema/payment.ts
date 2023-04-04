import mongoose from "mongoose";
const Schema = mongoose.Schema;
const schemaOptions = {
  timestamps: { createdAt: "createAt", updatedAt: "updateAt" },
};
const schema = new Schema(
  {
    username: { type: String, required: true },
    uid: { type: String, required: true },
    paid: { type: Boolean, default: false },
    cancelled: { type: Boolean, default: false },
    pi_payment_id: { type: String, default: "" },
  },
  schemaOptions
);

const PaymentModel = mongoose.model("payments", schema);
export default PaymentModel;
