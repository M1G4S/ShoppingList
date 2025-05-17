import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import AddProductForm from '../components/AddProductForm';
import ProductItem from "../components/ProductItem";
import {
  Container,
  Column,
  Title,
  Product,
  Button,
  ProductImage,
  TopBar,
  LogoutButton,
  ConfirmDeleteModal,
  ModalContent,
  ModalActions,
} from '../styles/StyledComponents';


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
    <div style={{ fontFamily: "'Inter', sans-serif" }}>
      <TopBar>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <LogoutButton onClick={handleLogout}>Logout</LogoutButton>
      </TopBar>

      <Container>
        <Column>
          <Title>🧃 Produtos</Title>
          {products.map((product) => (
            <ProductItem
              key={product.id}
              product={product}
              isMenuOpen={menuOpen === product.id}
              setMenuOpen={setMenuOpen}
              handleEdit={handleEdit}
              handleDelete={handleDelete}
              onClickProduct={handleProductClick}
              showEditForm={showEditForm}
              selectedProduct={selectedProduct}
              AddProductForm={AddProductForm}
              handleProductAdded={handleProductAdded}
              setShowForm={setShowForm}
              setShowEditForm={setShowEditForm}
              setSelectedProduct={setSelectedProduct}
            />
          ))}

          {!showForm && (
            <Button onClick={() => {
              setSelectedProduct(null);
              setShowForm(true);
              setShowEditForm(false);
              console.log(products);
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

      {showConfirmDelete && (
        <ConfirmDeleteModal>
          <ModalContent>
            <h3>Tem certeza que quer eliminar este produto?</h3>
            <ModalActions>
              <LogoutButton onClick={confirmDelete}>Sim, Excluir</LogoutButton>
              <Button onClick={() => setShowConfirmDelete(false)}>Cancelar</Button>
            </ModalActions>
          </ModalContent>
        </ConfirmDeleteModal>
      )}
    </div>
  );
}

export default Dashboard;