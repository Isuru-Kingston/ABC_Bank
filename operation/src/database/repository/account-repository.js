const mongoose = require("mongoose");
const { AccountModel } = require("../models");
const { APIError, STATUS_CODES } = require("../../utils/app-errors");

//Dealing with data base operations
class AccountRepository {
  async CreateAccount({ branch, owner, createdBy }) {
    try {
      const account = new AccountModel({
        branch,
        owner,
        createdBy,
        balance: 0,
        is_active: true,
      });

      const accountResult = await account.save();
      return accountResult;
    } catch (err) {
      console.log(err);
      throw new APIError(
        "API Error",
        STATUS_CODES.INTERNAL_ERROR,
        "Unable to Create Account"
      );
    }
  }

  async FindAccount({ id }) {
    try {
      const account = await AccountModel.findOne({ _id: id });
      return account;
    } catch (err) {
      throw new APIError(
        "API Error",
        STATUS_CODES.INTERNAL_ERROR,
        "Unable to Find the Account"
      );
    }
  }

  async FindAccounts({ page }) {
    try {
      const accounts = await AccountModel.find()
        .skip(10 * (page - 1))
        .limit(10)
        .select("-__v")
        .sort("createdAt");

      return accounts;
    } catch (err) {
      throw new APIError(
        "API Error",
        STATUS_CODES.INTERNAL_ERROR,
        "Unable to Find the Accounts"
      );
    }
  }

  async DeleteAccount({ id }) {
    try {
      const account = await AccountModel.findOneAndUpdate(
        { _id: id },
        {
          is_active: false,
        }
      );

      account.is_active = false;

      return account;
    } catch (err) {
      throw new APIError(
        "API Error",
        STATUS_CODES.INTERNAL_ERROR,
        "Unable to Update the Customer"
      );
    }
  }

  async changeBalance({ id, currentBalance }) {
    try {
      const account = await AccountModel.findByIdAndUpdate(id, {
        balance: currentBalance,
      });

      account.balance = currentBalance;

      return account;
    } catch (err) {
      throw new APIError(
        "API Error",
        STATUS_CODES.INTERNAL_ERROR,
        "Unable to Update the Account Balance"
      );
    }
  }
}

module.exports = AccountRepository;
