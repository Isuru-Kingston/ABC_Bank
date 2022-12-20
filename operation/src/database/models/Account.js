const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const AccountSchema = new Schema(
  {
    branch: { type: String, require: true },
    owner: { type: String, require: true },
    createdBy: { type: String, require: true },
    balance: { type: Number, require: true },
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

module.exports = mongoose.model("account", AccountSchema);
