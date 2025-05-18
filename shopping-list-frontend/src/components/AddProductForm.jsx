import { useEffect, useState, useRef } from 'react';
import styled from 'styled-components';
import api from '../services/api';
import { FaNotesMedical } from 'react-icons/fa';

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

const Input = styled.input`
  width: 100%;
  padding: 10px 15px;
  margin: 10px 0;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 16px;
  box-sizing: border-box;
`;

const Hbox = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
`;

const Wrapper = styled.div`
  position: relative;
  width: 100%;
`;

const DropdownButton = styled.button`
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const SuggestionsBox = styled.ul`
  list-style: none;
  margin: 0;
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 5px;
  max-height: 150px;
  overflow-y: auto;
  position: absolute;
  width: 100%;
  left: 0; /* garante alinhamento à esquerda */
  background: white;
  z-index: 10;
  box-sizing: border-box;
`;

const SuggestionItem = styled.li`
  padding: 8px;
  cursor: default;
  display: flex;
  justify-content: space-between;
  align-items: center;

  &:hover {
    background: #eee;
  }
`;

const DeleteButton = styled.div`
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  user-select: none;

  &:hover svg {
    stroke: #f00;
  }
`;

function AddProductForm({ onProductAdded, existingProduct, onClose, userId }) {
  const [nome, setNome] = useState(existingProduct?.nome || '');
  const [imagemUrl, setImagemUrl] = useState(existingProduct?.imagemUrl || '');
  const [categoria, setCategoria] = useState(existingProduct?.categoria || '');
  const [categorias, setCategorias] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const wrapperRef = useRef(null);

  const token = localStorage.getItem('token');

  useEffect(() => {
    if (existingProduct) {
      setNome(existingProduct.nome);
      setImagemUrl(existingProduct.imagemUrl);
      setCategoria(existingProduct.categoria);
    }

    api.get(`/users/${userId}/categorias`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then((res) => {
      setCategorias(res.data.categorias || []);
    })
    .catch((err) => {
      console.error(`${userId} Erro ao buscar categorias:`, err);
    });
    
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };

  }, [existingProduct]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const nomeT = nome.trim();
    const imagemUrlT = imagemUrl.trim();
    const categoriaT = categoria.trim();

    if (nomeT === "" || imagemUrlT === "" ||categoriaT === "") {
      alert("Existem campos inválidos!");
      return;
    }

    try {
      if (existingProduct) {
        // PUT para atualizar
        await api.put(`/produtos/${existingProduct.id}`, { nome: nomeT, imagemUrl: imagemUrlT, categoria: categoriaT }, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        // POST para novo
        await api.post('/produtos', { nome: nomeT, imagemUrl: imagemUrlT, categoria: categoriaT }, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      await api.post(`/users/${userId}/categorias`, { categoria: categoriaT }, {
          headers: { Authorization: `Bearer ${token}` },
      });

      onProductAdded();
      onClose();
    } catch (err) {
      console.error('Erro ao salvar produto:', err);
    }
  };

  const handleSuggestionClick = (cat) => {
    setCategoria(cat);
    setShowSuggestions(false);
  };

  const handleDeleteCategory = async (catToDelete) => {
    try {
      await api.delete(`/users/${userId}/categorias`, {
        headers: { Authorization: `Bearer ${token}` },
        data: { categoria: catToDelete }, // geralmente para DELETE com body, axios usa `data`
      });
      // Remove localmente
      setCategorias(categorias.filter((cat) => cat !== catToDelete));
      // Se a categoria apagada estava no input, limpa o input
      if (categoria === catToDelete) {
        setCategoria("");
      }
    } catch (err) {
      console.error("Erro ao apagar categoria:", err);
    }
  };

  const DropdownIcon = () => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#555"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );

  const CloseIcon = () => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#a00"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-2xl shadow-md w-full max-w-md space-y-4"
    >
      <h2 className="text-xl font-bold text-gray-800">
        {existingProduct ? 'Editar Produto' : 'Adicionar Produto'}
      </h2>

      <Input
        type="text"
        placeholder="Nome do produto"
        value={nome}
        onChange={(e) => setNome(e.target.value)}
        required
      />
      <Input
        type="url"
        placeholder="URL da imagem"
        value={imagemUrl}
        onChange={(e) => setImagemUrl(e.target.value)}
        required
      />
      <Wrapper ref={wrapperRef}>
        <Input
          type="text"
          placeholder="Categoria"
          value={categoria}
          onChange={(e) => setCategoria(e.target.value)}
          required
        />
        <DropdownButton type="button" onClick={() => setShowSuggestions((s) => !s)}>
          <DropdownIcon/>
        </DropdownButton>
        {showSuggestions && (
          <SuggestionsBox>
            {categorias.map((cat, index) => (
              <SuggestionItem key={index}>
                <span onClick={() => handleSuggestionClick(cat)} style={{ flexGrow: 1, cursor: "pointer" }}>
                  {cat}
                </span>
                <DeleteButton onClick={() => handleDeleteCategory(cat)} title="Apagar categoria">
                  <CloseIcon />
                </DeleteButton>
              </SuggestionItem>
            ))}
          </SuggestionsBox>
        )}
      </Wrapper>

      <Hbox>
        <Button type="submit">
          {existingProduct ? '✏️ Atualizar Produto' : '➕ Adicionar Produto'}
        </Button>
        <LogoutButton type="button" onClick={onClose}>
          Cancelar
        </LogoutButton>
      </Hbox>
    </form>
  );
}

export default AddProductForm;