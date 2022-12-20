const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const AuthSchema = new Schema(
  {
    user_name: { type: String, require: true, unique: true },
    email: { type: String, require: true },
    password: { type: String, require: true },
    salt: { type: String, require: true },
    role: { type: String, enum: ["branch", "staff", "user"], default: "user" },
  },
  {
    toJSON: {
      transform(doc, ret) {
        delete ret.password;
        delete ret.__v;
      },
    },
    timestamps: true,
  }
);

module.exports = mongoose.model("auth", AuthSchema);
