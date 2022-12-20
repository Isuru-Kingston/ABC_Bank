const { ValidateToken } = require("../../utils");

const BranchAuth = async (req, res, next) => {
  const isAuthorized = await ValidateToken(req);

  if (isAuthorized) {
    console.log(req.user.id.role);
    if (req.user.id.role && req.user.id.role == "branch") return next();
    else return res.status(403).json({ message: "Not Authorized" });
  }

  return res.status(403).json({ message: "Not Authorized" });
};

module.exports = {
  BranchAuth,
};
