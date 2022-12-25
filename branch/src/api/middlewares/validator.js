const { body, param, validationResult } = require("express-validator");
const { BranchModel } = require("../../database/models");
const { ValidationError } = require("../../utils/error-handler");

const createBranchValidationRules = [
  body("email")
    .isEmail()
    .notEmpty()
    .custom(async (value) => {
      const branch = await BranchModel.findOne({ email: value });
      if (branch) {
        return Promise.reject("E-mail already in use");
      }
    }),
  body("phone").isString().notEmpty(),
  body("password").isLength({ min: 5 }),
  body("street").isString().notEmpty(),
  body("postalCode").isString().notEmpty(),
  body("city").isString().notEmpty(),
  body("country").isString().notEmpty(),
];

const getBranchValidationRules = [
  param("id", "Unable to Find the Branch")
    .notEmpty()
    .custom(async (value) => {
      const branch = await BranchModel.findOne({ branch_id: value });
      if (!branch) {
        return Promise.reject("Invalid branch Id");
      }
    }),
];

const getBranchesValidationRules = [
  param("page", "Page number should be atleast 1")
    .notEmpty()
    .custom(async (value) => {
      if (JSON.parse(value) < 1) {
        return Promise.reject("Page number should be atleast 1");
      }
    }),
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
  createBranchValidationRules,
  getBranchesValidationRules,
  getBranchValidationRules,
  validate,
};
