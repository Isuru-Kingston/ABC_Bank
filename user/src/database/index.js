// database related modules
module.exports = {
  databaseConnection: require("./connection"),
  EmployeeRepository: require("./repository/employee-repository"),
  CustomerRepository: require("./repository/customer-repository"),
};
