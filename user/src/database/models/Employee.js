const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const EmployeeSchema = new Schema(
  {
    employee_id: { type: String, require: true, unique: true },
    name: { type: String, require: true },
    email: { type: String, require: true },
    phone: { type: String, require: true },
    address: {
      street: { type: String, require: true },
      postalCode: { type: String, require: true },
      city: { type: String, require: true },
      country: { type: String, require: true },
    },
    possition: { type: String, require: true },
    branch: { type: String, require: true },
    nic: { type: String, require: true },
    is_active: { type: Boolean, require: true },
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
