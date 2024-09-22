import errorHandler from "./errorHandler.js";
import jwt from "jsonwebtoken";

const verifyUser = (req, res, next) => {
  const allCookie = req.headers.cookie;

  if (!allCookie) {
    return next(errorHandler(401, "No token, authorization denied"));
  }

  let token = null;
  const cookies = allCookie.split(";");

  for (let i = 0; i < cookies.length; i++) {
    const [name, value] = cookies[i].trim().split("=");
    if (name === "digitalflakeUser") {
      token = value;
      break;
    }
  }

  if (!token) {
    return next(errorHandler(401, "No token, authorization denied"));
  }

  jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
    if (err) {
      return next(errorHandler(401, "Token is not valid"));
    }
    req.user = user;
    next();
  });
};

export default verifyUser;
