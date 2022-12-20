const { ValidateToken } = require("../../utils");

const EmployeeAuth = async (req, res, next) => {
  const isAuthorized = await ValidateToken(req);

  if (isAuthorized) {
    if (
      (req.user.id.role &&
        req.user.id.role == "staff" &&
        req.user.id.id == req.params.id) ||
      (req.user.id.role && req.user.id.role == "branch")
    )
      return next();
    else return res.status(403).json({ message: "Not Authorized" });
  }

  return res.status(403).json({ message: "Not Authorized" });
};

const BranchAuth = async (req, res, next) => {
  const isAuthorized = await ValidateToken(req);

  if (isAuthorized) {
    console.log(req.user.id);
    if (req.user.id.role && req.user.id.role == "branch") return next();
    else return res.status(403).json({ message: "Not Authorized" });
  }

  return res.status(403).json({ message: "Not Authorized" });
};

const UserAuth = async (req, res, next) => {
  const isAuthorized = await ValidateToken(req);

  if (isAuthorized) {
    console.log(req.user.id);
    if (req.user.id.role && req.user.id.role == "staff") return next();
    else return res.status(403).json({ message: "Not Authorized" });
  }

  return res.status(403).json({ message: "Not Authorized" });
};

const EmployeeUserAuth = async (req, res, next) => {
  const isAuthorized = await ValidateToken(req);

  if (isAuthorized) {
    if (
      (req.user.id.role &&
        req.user.id.role == "user" &&
        req.user.id.id == req.params.id) ||
      (req.user.id.role && req.user.id.role == "staff")
    )
      return next();
    else return res.status(403).json({ message: "Not Authorized" });
  }

  return res.status(403).json({ message: "Not Authorized" });
};

module.exports = {
  EmployeeAuth,
  BranchAuth,
  UserAuth,
  EmployeeUserAuth,
};
