const { EmployeeRepository } = require("../database");
const { FormateData, GeneratePassword, GenerateSalt } = require("../utils");
const { APIError, STATUS_CODES } = require("../utils/app-errors");

// All Business logic will be here
class EmployeeService {
  constructor() {
    this.repository = new EmployeeRepository();
  }

  async CreateEmployee(userInputs) {
    try {
      const {
        email,
        name,
        phone,
        street,
        postalCode,
        city,
        country,
        possition,
        branch,
        nic,
      } = userInputs;

      const newEmployee = await this.repository.CreateEmployee({
        email,
        name,
        phone,
        street,
        postalCode,
        city,
        country,
        possition,
        branch,
        nic,
      });

      return FormateData(newEmployee);
    } catch (err) {
      throw new APIError(
        "API Error",
        STATUS_CODES.INTERNAL_ERROR,
        "Unable to Create Employee"
      );
    }
  }

  async GetEmployee(userInputs) {
    try {
      const { id } = userInputs;

      const employee = await this.repository.FindEmployee({ id });

      return FormateData(employee);
    } catch (err) {
      throw new APIError(
        "API Error",
        STATUS_CODES.INTERNAL_ERROR,
        "Unable to Find the Employee"
      );
    }
  }

  async UpdateEmployee(userInputs) {
    try {
      const {
        id,
        name,
        phone,
        street,
        postalCode,
        city,
        country,
        possition,
        branch,
      } = userInputs;

      const employee = await this.repository.UpdateEmployee({
        id,
        name,
        phone,
        street,
        postalCode,
        city,
        country,
        possition,
        branch,
      });

      return FormateData(employee);
    } catch (err) {
      throw new APIError(
        "API Error",
        STATUS_CODES.INTERNAL_ERROR,
        "Unable to Update the Employee"
      );
    }
  }

  async DeleteEmployee(userInputs) {
    try {
      const { id } = userInputs;

      const employee = await this.repository.DeleteEmployee({
        id,
      });

      return FormateData(employee);
    } catch (err) {
      throw new APIError(
        "API Error",
        STATUS_CODES.INTERNAL_ERROR,
        "Unable to Update the Employee"
      );
    }
  }

  async GetEmployees(userInputs) {
    try {
      const { page, id } = userInputs;
      const employees = await this.repository.FindEmployees({ page, id });

      return FormateData(employees);
    } catch (err) {
      throw new APIError(
        "API Error",
        STATUS_CODES.INTERNAL_ERROR,
        "Unable to Find the Employees"
      );
    }
  }
}

module.exports = EmployeeService;
