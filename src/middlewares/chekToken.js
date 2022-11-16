import jwt from "../utils/jwt.js";
import { errorHandler } from "../errors/errorsHandler.js";

export default (req, res, next) => {
  try {
    const { token } = req.headers

    if (!token) next(new errorHandler("Required token", 401))
    jwt.verify(token)

    return next();

  } catch (error) {
    return next(new errorHandler("Invalid token", 401))
  }
}