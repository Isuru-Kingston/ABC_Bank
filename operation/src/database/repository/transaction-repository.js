const mongoose = require("mongoose");
const { TransactionModel } = require("../models");
const { APIError, STATUS_CODES } = require("../../utils/app-errors");

//Dealing with data base operations
class TransactionRepository {
  async CreateTransaction({
    account,
    isDirect,
    isWithdraw,
    from,
    balance,
    amount,
  }) {
    try {
      const transaction = new TransactionModel({
        account,
        isDirect,
        isWithdraw,
        from,
        balance,
        amount,
      });

      const transactionResult = await transaction.save();
      return transactionResult;
    } catch (err) {
      console.log(err);
      throw new APIError(
        "API Error",
        STATUS_CODES.INTERNAL_ERROR,
        "Unable to Create Transaction"
      );
    }
  }

  async FindTransaction({ id }) {
    try {
      const transaction = await TransactionModel.findById(id);

      return transaction;
    } catch (err) {
      throw new APIError(
        "API Error",
        STATUS_CODES.INTERNAL_ERROR,
        "Unable to Find the Transaction"
      );
    }
  }

  async FindTransactionsByAccount({ account }) {
    try {
      const transaction = await TransactionModel.find({ account });

      return transaction;
    } catch (err) {
      throw new APIError(
        "API Error",
        STATUS_CODES.INTERNAL_ERROR,
        "Unable to Find the Transaction"
      );
    }
  }

  async FindTransactionsBySender({ from }) {
    try {
      const transaction = await TransactionModel.find({ from });

      return transaction;
    } catch (err) {
      throw new APIError(
        "API Error",
        STATUS_CODES.INTERNAL_ERROR,
        "Unable to Find the Transaction"
      );
    }
  }
}

module.exports = TransactionRepository;
