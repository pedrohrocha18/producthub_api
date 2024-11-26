import { Router } from "express";
import userRoutes from "./userRoute.js";

const routes = Router();

routes.use("/user", userRoutes);

routes.get("/", (req, res) => {
  res.send("Welcome!");
});

export default routes;
