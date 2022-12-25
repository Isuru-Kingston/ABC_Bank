const dotEnv = require("dotenv");

if (process.env.NODE_ENV !== "prod") {
  const configFile = `./.env.${process.env.NODE_ENV}`;
  dotEnv.config({ path: configFile });
} else {
  dotEnv.config();
}

module.exports = {
  PORT: process.env.PORT,
  DB_URL: process.env.MONGODB_URI,
  APP_SECRET: process.env.APP_SECRET,
  EXCHANGE_NAME: process.env.EXCHANGE_NAME,
  MSG_QUEUE_URL: process.env.MSG_QUEUE_URL,
  ACCOUNT_SERVICE: "account_service",
  CUSTOMER_SERVICE: "customer_service",
  EMPLOYEE_SERVICE: "employee_service",
  Auth_SERVICE: "auth_service",
  EMPLOYEE_RPC: "EMPLOYEE_RPC",
  CUSTOMER_RPC: "CUSTOMER_RPC",
  ACCOUNT_RPC: "ACCOUNT_RPC",
};
