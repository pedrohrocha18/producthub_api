import express from "express";
import dotenv from "dotenv";
import routes from "./src/routes/index.js";

const app = express();

dotenv.config();

const PORT = process.env.PORT || 9001;

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(routes);

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
