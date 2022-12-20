const { AuthRepository } = require("../database");
const {
  FormateData,
  GeneratePassword,
  ValidatePassword,
  GenerateSalt,
  GenerateToken,
} = require("../utils");
const { APIError, STATUS_CODES } = require("../utils/app-errors");

// All Business logic will be here
class AuthService {
  constructor() {
    this.repository = new AuthRepository();
  }

  async SignUp(userInputs) {
    try {
      const { id, email, password, role } = userInputs;

      let salt = await GenerateSalt();

      let authPassword = await GeneratePassword(password, salt);

      const newAuth = await this.repository.SignUp({
        id,
        email,
        password: authPassword,
        salt,
        role,
      });

      return FormateData(newAuth);
    } catch (err) {
      throw new APIError(
        "API Error",
        STATUS_CODES.INTERNAL_ERROR,
        "Unable to SignUp"
      );
    }
  }

  async SignIn(userInputs) {
    try {
      const { id, password } = userInputs;

      const existingAuth = await this.repository.SignIn({ id });

      if (existingAuth) {
        const validPassword = await ValidatePassword(
          password,
          existingAuth.password,
          existingAuth.salt
        );
        if (validPassword) {
          const token = await GenerateToken({
            email: existingAuth.email,
            id: existingAuth.user_name,
            role: existingAuth.role,
          });
          return FormateData({ id: existingAuth._id, token });
        } else {
          throw new APIError(
            "API Error",
            STATUS_CODES.INTERNAL_ERROR,
            "Unable to SignIn"
          );
        }
      } else {
        throw new APIError(
          "API Error",
          STATUS_CODES.INTERNAL_ERROR,
          "Unable to SignIn"
        );
      }
    } catch (err) {
      throw new APIError(
        "API Error",
        STATUS_CODES.INTERNAL_ERROR,
        "Unable to SignIn"
      );
    }
  }

  async SubscribeEvents(payload) {
    payload = JSON.parse(payload);
    const { event, data } = payload;
    switch (event) {
      case "SIGN_UP":
        const { id, email, password, role } = data;
        this.SignUp({ id, email, password, role });
        break;
      default:
        break;
    }
  }
}

module.exports = AuthService;
