import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const SECRET = process.env.SECRET_KEY;

// mock
const users = [];

const findUserByEmail = (email) => users.find((user) => user.email === email);

class UserController {
  // create new user
  async createUser(req, res) {
    const { name, email, password } = req.body;

    // Validação de e-mail
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "E-mail inválido!" });
    }

    // Verificar se o usuário já existe
    const existingUser = findUserByEmail(email);
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Usuário com este e-mail já existe." });
    }

    // Validar a senha
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message:
          "A senha deve ter no mínimo 8 caracteres, uma letra maiúscula, uma minúscula, um número e um caractere especial.",
      });
    }

    // Criptografar a senha
    const hashedPassword = await bcrypt.hash(password, 12);

    // Criar novo usuário
    users.push({ name, email, password: hashedPassword });

    return res.status(201).json({ message: "Usuário registrado com sucesso!" });
  }

  // user login
  async userLogin(req, res) {
    const { email, password } = req.body;

    // Verificar se o usuário existe
    const user = findUserByEmail(email);
    if (!user) {
      return res.status(404).json({ message: "Usuário não encontrado!" });
    }

    // Verificar a senha
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Senha incorreta!" });
    }

    // Gerar token
    const token = jwt.sign({ email }, SECRET, { expiresIn: "20m" });
    res.json({ message: "Logado com sucesso!", token });
  }

  // change password
  async changePassword(req, res) {
    const { currentPassword, newPassword } = req.body;

    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: "Token não fornecido!" });
    }

    const token = authHeader.split(" ")[1];

    try {
      // Verificar e decodificar o token
      const decoded = jwt.verify(token, SECRET);
      const { email } = decoded;

      // Verificar se o usuário existe
      const user = findUserByEmail(email);
      if (!user) {
        return res.status(404).json({ message: "Usuário não encontrado!" });
      }

      // Verificar a senha atual
      const isPasswordValid = await bcrypt.compare(
        currentPassword,
        user.password
      );
      if (!isPasswordValid) {
        return res.status(401).json({ message: "Senha atual incorreta!" });
      }

      // Validar nova senha
      const passwordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      if (!passwordRegex.test(newPassword)) {
        return res.status(400).json({
          message:
            "A nova senha deve ter no mínimo 8 caracteres, uma letra maiúscula, uma minúscula, um número e um caractere especial.",
        });
      }
      // Criptografar a nova senha
      const hashedPassword = await bcrypt.hash(newPassword, 12);

      // Atualizar senha
      user.password = hashedPassword;

      return res.status(200).json({ message: "Senha alterada com sucesso!" });
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        return res.status(403).json({ message: "Token expirado!" });
      }
      return res.status(403).json({ message: "Token inválido!" });
    }
  }
}

export default new UserController();
