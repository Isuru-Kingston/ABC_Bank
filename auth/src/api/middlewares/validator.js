const { body, validationResult } = require("express-validator");
const { ValidationError } = require("../../utils/error-handler");

const signInValidationRules = [
  body("id").isString().notEmpty(),
  body("password").isLength({ min: 5 }),
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
  signInValidationRules,
  validate,
};
