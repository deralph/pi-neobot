import mongoose from "mongoose";
const Schema = mongoose.Schema;
const schemaOptions = {
  timestamps: { createdAt: "createAt", updatedAt: "updateAt" },
};
const schema = new Schema(
  {
    uid: { type: String, required: true },
    receiverId: { type: String, default: "" },
    shipTo: { type: Object, default: "" },
    paymentTerms: { type: String, default: "" },
    poNumber: { type: String, rdefault: "" },
    notes: { type: String, default: "" },
    terms: { type: String, default: "" },
    taxType: { type: Number, default: 1 }, // 0: no tax, 1: percentage, 2: fixed
    discount: { type: Number, default: 0 },
    discountType: { type: Number, default: 1 }, // 0: no discount, 1: percentage, 2: fixed
    shipping: { type: Number, default: 0 },
    amountPaid: { type: Number, default: 0 },
    tip: { type: Number, default: 0 },
    status: { type: String, default: "draft" },
    paid: { type: Boolean, default: false },
    cancelled: { type: Boolean, default: false },
    downloadUrl: { type: String, default: "" },
    logoUrl: { type: String, default: "" },
    pi_payment_id: { type: String, default: "" },
    pi_payment_id_server: { type: String, default: "" },
    signature: { type: String, default: "" },
  },
  schemaOptions
);

const InvoicesModel = mongoose.model("invoices", schema);
export default InvoicesModel;
