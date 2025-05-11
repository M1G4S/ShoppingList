const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getShoppingList = async (req, res) => {
  const userId = req.user.id;

  try {
    const list = await prisma.shoppingItem.findMany({
      where: { userId },
      include: { product: true },
    });

    res.json(list.map(item => item.product));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar lista de compras' });
  }
};

exports.addToShoppingList = async (req, res) => {
  const userId = req.user.userId; // Use userId, não id
  const { productId } = req.body;

  try {
    const exists = await prisma.shoppingItem.findFirst({
      where: { userId, productId },
    });

    if (exists) {
      return res.status(400).json({ message: 'Produto já na lista' });
    }

    const item = await prisma.shoppingItem.create({
      data: {
        user: {
          connect: { id: userId }, // Conecta com o usuário usando userId
        },
        product: {
          connect: { id: productId }, // Conecta com o produto usando productId
        },
      },
    });

    res.status(201).json(item);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao adicionar à lista' });
  }
};

exports.removeFromShoppingList = async (req, res) => {
  const userId = req.user.id;
  const productId = parseInt(req.params.productId);

  try {
    await prisma.shoppingItem.deleteMany({
      where: { userId, productId },
    });

    res.json({ message: 'Removido da lista' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao remover da lista' });
  }
};