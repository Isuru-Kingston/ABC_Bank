const {
  createCustomerValidationRules,
  getCustomerValidationRules,
  UpdateCustomerValidationRules,
  addAccountValidationRules,
  validate,
} = require("./middlewares/validator");
const CustomerService = require("../services/customer-service");
const { AppError } = require("../utils/error-handler");
const { SubscribeMessage, PublishMessage } = require("../utils");
const { ACCOUNT_SERVICE, CUSTOMER_SERVICE } = require("../config");
const { UserAuth, EmployeeUserAuth } = require("./middlewares/auth");

module.exports = (app, channel) => {
  const service = new CustomerService();

  SubscribeMessage(channel, service, ACCOUNT_SERVICE);

  app.post(
    "/customer",
    UserAuth,
    createCustomerValidationRules,
    validate,
    async (req, res, next) => {
      try {
        const {
          email,
          password,
          phone,
          street,
          postalCode,
          city,
          country,
          nic,
        } = req.body;
        const { data } = await service.CreateCustomer({
          email,
          phone,
          street,
          postalCode,
          city,
          country,
          nic,
        });
        PublishMessage(
          channel,
          CUSTOMER_SERVICE,
          JSON.stringify({
            data: { id: data.user_id, email, password, role: "user" },
            event: "SIGN_UP",
          })
        );
        res.json(data);
      } catch (err) {
        new AppError(err.statusCode || 500, err.message, res).send();
      }
    }
  );
  app.get("/customer", UserAuth, async (req, res, next) => {
    try {
      const { data } = await service.GetCustomers();
      res.json(data);
    } catch (err) {
      new AppError(err.statusCode || 500, err.message, res).send();
    }
  });
  app.get(
    "/customer/:id",
    EmployeeUserAuth,
    getCustomerValidationRules,
    validate,
    async (req, res, next) => {
      try {
        const { id } = req.params;
        const { data } = await service.GetCustomer({ id });
        res.json(data);
      } catch (err) {
        new AppError(err.statusCode || 500, err.message, res).send();
      }
    }
  );
  app.put(
    "/customer/:id",
    EmployeeUserAuth,
    UpdateCustomerValidationRules,
    validate,
    async (req, res, next) => {
      try {
        const { id } = req.params;
        const { phone, street, postalCode, city, country } = req.body;
        const { data } = await service.UpdateCustomer({
          id,
          phone,
          street,
          postalCode,
          city,
          country,
        });
        res.json(data);
      } catch (err) {
        new AppError(err.statusCode || 500, err.message, res).send();
      }
    }
  );
  app.post(
    "/customer/account/:id",
    EmployeeUserAuth,
    addAccountValidationRules,
    validate,
    async (req, res, next) => {
      try {
        const { id } = req.params;
        const { accountId } = req.body;
        const { data } = await service.AddAccount({
          id,
          accountId,
        });
        res.json(data);
      } catch (err) {
        new AppError(err.statusCode || 500, err.message, res).send();
      }
    }
  );
};
