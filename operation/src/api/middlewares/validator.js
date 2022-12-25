const { body, param, validationResult } = require("express-validator");
const { ValidationError } = require("../../utils/error-handler");
const { AccountModel } = require("../../database/models");

const createAccountValidationRules = [
  body("branch", "Unable to Find the Branch").notEmpty().isString(),
  body("owner", "Unable to Find the Owner").notEmpty().isString(),
];

const getAccountValidationRules = [
  param("id", "Unable to Find the Account")
    .notEmpty()
    .custom(async (value) => {
      try {
        const account = await AccountModel.findOne({ _id: value });
        if (!account) {
          return Promise.reject("Unable to Find the Account");
        }
      } catch (err) {
        return Promise.reject("Unable to Find the Account");
      }
    }),
];

const getAccountsValidationRules = [
  param("page", "Unable to Find the Account")
    .notEmpty()
    .custom(async (value) => {
      if (JSON.parse(value) < 1) {
        return Promise.reject("Page number should be atleast 1");
      }
    }),
];

const deleteAccountValidationRules = [
  param("id", "Unable to Find the Account")
    .notEmpty()
    .custom(async (value) => {
      try {
        const account = await AccountModel.findOne({ _id: value });
        if (!account) {
          return Promise.reject("Unable to Find the Account");
        }
      } catch (err) {
        return Promise.reject("Unable to Find the Account");
      }
    }),
];

const createDirectTransactionValidationRules = [
  body("account", "Unable to Find the account")
    .notEmpty()
    .custom(async (value) => {
      try {
        const account = await AccountModel.findOne({ _id: value });
        if (!account) {
          return Promise.reject("Unable to Find the Account");
        }
      } catch (err) {
        return Promise.reject("Unable to Find the Account");
      }
    }),
  body("from", "Unable to Find the account")
    .notEmpty()
    .custom(async (value) => {
      try {
        const account = await AccountModel.findOne({ _id: value });
        if (!account) {
          return Promise.reject("Unable to Find the Account");
        }
      } catch (err) {
        return Promise.reject("Unable to Find the Account");
      }
    }),
  body("amount").notEmpty().isNumeric(),
];

const createInDirectTransactionValidationRules = [
  body("account", "Unable to Find the account")
    .notEmpty()
    .custom(async (value) => {
      try {
        const account = await AccountModel.findOne({ _id: value });
        if (!account) {
          return Promise.reject("Unable to Find the Account");
        }
      } catch (err) {
        return Promise.reject("Unable to Find the Account");
      }
    }),
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
  getAccountsValidationRules,
  deleteAccountValidationRules,
  validate,
};
