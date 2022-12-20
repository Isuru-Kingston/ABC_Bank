const {
  createEmployeeValidationRules,
  getEmployeeValidationRules,
  UpdateEmployeeValidationRules,
  validate,
} = require("./middlewares/validator");
const EmployeeService = require("../services/employee-service");
const { AppError } = require("../utils/error-handler");
const { PublishMessage } = require("../utils");
const { EMPLOYEE_SERVICE } = require("../config");
const { BranchAuth, EmployeeAuth } = require("./middlewares/auth");

module.exports = (app, channel) => {
  const service = new EmployeeService();
  app.post(
    "/employee",
    BranchAuth,
    createEmployeeValidationRules,
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
          possition,
          branch,
          nic,
        } = req.body;
        const { data } = await service.CreateEmployee({
          email,
          phone,
          street,
          postalCode,
          city,
          country,
          possition,
          branch,
          nic,
        });
        PublishMessage(
          channel,
          EMPLOYEE_SERVICE,
          JSON.stringify({
            data: { id: data.employee_id, email, password, role: "staff" },
            event: "SIGN_UP",
          })
        );
        res.json(data);
      } catch (err) {
        new AppError(err.statusCode || 500, err.message, res).send();
      }
    }
  );
  app.get("/employee", BranchAuth, async (req, res, next) => {
    try {
      const { data } = await service.GetEmployees();
      res.json(data);
    } catch (err) {
      new AppError(err.statusCode || 500, err.message, res).send();
    }
  });
  app.get(
    "/employee/:id",
    EmployeeAuth,
    getEmployeeValidationRules,
    validate,
    async (req, res, next) => {
      try {
        const { id } = req.params;
        const { data } = await service.GetEmployee({ id });
        res.json(data);
      } catch (err) {
        new AppError(err.statusCode || 500, err.message, res).send();
      }
    }
  );
  app.put(
    "/employee/:id",
    EmployeeAuth,
    UpdateEmployeeValidationRules,
    validate,
    async (req, res, next) => {
      try {
        const { id } = req.params;
        const { phone, street, postalCode, city, country, possition, branch } =
          req.body;
        const { data } = await service.UpdateEmployee({
          id,
          phone,
          street,
          postalCode,
          city,
          country,
          possition,
          branch,
        });
        res.json(data);
      } catch (err) {
        new AppError(err.statusCode || 500, err.message, res).send();
      }
    }
  );
};
