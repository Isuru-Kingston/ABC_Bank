const { AccountRepository } = require("../database");
const { FormateData, GeneratePassword, GenerateSalt } = require("../utils");
const { APIError, STATUS_CODES } = require("../utils/app-errors");

// All Business logic will be here
class AccountService {
  constructor() {
    this.repository = new AccountRepository();
  }

  async CreateAccount(userInputs) {
    try {
      const { branch, owner, createdBy } = userInputs;

      const newAccount = await this.repository.CreateAccount({
        branch,
        owner,
        createdBy,
      });

      return FormateData(newAccount);
    } catch (err) {
      throw new APIError(
        "API Error",
        STATUS_CODES.INTERNAL_ERROR,
        "Unable to Create Account"
      );
    }
  }

  async GetAccount(userInputs) {
    try {
      const { id } = userInputs;

      const account = await this.repository.FindAccount({ id });

      return FormateData(account);
    } catch (err) {
      throw new APIError(
        "API Error",
        STATUS_CODES.INTERNAL_ERROR,
        "Unable to Find the Account"
      );
    }
  }

  async GetAccounts() {
    try {
      const accounts = await this.repository.FindAccounts();

      return FormateData(accounts);
    } catch (err) {
      throw new APIError(
        "API Error",
        STATUS_CODES.INTERNAL_ERROR,
        "Unable to Find the Accounts"
      );
    }
  }

  async ChangeBalance(userInputs) {
    try {
      const { id, isWithdraw, amount } = userInputs;
      let updatedAccount = null;
      const account = await this.repository.FindAccount({ id });

      if (isWithdraw) {
        if (account.balance - amount >= 0) {
          updatedAccount = await this.repository.changeBalance({
            id,
            currentBalance: account.balance - amount,
          });
        } else {
          throw new APIError(
            "API Error",
            STATUS_CODES.NOT_ACCEPTABLE,
            "Insufficient Balance"
          );
        }
      } else {
        updatedAccount = await this.repository.changeBalance({
          id,
          currentBalance: account.balance + amount,
        });
      }

      return FormateData(updatedAccount);
    } catch (err) {
      if (err.statusCode) {
        if (err.statusCode == 406) {
          throw new APIError(
            "API Error",
            STATUS_CODES.NOT_ACCEPTABLE,
            "Insufficient Balance"
          );
        } else {
          throw new APIError(
            "API Error",
            STATUS_CODES.INTERNAL_ERROR,
            "Unable to Update the Account Balance"
          );
        }
      } else {
        throw new APIError(
          "API Error",
          STATUS_CODES.INTERNAL_ERROR,
          "Unable to Update the Account Balance"
        );
      }
    }
  }
}

module.exports = AccountService;
