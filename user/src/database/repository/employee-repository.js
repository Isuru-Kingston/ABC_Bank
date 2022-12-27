const mongoose = require("mongoose");
const { EmployeeModel } = require("../models");
const { APIError, STATUS_CODES } = require("../../utils/app-errors");

//Dealing with data base operations
class EmployeeRepository {
  async CreateEmployee({
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
  }) {
    try {
      let id = (await EmployeeModel.count()) + 1;
      const employee = new EmployeeModel({
        employee_id: "emp_" + id,
        name,
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
        is_active: true,
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
    name,
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
          name,
        }
      );
      employee.phone = phone;
      employee.name = name;
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

  async FindEmployees({ page, id }) {
    try {
      console.log("id.....", id);
      const employees = await EmployeeModel.find({
        branch: id,
        // is_active: true,
      })
        .skip(10 * (page - 1))
        .limit(10)
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

  async DeleteEmployee({ id }) {
    try {
      const employee = await EmployeeModel.findOneAndUpdate(
        { employee_id: id },
        {
          is_active: false,
        }
      );
      employee.is_active = false;

      return employee;
    } catch (err) {
      console.log(err);
      throw new APIError(
        "API Error",
        STATUS_CODES.INTERNAL_ERROR,
        "Unable to Delete the Employee"
      );
    }
  }
}

module.exports = EmployeeRepository;
