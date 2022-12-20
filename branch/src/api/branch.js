const {
  createBranchValidationRules,
  getBranchValidationRules,
  validate,
} = require("./middlewares/validator");
const { BranchAuth } = require("./middlewares/auth");
const BranchService = require("../services/branch-service");
const { AppError } = require("../utils/error-handler");
const { PublishMessage } = require("../utils");
const { BRANCH_SERVICE } = require("../config");

module.exports = (app, channel) => {
  const service = new BranchService();

  app.post(
    "/",
    BranchAuth,
    createBranchValidationRules,
    validate,
    async (req, res, next) => {
      try {
        const { email, password, phone, street, postalCode, city, country } =
          req.body;
        const { data } = await service.CreateBranch({
          email,
          password,
          phone,
          street,
          postalCode,
          city,
          country,
        });

        PublishMessage(
          channel,
          BRANCH_SERVICE,
          JSON.stringify({
            data: { id: data.branch_id, email, password, role: "branch" },
            event: "SIGN_UP",
          })
        );
        res.json(data);
      } catch (err) {
        new AppError(err.statusCode || 500, err.message, res).send();
      }
    }
  );
  app.get(
    "/:id",
    BranchAuth,
    getBranchValidationRules,
    validate,
    async (req, res, next) => {
      try {
        const { id } = req.params;
        const { data } = await service.GetBranch({ id });
        res.json(data);
      } catch (err) {
        new AppError(err.statusCode || 500, err.message, res).send();
      }
    }
  );
};
