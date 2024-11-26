import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import routes from "./src/routes/index.js";

const app = express();

dotenv.config();

const PORT = process.env.PORT || 9001;

app.use(
  cors({
    origin: "*", // Permite todas as origens
    methods: ["GET", "POST", "PUT", "DELETE"], // Métodos permitidos
    allowedHeaders: ["Content-Type", "Authorization"], // Cabeçalhos permitidos
  })
);

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(routes);

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
