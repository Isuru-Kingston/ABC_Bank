const mongoose = require("mongoose");
const { EmployeeModel } = require("../models");
const { APIError, STATUS_CODES } = require("../../utils/app-errors");

//Dealing with data base operations
class EmployeeRepository {
  async CreateEmployee({
    email,
    phone,
    street,
    postalCode,
    city,
    country,
    possition,
    branch,
    nic,
  }) {
    try {
      let id = (await EmployeeModel.count()) + 1;
      const employee = new EmployeeModel({
        employee_id: "emp_" + id,
        email,
        phone,
        address: {
          street,
          postalCode,
          city,
          country,
        },
        possition,
        branch,
        nic,
      });

      const employeeResult = await employee.save();
      return employeeResult;
    } catch (err) {
      throw new APIError(
        "API Error",
        STATUS_CODES.INTERNAL_ERROR,
        "Unable to Create Emplyee"
      );
    }
  }

  async FindEmployee({ id }) {
    try {
      const employee = await EmployeeModel.findOne({ employee_id: id });

      return employee;
    } catch (err) {
      throw new APIError(
        "API Error",
        STATUS_CODES.INTERNAL_ERROR,
        "Unable to Find the Employee"
      );
    }
  }

  async UpdateEmployee({
    id,
    phone,
    street,
    postalCode,
    city,
    country,
    possition,
    branch,
  }) {
    try {
      const employee = await EmployeeModel.findOneAndUpdate(
        { employee_id: id },
        {
          phone,
          address: { street, postalCode, city, country },
          possition,
          branch,
        }
      );
      employee.phone = phone;
      employee.possition = possition;
      employee.branch = branch;
      employee.address.street = street;
      employee.address.postalCode = postalCode;
      employee.address.city = city;
      employee.address.country = country;

      return employee;
    } catch (err) {
      throw new APIError(
        "API Error",
        STATUS_CODES.INTERNAL_ERROR,
        "Unable to Update the Employee"
      );
    }
  }

  async FindEmployees() {
    try {
      const employees = await EmployeeModel.find()
        .select("-__v")
        .sort("createdAt");

      return employees;
    } catch (err) {
      throw new APIError(
        "API Error",
        STATUS_CODES.INTERNAL_ERROR,
        "Unable to Find the Employees"
      );
    }
  }
}

module.exports = EmployeeRepository;
