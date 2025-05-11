import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import styled from 'styled-components';
import AddProductForm from '../components/AddProductForm';

const Container = styled.div`
  display: flex;
  gap: 2rem;
  padding: 2rem;
  background-color: #f4f6f9;
  height: calc(100vh - 80px);
  box-sizing: border-box;
`;

const Column = styled.div`
  flex: 1;
  background-color: #fff;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  overflow-y: auto;
`;

const Title = styled.h2`
  margin-bottom: 1rem;
  color: #333;
`;

const Product = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #f0f4f8;
  padding: 10px 15px;
  margin-bottom: 10px;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #dbeafe;
  }
`;

const Button = styled.button`
  background-color: #007bff;
  border: none;
  padding: 12px;
  color: white;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  &:hover {
    background-color: #0056b3;
  }
`;

const ProductImage = styled.img`
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 8px;
`;

const TopBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #ffffff;
  padding: 1rem 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
`;

const LogoutButton = styled.button`
  background-color: #ef4444;
  color: white;
  padding: 12px;
  font-weight: 500;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  &:hover {
    background-color: #dc2626;
  }
`;

const MenuIcon = styled.div`
  width: 24px;
  height: 24px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  background-color: transparent;
  border: none;
  padding: 4px;
`;

const Dot = styled.div`
  width: 6px;
  height: 6px;
  background-color: #333;
  border-radius: 50%;
`;

const OptionsMenu = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
  width: 150px;
  padding: 10px;
  display: ${({ isOpen }) => (isOpen ? 'block' : 'none')};
  transition: opacity 0.2s ease-in-out;
`;

const OptionButton = styled.button`
  width: 100%;
  padding: 8px 0;
  text-align: left;
  background: transparent;
  border: none;
  color: #333;
  cursor: pointer;
  &:hover {
    background-color: #f4f6f9;
  }
`;

const ConfirmDeleteModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
`;

function Dashboard() {
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState([]);
  const [myList, setMyList] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [menuOpen, setMenuOpen] = useState(null); // Para controlar o menu de cada produto
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false); // Para mostrar a confirmação de exclusão
  const [productToDelete, setProductToDelete] = useState(null); // Produto a ser excluído
  const navigate = useNavigate();

  const token = localStorage.getItem('token');

  const fetchProducts = async () => {
    try {
      const res = await api.get('/produtos', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setProducts(res.data);
    } catch (err) {
      console.error('Erro ao carregar os produtos:', err);
    }
  };

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchUserData = async () => {
      try {
        const res = await api.get('/dashboard', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(res.data);
      } catch (err) {
        console.error('Erro ao carregar os dados do usuário:', err);
        localStorage.removeItem('token');
        navigate('/login');
      }
    };

    fetchUserData();
    fetchProducts();
    fetchMyList();
  }, [navigate, token]);

  const fetchMyList = async () => {
    try {
      const res = await api.get('/lista', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMyList(res.data);
    } catch (err) {
      console.error('Erro ao buscar lista do utilizador:', err);
    }
  };

  const addToMyList = async (product) => {
    if (myList.find((item) => item.id === product.id)) return;

    try {
      const res = await api.post(
        '/lista', 
        { productId: product.id }, // Passando o productId para o backend
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchMyList();
    } catch (err) {
      console.error('Erro ao adicionar produto à lista:', err);
    }
  };

  const removeFromMyList = async (productId) => {
    try {
      await api.delete(`/lista/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMyList(myList.filter((item) => item.id !== productId));
    } catch (err) {
      console.error('Erro ao remover da lista:', err);
    }
  };

  const handleProductAdded = () => {
    fetchProducts();
    setShowForm(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const toggleMenu = (productId) => {
    setMenuOpen(menuOpen === productId ? null : productId); // Alterna entre abrir e fechar o menu
  };

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setShowEditForm(true);
    setShowForm(true);
    setMenuOpen(null); // Fecha o menu
  };

  const handleDelete = (product) => {
    setProductToDelete(product);
    setShowConfirmDelete(true); // Exibe a confirmação
    setMenuOpen(null); // Fecha o menu
  };

  const confirmDelete = async () => {
    try {
      const res = await api.delete(`/produtos/${productToDelete.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchProducts();
      setShowConfirmDelete(false); // Fecha a confirmação
      setProductToDelete(null); // Limpa o produto
    } catch (err) {
      console.error('Erro ao excluir o produto:', err);
    }
  };

  // Função para evitar que o clique no ícone dos 3 pontos adicione o produto à lista de compras
  const handleProductClick = (e, product) => {
    e.stopPropagation(); // Impede que o clique no produto adicione o produto à lista de compras
    addToMyList(product); // Aqui apenas adicionamos o produto à lista
  };

  return (
    <div>
      <TopBar>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <LogoutButton onClick={handleLogout}>Logout</LogoutButton>
      </TopBar>

      <Container>
        <Column>
          <Title>🧃 Produtos</Title>
          {products.map((product) => (
            <div key={product.id}>
              <Product onClick={(e) => handleProductClick(e, product)}>
                <ProductImage src={product.imagemUrl} />
                <h3>{product.nome}</h3>

                <div style={{ position: 'relative' }}>
                  <MenuIcon onClick={(e) => {
                    e.stopPropagation();
                    toggleMenu(product.id);
                  }}>
                    <Dot />
                    <Dot />
                    <Dot />
                  </MenuIcon>

                  <OptionsMenu isOpen={menuOpen === product.id}>
                    <OptionButton onClick={(e) => {
                      e.stopPropagation();
                      handleEdit(product);
                    }}>✏️ Editar</OptionButton>
                    <OptionButton onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(product);
                    }}>🗑️ Excluir</OptionButton>
                  </OptionsMenu>
                </div>
              </Product>

              {/* Formulário de edição diretamente abaixo do produto clicado */}
              {showEditForm && selectedProduct?.id === product.id && (
                <div style={{ marginTop: '10px' }}>
                  <AddProductForm
                    onProductAdded={handleProductAdded}
                    existingProduct={selectedProduct}
                    onClose={() => {
                      setShowForm(false);
                      setShowEditForm(false);
                      setSelectedProduct(null);
                    }}
                  />
                </div>
              )}
            </div>
          ))}

          {!showForm && (
            <Button onClick={() => {
              setSelectedProduct(null);
              setShowForm(true);
              setShowEditForm(false);
            }}>
              ➕ Adicionar novo produto
            </Button>
          )}

          {showForm && !selectedProduct && (
            <div className="mt-4">
              <AddProductForm
                onProductAdded={handleProductAdded}
                existingProduct={null}
                onClose={() => {
                  setShowForm(false);
                }}
              />
            </div>
          )}
        </Column>

        <Column>
          <Title>🛒 Lista de Compras</Title>
          {myList.length === 0 && <p>Nenhum produto ainda.</p>}
          {myList.map((product) => (
            <Product key={product.id} onClick={() => removeFromMyList(product.id)}>
              <ProductImage src={product.imagemUrl} />
              <h3>{product.nome}</h3>
            </Product>
          ))}
        </Column>
      </Container>

      {/* Modal de confirmação de exclusão */}
      {showConfirmDelete && (
        <ConfirmDeleteModal>
          <ModalContent>
            <h3>Tem certeza que quer eliminar este produto?</h3>
            <div>
              <Button onClick={confirmDelete}>Sim, Excluir</Button>
              <Button onClick={() => setShowConfirmDelete(false)}>Cancelar</Button>
            </div>
          </ModalContent>
        </ConfirmDeleteModal>
      )}
    </div>
  );
}

export default Dashboard;