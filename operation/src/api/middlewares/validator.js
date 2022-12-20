const { body, param, validationResult } = require("express-validator");
const { ValidationError } = require("../../utils/error-handler");

const createAccountValidationRules = [
  body("branch", "Unable to Find the Branch").notEmpty().isString(),
  body("owner", "Unable to Find the Owner").notEmpty().isString(),
];

const getAccountValidationRules = [
  param("id", "Unable to Find the Account").notEmpty().isMongoId(),
];

const createDirectTransactionValidationRules = [
  body("account", "Unable to Find the account").notEmpty().isMongoId(),
  body("from", "Unable to Find the account").notEmpty().isMongoId(),
  body("amount").notEmpty().isNumeric(),
];

const createInDirectTransactionValidationRules = [
  body("account", "Unable to Find the account").notEmpty().isMongoId(),
  body("isWithdraw").notEmpty().isBoolean(),
  body("amount").notEmpty().isNumeric(),
];

const getTransactionValidationRules = [
  param("id", "Unable to Find the Account").notEmpty().isMongoId(),
];

const getTransactionsByAccountValidationRules = [
  param("account", "Unable to Find the Account").notEmpty().isString(),
];

const getTransactionsBySenderValidationRules = [
  param("account", "Unable to Find the Account").notEmpty().isString(),
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
  createAccountValidationRules,
  getAccountValidationRules,
  createDirectTransactionValidationRules,
  createInDirectTransactionValidationRules,
  getTransactionValidationRules,
  getTransactionsByAccountValidationRules,
  getTransactionsBySenderValidationRules,
  validate,
};
