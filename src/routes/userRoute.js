import { Router } from "express";
import {
  authenticate,
  validatePassword,
} from "../middlewares/authMiddleware.js";
import userController from "../controllers/userController.js";

const userRoutes = Router();

userRoutes.post("/register", validatePassword, userController.createUser);

userRoutes.post("/login", userController.userLogin);

userRoutes.post(
  "/change-password",
  authenticate,
  userController.changePassword
);

export default userRoutes;
