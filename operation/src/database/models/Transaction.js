const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const TransactionSchema = new Schema(
  {
    account: { type: mongoose.ObjectId, require: true },
    isDirect: { type: Boolean, require: true },
    isWithdraw: { type: Boolean, require: true },
    from: { type: String, require: true },
    balance: { type: Number, require: true },
    amount: { type: Number, require: true },
  },
  {
    toJSON: {
      transform(doc, ret) {
        delete ret.__v;
      },
    },
    timestamps: true,
  }
);

module.exports = mongoose.model("transaction", TransactionSchema);
