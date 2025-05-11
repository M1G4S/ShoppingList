const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const prisma = require('../db/prismaClient');

async function register(req, res) {
  const { email, password } = req.body;

  try {
    // Verificar se o user já existe
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'User já existe' });
    }

    // Hashear a senha
    const hashedPassword = await bcrypt.hash(password, 10);

    // Criar o user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });

    res.status(201).json({ message: 'User criado com sucesso', user: { id: user.id, email: user.email } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro no servidor' });
  }
}

async function login(req, res) {
  const { email, password } = req.body;

  // Verificar se o usuário existe
  const user = await prisma.user.findUnique({ where: { email: email } });

  if (!user) {
    return res.status(400).json({ message: 'Credenciais inválidas.' });
  }

  // Verificar se a senha é válida
  const validPassword = await bcrypt.compare(password, user.password);

  if (!validPassword) {
    return res.status(400).json({ message: 'Credenciais inválidas.' });
  }

  // Gerar o token
  const token = jwt.sign(
    { userId: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );

  // Enviar o token como resposta
  res.json({
    message: 'Login bem-sucedido',
    token: token,
  });
}

module.exports = {
  register,
  login,
};
