const { signInValidationRules, validate } = require("./middlewares/validator");
const AuthService = require("../services/auth-service");
const { AppError } = require("../utils/error-handler");
const { SubscribeMessage } = require("../utils");
const {
  BRANCH_SERVICE,
  EMPLOYEE_SERVICE,
  CUSTOMER_SERVICE,
} = require("../config");

module.exports = (app, channel) => {
  const service = new AuthService();

  SubscribeMessage(channel, service, BRANCH_SERVICE);
  SubscribeMessage(channel, service, EMPLOYEE_SERVICE);
  SubscribeMessage(channel, service, CUSTOMER_SERVICE);

  app.post(
    "/signin",
    signInValidationRules,
    validate,
    async (req, res, next) => {
      try {
        const { id, password } = req.body;
        const { data } = await service.SignIn({
          id,
          password,
        });
        res.json(data);
      } catch (err) {
        new AppError(err.statusCode || 500, err.message, res).send();
      }
    }
  );
};
