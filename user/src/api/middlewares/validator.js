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
  body("name").isString().notEmpty(),
  body("password").isLength({ min: 5 }),
  body("street").isString().notEmpty(),
  body("postalCode").isString().notEmpty(),
  body("city").isString().notEmpty(),
  body("country").isString().notEmpty(),
  body("nic").isString().notEmpty(),
  body("possition").isString().notEmpty(),
];

const getEmployeeValidationRules = [
  param("id", "Unable to Find the Employee")
    .notEmpty()
    .isString()
    .matches(/^emp_\d+$/),
];

const getEmployeesValidationRules = [
  param("page", "Unable to Find the Employee")
    .notEmpty()
    .custom(async (value) => {
      if (JSON.parse(value) < 1) {
        return Promise.reject("Page number should be atleast 1");
      }
    }),
];

const UpdateEmployeeValidationRules = [
  param("id")
    .notEmpty()
    .isString()
    .matches(/^emp_\d+$/)
    .custom(async (value) => {
      const employee = await EmployeeModel.findOne({ employee_id: value });
      if (!employee) {
        return Promise.reject("Can't find Employee");
      }
    }),
  body("phone").isString().notEmpty(),
  body("name").isString().notEmpty(),
  body("street").isString().notEmpty(),
  body("postalCode").isString().notEmpty(),
  body("city").isString().notEmpty(),
  body("country").isString().notEmpty(),
  body("possition").isString().notEmpty(),
  body("branch", "Invalid branch")
    .notEmpty()
    .isString()
    .matches(/^branch_\d+$/),
];

const DeleteEmployeeValidationRules = [
  param("id")
    .notEmpty()
    .isString()
    .matches(/^emp_\d+$/)
    .custom(async (value) => {
      const employee = await EmployeeModel.findOne({ employee_id: value });
      if (!employee) {
        return Promise.reject("Can't find Employee");
      }
    }),
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
  body("name").isString().notEmpty(),
  body("password").isLength({ min: 5 }),
  body("street").isString().notEmpty(),
  body("postalCode").isString().notEmpty(),
  body("city").isString().notEmpty(),
  body("country").isString().notEmpty(),
  body("nic").isString().notEmpty(),
];

const getCustomerValidationRules = [
  param("id", "Unable to Find the Customer")
    .notEmpty()
    .isString()
    .matches(/^user_\d+$/),
];

const UpdateCustomerValidationRules = [
  param("id")
    .notEmpty()
    .matches(/^user_\d+$/)
    .custom(async (value) => {
      const employee = await EmployeeModel.findOne({ user_id: value });
      if (!employee) {
        return Promise.reject("Can't find User");
      }
    }),
  body("phone").isString().notEmpty(),
  body("name").isString().notEmpty(),
  body("street").isString().notEmpty(),
  body("postalCode").isString().notEmpty(),
  body("city").isString().notEmpty(),
  body("country").isString().notEmpty(),
];

const DeleteCustomerValidationRules = [
  param("id")
    .notEmpty()
    .matches(/^user_\d+$/)
    .custom(async (value) => {
      const employee = await EmployeeModel.findOne({ user_id: value });
      if (!employee) {
        return Promise.reject("Can't find User");
      }
    }),
];

const getCustomersValidationRules = [
  param("page", "Unable to Find the Employee")
    .notEmpty()
    .custom(async (value) => {
      if (JSON.parse(value) < 1) {
        return Promise.reject("Page number should be atleast 1");
      }
    }),
];

const addAccountValidationRules = [
  param("id", "Unable to Find the User")
    .notEmpty()
    .isString()
    .matches(/^user_\d+$/),
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
  getEmployeesValidationRules,
  UpdateEmployeeValidationRules,
  createCustomerValidationRules,
  getCustomerValidationRules,
  UpdateCustomerValidationRules,
  addAccountValidationRules,
  DeleteEmployeeValidationRules,
  getCustomersValidationRules,
  DeleteCustomerValidationRules,
  validate,
};
