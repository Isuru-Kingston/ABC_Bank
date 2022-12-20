const express = require("express");
const cors = require("cors");
const { employee, customer } = require("./api");
const { CreateChannel } = require("./utils");

module.exports = async (app) => {
  app.use(express.json());
  app.use(cors());
  app.use(express.static(__dirname + "/public"));

  const channel = await CreateChannel();

  employee(app, channel);
  customer(app, channel);
};
