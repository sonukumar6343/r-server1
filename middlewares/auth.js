import { TryCatch } from "./error.js";
import { ErrorHandler } from "../utils/utility.js";
import jwt from "jsonwebtoken"
const isAuthenticated = TryCatch((req, res, next) => {
  const token = req.cookies["rupkalaid"];
  if (!token)
    return next(new ErrorHandler("Please login to access this route", 401));

  const decodedData = jwt.verify(token, process.env.JWT_SECRET);

  req.user = decodedData._id;

  next();
});
const isAdmin = TryCatch((req, res, next) => {
  const token = req.cookies["rupkala-admin"];
  if (!token)
    return next(new ErrorHandler("Only Admin can access this route", 401));

  const decodedData = jwt.verify(token, process.env.JWT_SECRET);

  req.user = decodedData._id;

  next();
});
export { isAuthenticated ,isAdmin};
