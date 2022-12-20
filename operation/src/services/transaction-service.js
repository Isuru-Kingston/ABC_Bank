const { TransactionRepository } = require("../database");
const { FormateData } = require("../utils");
const { APIError, STATUS_CODES } = require("../utils/app-errors");

// All Business logic will be here
class TransactionService {
  constructor() {
    this.repository = new TransactionRepository();
  }

  async CreateTransaction(userInputs) {
    try {
      const { account, isDirect, isWithdraw, from, balance, amount } =
        userInputs;

      const newTransaction = await this.repository.CreateTransaction({
        account,
        isDirect,
        isWithdraw,
        from,
        balance,
        amount,
      });

      return FormateData(newTransaction);
    } catch (err) {
      throw new APIError(
        "API Error",
        STATUS_CODES.INTERNAL_ERROR,
        "Unable to Create Transaction"
      );
    }
  }

  async GetTransaction(userInputs) {
    try {
      const { id } = userInputs;

      const transaction = await this.repository.FindTransaction({ id });

      return FormateData(transaction);
    } catch (err) {
      throw new APIError(
        "API Error",
        STATUS_CODES.INTERNAL_ERROR,
        "Unable to Find the Transaction"
      );
    }
  }

  async GetTransactionsByAccount(userInputs) {
    try {
      const { account } = userInputs;

      const transactions = await this.repository.FindTransactionsByAccount({
        account,
      });

      return FormateData(transactions);
    } catch (err) {
      throw new APIError(
        "API Error",
        STATUS_CODES.INTERNAL_ERROR,
        "Unable to Find the Transactions"
      );
    }
  }

  async GetTransactionsBySender(userInputs) {
    try {
      const { from } = userInputs;

      const transactions = await this.repository.FindTransactionsBySender({
        from,
      });

      return FormateData(transactions);
    } catch (err) {
      throw new APIError(
        "API Error",
        STATUS_CODES.INTERNAL_ERROR,
        "Unable to Find the Transactions"
      );
    }
  }
}

module.exports = TransactionService;
