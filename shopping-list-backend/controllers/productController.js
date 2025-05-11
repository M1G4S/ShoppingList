const prisma = require('../db/prismaClient');

const createProduct = async (req, res) => {
  const { nome, imagemUrl, categoria } = req.body;

  try {
    const novoProduto = await prisma.product.create({
      data: {
        nome,
        imagemUrl,
        categoria,
        userId: req.user.userId, // vem do middleware JWT
      },
    });

    res.status(201).json({ message: 'Produto criado!', produto: novoProduto });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao criar produto' });
  }
};

const getProdutos = async (req, res) => {
  try {
    const produtos = await prisma.product.findMany({
      where: {
        userId: req.user.userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    res.status(200).json(produtos);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao buscar produtos' });
  }
};

const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { nome, imagemUrl, categoria } = req.body;

  try {
    const produtoAtualizado = await prisma.product.updateMany({
      where: {
        id: parseInt(id),
        userId: req.user.userId, // garantir que só pode editar o seu
      },
      data: {
        nome,
        imagemUrl,
        categoria,
      },
    });

    if (produtoAtualizado.count === 0) {
      return res.status(404).json({ message: 'Produto não encontrado ou não autorizado' });
    }

    res.status(200).json({ message: 'Produto atualizado com sucesso' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao atualizar produto' });
  }
};

const deleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const produtoRemovido = await prisma.product.deleteMany({
      where: {
        id: parseInt(id),
        userId: req.user.userId, // só apaga se for do user
      },
    });

    if (produtoRemovido.count === 0) {
      return res.status(404).json({ message: 'Produto não encontrado ou não autorizado' });
    }

    res.status(200).json({ message: 'Produto removido com sucesso' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao remover produto' });
  }
};

module.exports = {
  createProduct,
  getProdutos,
  updateProduct,
  deleteProduct,
};
