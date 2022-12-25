const { ValidateToken } = require("../../utils");
const AccountService = require("../../services/account-service");

const service = new AccountService();

const EmployeeAuth = async (req, res, next) => {
  const isAuthorized = await ValidateToken(req);

  if (isAuthorized) {
    if (req.user.id.role && req.user.id.role == "staff") return next();
    else return res.status(403).json({ message: "Not Authorized" });
  }

  return res.status(403).json({ message: "Not Authorized" });
};

const UserAuth = async (req, res, next) => {
  const isAuthorized = await ValidateToken(req);

  if (isAuthorized) {
    const { data } = await service.GetAccount({ id: req.params.id });

    if (
      (req.user.id.role &&
        req.user.id.role == "user" &&
        req.user.id.id == data.owner) ||
      (req.user.id.role && req.user.id.role == "staff")
    )
      return next();
    else return res.status(403).json({ message: "Not Authorized" });
  }

  return res.status(403).json({ message: "Not Authorized" });
};

const DirectTransactionAuth = async (req, res, next) => {
  try {
    const isAuthorized = await ValidateToken(req);
    if (isAuthorized) {
      const { data } = await service.GetAccount({ id: req.body.from });

      if (
        (req.user.id.role &&
          req.user.id.role == "user" &&
          req.user.id.id == data.owner) ||
        (req.user.id.role && req.user.id.role == "staff")
      ) {
        return next();
      } else {
        return res.status(403).json({ message: "Not Authorized" });
      }
    }

    return res.status(403).json({ message: "Not Authorized" });
  } catch (error) {
    return res.status(403).json({ message: "Not Authorized" });
  }
};

const UserTransactionGetAuth = async (req, res, next) => {
  try {
    const isAuthorized = await ValidateToken(req);
    if (isAuthorized) {
      const { data } = await service.GetAccount({ id: req.params.account });

      if (
        (req.user.id.role &&
          req.user.id.role == "user" &&
          req.user.id.id == data.owner) ||
        (req.user.id.role && req.user.id.role == "staff")
      )
        return next();
      else return res.status(403).json({ message: "Not Authorized" });
    }

    return res.status(403).json({ message: "Not Authorized" });
  } catch (error) {
    return res.status(403).json({ message: "Not Authorized" });
  }
};

module.exports = {
  EmployeeAuth,
  UserAuth,
  UserTransactionGetAuth,
  DirectTransactionAuth,
};
