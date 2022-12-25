const { BranchRepository } = require("../database");
const { FormateData } = require("../utils");
const { APIError, STATUS_CODES } = require("../utils/app-errors");

// All Business logic will be here
class CustomerService {
  constructor() {
    this.repository = new BranchRepository();
  }

  async CreateBranch(userInputs) {
    try {
      const { email, password, phone, street, postalCode, city, country } =
        userInputs;

      const newBranch = await this.repository.CreateBranch({
        email,
        phone,
        street,
        postalCode,
        city,
        country,
      });

      return FormateData(newBranch);
    } catch (err) {
      throw new APIError(
        "API Error",
        STATUS_CODES.INTERNAL_ERROR,
        "Unable to Create Branch"
      );
    }
  }

  async GetBranch(userInputs) {
    try {
      const { id } = userInputs;

      const branch = await this.repository.FindBranch({ id });

      return FormateData(branch);
    } catch (err) {
      throw new APIError(
        "API Error",
        STATUS_CODES.INTERNAL_ERROR,
        "Unable to Find the Branch"
      );
    }
  }

  async GetBranches(userInputs) {
    try {
      const { page } = userInputs;

      const branch = await this.repository.FindBranches({ page });

      return FormateData(branch);
    } catch (err) {
      throw new APIError(
        "API Error",
        STATUS_CODES.INTERNAL_ERROR,
        "Unable to Find the Branches"
      );
    }
  }
}

module.exports = CustomerService;
