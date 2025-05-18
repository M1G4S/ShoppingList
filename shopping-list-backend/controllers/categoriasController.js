const prisma = require('../db/prismaClient');

const getCategoriasByUserId = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: { categorias: true },
    });

    if (!user) {
      return res.status(404).json({ error: 'User não encontrado' });
    }

    return res.json({ categorias: user.categorias });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Erro ao buscar categorias' });
  }
};

const addCategoriaToUser = async (req, res) => {
  const { categoria } = req.body;

  if (isNaN(req.user.userId) || !categoria || typeof categoria !== 'string') {
    return res.status(400).json({ error: 'ID ou categoria inválidos' });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: { categorias: true },
    });

    if (!user) {
      return res.status(404).json({ error: 'User não encontrado' });
    }

    if (user.categorias.includes(categoria)) {
      return res.status(400).json({ error: 'Categoria já existe para este user' });
    }

    const updatedUser = await prisma.user.update({
      where: { id: req.user.userId },
      data: {
        categorias: {
          set: [...user.categorias, categoria],
        },
      },
      select: { categorias: true },
    });

    return res.json({ categorias: updatedUser.categorias });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Erro ao adicionar categoria' });
  }
};

const removeCategoriaFromUser = async (req, res) => {
  const { categoria } = req.body;

  if (isNaN(req.user.userId) || !categoria || typeof categoria !== 'string') {
    return res.status(400).json({ error: 'ID ou categoria inválidos' });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: { categorias: true },
    });

    if (!user) {
      return res.status(404).json({ error: 'User não encontrado' });
    }

    if (!user.categorias.includes(categoria)) {
      return res.status(400).json({ error: 'Categoria não existe para este user' });
    }

    const updatedCategorias = user.categorias.filter(c => c !== categoria);

    const updatedUser = await prisma.user.update({
      where: { id: req.user.userId },
      data: {
        categorias: {
          set: updatedCategorias,
        },
      },
      select: { categorias: true },
    });

    return res.json({ categorias: updatedUser.categorias });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Erro ao remover categoria' });
  }
};

module.exports = {
  getCategoriasByUserId,
  addCategoriaToUser,
  removeCategoriaFromUser,
};