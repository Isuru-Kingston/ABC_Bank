const { body, param, validationResult } = require("express-validator");
const { CustomerModel, EmployeeModel } = require("../../database/models");
const { ValidationError } = require("../../utils/error-handler");

const createEmployeeValidationRules = [
  body("email")
    .isEmail()
    .notEmpty()
    .custom(async (value) => {
      const employee = await EmployeeModel.findOne({ email: value });
      if (employee) {
        return Promise.reject("E-mail already in use");
      }
    }),
  body("phone").isString().notEmpty(),
  body("password").isLength({ min: 5 }),
  body("street").isString().notEmpty(),
  body("postalCode").isString().notEmpty(),
  body("city").isString().notEmpty(),
  body("country").isString().notEmpty(),
  body("nic").isString().notEmpty(),
  body("possition").isString().notEmpty(),
  body("branch", "Invalid branch").notEmpty().isMongoId(),
];

const getEmployeeValidationRules = [
  param("id", "Unable to Find the Employee").notEmpty().isString(),
];

const UpdateEmployeeValidationRules = [
  param("id")
    .notEmpty()
    .custom(async (value) => {
      const employee = await EmployeeModel.findOne({ employee_id: value });
      if (!employee) {
        return Promise.reject("Can't find Employee");
      }
    }),
  body("phone").isString().notEmpty(),
  body("street").isString().notEmpty(),
  body("postalCode").isString().notEmpty(),
  body("city").isString().notEmpty(),
  body("country").isString().notEmpty(),
  body("possition").isString().notEmpty(),
  body("branch", "Invalid branch").notEmpty().isMongoId(),
];

const createCustomerValidationRules = [
  body("email")
    .isEmail()
    .notEmpty()
    .custom(async (value) => {
      const employee = await CustomerModel.findOne({ email: value });
      if (employee) {
        return Promise.reject("E-mail already in use");
      }
    }),
  body("phone").isString().notEmpty(),
  body("password").isLength({ min: 5 }),
  body("street").isString().notEmpty(),
  body("postalCode").isString().notEmpty(),
  body("city").isString().notEmpty(),
  body("country").isString().notEmpty(),
  body("nic").isString().notEmpty(),
];

const getCustomerValidationRules = [
  param("id", "Unable to Find the Customer").notEmpty().isString(),
];

const UpdateCustomerValidationRules = [
  param("id")
    .notEmpty()
    .custom(async (value) => {
      const employee = await EmployeeModel.findOne({ user_id: value });
      if (!employee) {
        return Promise.reject("Can't find Employee");
      }
    }),
  body("phone").isString().notEmpty(),
  body("street").isString().notEmpty(),
  body("postalCode").isString().notEmpty(),
  body("city").isString().notEmpty(),
  body("country").isString().notEmpty(),
];

const addAccountValidationRules = [
  param("id", "Unable to Find the Employee").notEmpty().isString(),
  body("accountId", "Invalid Account").notEmpty().isMongoId(),
];

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  const extractedErrors = [];
  errors.array().map((err) => extractedErrors.push({ [err.param]: err.msg }));

  return new ValidationError(
    extractedErrors[0][Object.keys(extractedErrors[0])[0]],
    res
  ).send();
};

module.exports = {
  createEmployeeValidationRules,
  getEmployeeValidationRules,
  UpdateEmployeeValidationRules,
  createCustomerValidationRules,
  getCustomerValidationRules,
  UpdateCustomerValidationRules,
  addAccountValidationRules,
  validate,
};
