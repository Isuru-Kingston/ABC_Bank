const {
  createDirectTransactionValidationRules,
  createInDirectTransactionValidationRules,
  getTransactionValidationRules,
  getTransactionsByAccountValidationRules,
  getTransactionsBySenderValidationRules,
  validate,
} = require("./middlewares/validator");

const TransactionService = require("../services/transaction-service");
const AccountService = require("../services/account-service");
const { AppError } = require("../utils/error-handler");
const {
  EmployeeAuth,
  UserTransactionGetAuth,
  DirectTransactionAuth,
} = require("./middlewares/auth");

module.exports = (app) => {
  const transactionService = new TransactionService();
  const accountService = new AccountService();
  app.post(
    "/transaction/direct",
    DirectTransactionAuth,
    createDirectTransactionValidationRules,
    validate,
    async (req, res, next) => {
      try {
        const { account, from, amount } = req.body;
        await accountService.ChangeBalance({
          id: from,
          isWithdraw: true,
          amount,
        });
        const { data: updatedToAccount } = await accountService.ChangeBalance({
          id: account,
          isWithdraw: false,
          amount,
        });

        const { data } = await transactionService.CreateTransaction({
          account,
          isDirect: true,
          isWithdraw: false,
          from,
          balance: updatedToAccount.balance,
          amount,
        });
        res.json(data);
      } catch (err) {
        new AppError(err.statusCode || 500, err.message, res).send();
      }
    }
  );
  app.post(
    "/transaction/indirect",
    EmployeeAuth,
    createInDirectTransactionValidationRules,
    validate,
    async (req, res, next) => {
      try {
        const { account, isWithdraw, from, amount } = req.body;
        const { id } = req.user.id;
        const { data: updatedToAccount } = await accountService.ChangeBalance({
          id: account,
          isWithdraw,
          amount,
        });

        const { data } = await transactionService.CreateTransaction({
          account,
          isDirect: false,
          isWithdraw,
          from: id,
          balance: updatedToAccount.balance,
          amount,
        });
        res.json(data);
      } catch (err) {
        new AppError(err.statusCode || 500, err.message, res).send();
      }
    }
  );
  app.get(
    "/transaction/:id",
    EmployeeAuth,
    getTransactionValidationRules,
    validate,
    async (req, res, next) => {
      try {
        const { id } = req.params;
        const { data } = await transactionService.GetTransaction({ id });
        res.json(data);
      } catch (err) {
        new AppError(err.statusCode || 500, err.message, res).send();
      }
    }
  );
  app.get(
    "/transaction/by-account/:account",
    UserTransactionGetAuth,
    getTransactionsByAccountValidationRules,
    validate,
    async (req, res, next) => {
      try {
        const { account } = req.params;

        const { data } = await transactionService.GetTransactionsByAccount({
          account,
        });
        res.json(data);
      } catch (err) {
        new AppError(err.statusCode || 500, err.message, res).send();
      }
    }
  );
  app.get(
    "/transaction/by-sender/:account",
    UserTransactionGetAuth,
    getTransactionsBySenderValidationRules,
    validate,
    async (req, res, next) => {
      try {
        const { account } = req.params;

        const { data } = await transactionService.GetTransactionsBySender({
          from: account,
        });
        res.json(data);
      } catch (err) {
        new AppError(err.statusCode || 500, err.message, res).send();
      }
    }
  );
};
