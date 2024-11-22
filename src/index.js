import express, { urlencoded } from "express";
import dotenv from "dotenv";

const app = express();

dotenv.config();

const PORT = process.env.PORT || 9001;

app.use(express());

app.use(
  urlencoded({
    extended: true,
  })
);

app.get("/", (req, res) => {
  res.send("Bem-vindo a API!");
});

app.listen(PORT, () =>
  console.log(`Server is running at http://localhost:${PORT}`)
);
