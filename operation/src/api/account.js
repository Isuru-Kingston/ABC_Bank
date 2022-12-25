const {
  createAccountValidationRules,
  getAccountValidationRules,
  getAccountsValidationRules,
  deleteAccountValidationRules,
  validate,
} = require("./middlewares/validator");

const AccountService = require("../services/account-service");
const { AppError } = require("../utils/error-handler");
const { PublishMessage, RPCRequest } = require("../utils");
const { ACCOUNT_SERVICE, ACCOUNT_RPC } = require("../config");
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

        await RPCRequest(
          ACCOUNT_RPC,
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
  app.get(
    "/accounts/:page",
    EmployeeAuth,
    getAccountsValidationRules,
    validate,
    async (req, res, next) => {
      try {
        const { page } = req.params;
        const { data } = await service.GetAccounts({ page });
        res.json(data);
      } catch (err) {
        new AppError(err.statusCode || 500, err.message, res).send();
      }
    }
  );

  app.delete(
    "/account/:id",
    EmployeeAuth,
    deleteAccountValidationRules,
    validate,
    async (req, res, next) => {
      try {
        const { id } = req.params;
        const { data } = await service.DeleteAccount({ id });
        res.json(data);
      } catch (err) {
        new AppError(err.statusCode || 500, err.message, res).send();
      }
    }
  );
};
