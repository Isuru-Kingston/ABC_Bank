const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const EmployeeSchema = new Schema(
  {
    employee_id: { type: String, require: true, unique: true },
    email: { type: String, require: true },
    phone: { type: String, require: true },
    address: {
      street: { type: String, require: true },
      postalCode: { type: String, require: true },
      city: { type: String, require: true },
      country: { type: String, require: true },
    },
    possition: { type: String, require: true },
    branch: { type: mongoose.ObjectId, require: true },
    nic: { type: String, require: true },
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

module.exports = mongoose.model("employee", EmployeeSchema);
