const { CustomerRepository } = require("../database");
const { FormateData, GeneratePassword, GenerateSalt } = require("../utils");
const { APIError, STATUS_CODES } = require("../utils/app-errors");

// All Business logic will be here
class CustomerService {
  constructor() {
    this.repository = new CustomerRepository();
  }

  async CreateCustomer(userInputs) {
    try {
      const { email, phone, street, postalCode, city, country, nic } =
        userInputs;

      const newCustomer = await this.repository.CreateCustomer({
        email,
        phone,
        street,
        postalCode,
        city,
        country,
        nic,
      });

      return FormateData(newCustomer);
    } catch (err) {
      throw new APIError(
        "API Error",
        STATUS_CODES.INTERNAL_ERROR,
        "Unable to Create Customer"
      );
    }
  }

  async GetCustomer(userInputs) {
    try {
      const { id } = userInputs;

      const customer = await this.repository.FindCustomer({ id });

      return FormateData(customer);
    } catch (err) {
      throw new APIError(
        "API Error",
        STATUS_CODES.INTERNAL_ERROR,
        "Unable to Find the Customer"
      );
    }
  }

  async UpdateCustomer(userInputs) {
    try {
      const { id, phone, street, postalCode, city, country } = userInputs;

      const customer = await this.repository.UpdateCustomer({
        id,
        phone,
        street,
        postalCode,
        city,
        country,
      });

      return FormateData(customer);
    } catch (err) {
      throw new APIError(
        "API Error",
        STATUS_CODES.INTERNAL_ERROR,
        "Unable to Update the Customer"
      );
    }
  }

  async GetCustomers() {
    try {
      const customers = await this.repository.FindCustomers();

      return FormateData(customers);
    } catch (err) {
      throw new APIError(
        "API Error",
        STATUS_CODES.INTERNAL_ERROR,
        "Unable to Find the Customers"
      );
    }
  }

  async AddAccount(userInputs) {
    try {
      const { id, accountId } = userInputs;

      const customer = await this.repository.AddAccount({
        id,
        accountId,
      });

      return FormateData(customer);
    } catch (err) {
      throw new APIError(
        "API Error",
        STATUS_CODES.INTERNAL_ERROR,
        "Unable to Add the Account"
      );
    }
  }

  async SubscribeEvents(payload) {
    payload = JSON.parse(payload);
    const { event, data } = payload;

    switch (event) {
      case "ADD_ACCOUNT_TO_USER":
        const { id, accountId } = data;
        this.AddAccount({ id, accountId });
        break;
      default:
        break;
    }
  }
}

module.exports = CustomerService;
