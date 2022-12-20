const {
  createAccountValidationRules,
  getAccountValidationRules,
  validate,
} = require("./middlewares/validator");

const AccountService = require("../services/account-service");
const { AppError } = require("../utils/error-handler");
const { PublishMessage } = require("../utils");
const { ACCOUNT_SERVICE } = require("../config");
const { EmployeeAuth, UserAuth } = require("./middlewares/auth");

module.exports = (app, channel) => {
  const service = new AccountService();
  app.post(
    "/account",
    EmployeeAuth,
    createAccountValidationRules,
    validate,
    async (req, res, next) => {
      try {
        const { branch, owner, createdBy } = req.body;
        const { id } = req.user.id;
        const { data } = await service.CreateAccount({
          branch,
          owner,
          createdBy: id,
        });

        PublishMessage(
          channel,
          ACCOUNT_SERVICE,
          JSON.stringify({
            data: { id: owner, accountId: data._id },
            event: "ADD_ACCOUNT_TO_USER",
          })
        );
        res.json(data);
      } catch (err) {
        new AppError(err.statusCode || 500, err.message, res).send();
      }
    }
  );
  app.get(
    "/account/:id",
    UserAuth,
    getAccountValidationRules,
    validate,
    async (req, res, next) => {
      try {
        const { id } = req.params;
        const { data } = await service.GetAccount({ id });
        res.json(data);
      } catch (err) {
        new AppError(err.statusCode || 500, err.message, res).send();
      }
    }
  );
  app.get("/account", EmployeeAuth, async (req, res, next) => {
    try {
      const { data } = await service.GetAccounts();
      res.json(data);
    } catch (err) {
      new AppError(err.statusCode || 500, err.message, res).send();
    }
  });
};
