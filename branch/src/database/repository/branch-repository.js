const mongoose = require("mongoose");
const { BranchModel } = require("../models");
const { APIError, STATUS_CODES } = require("../../utils/app-errors");

//Dealing with data base operations
class CustomerRepository {
  async CreateBranch({ email, phone, street, postalCode, city, country }) {
    try {
      let id = (await BranchModel.count()) + 1;
      const branch = new BranchModel({
        branch_id: "branch_" + id,
        email,
        phone,
        address: {
          street,
          postalCode,
          city,
          country,
        },
      });

      const branchResult = await branch.save();
      return branchResult;
    } catch (err) {
      console.log(err);
      throw new APIError(
        "API Error",
        STATUS_CODES.INTERNAL_ERROR,
        "Unable to Create Branch"
      );
    }
  }

  async FindBranch({ id }) {
    try {
      const branch = await BranchModel.findOne({ branch_id: id });

      return branch;
    } catch (err) {
      console.log(err);
      throw new APIError(
        "API Error",
        STATUS_CODES.INTERNAL_ERROR,
        "Unable to Find the Branch"
      );
    }
  }

  async FindBranches({ page }) {
    try {
      const branch = await BranchModel.find()
        .skip(10 * (page - 1))
        .limit(10)
        .select("-__v")
        .sort("createdAt");

      return branch;
    } catch (err) {
      console.log(err);
      throw new APIError(
        "API Error",
        STATUS_CODES.INTERNAL_ERROR,
        "Unable to Find the Branch"
      );
    }
  }
}

module.exports = CustomerRepository;
