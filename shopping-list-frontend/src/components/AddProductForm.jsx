import { useEffect, useState } from 'react';
import styled from 'styled-components';
import api from '../services/api';

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

function AddProductForm({ onProductAdded, existingProduct, onClose }) {
  const [nome, setNome] = useState(existingProduct?.nome || '');
  const [imagemUrl, setImagemUrl] = useState(existingProduct?.imagemUrl || '');
  const [categoria, setCategoria] = useState(existingProduct?.categoria || '');

  useEffect(() => {
    if (existingProduct) {
      setNome(existingProduct.nome);
      setImagemUrl(existingProduct.imagemUrl);
      setCategoria(existingProduct.categoria);
    }
  }, [existingProduct]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    try {
      if (existingProduct) {
        // PUT para atualizar
        await api.put(`/produtos/${existingProduct.id}`, { nome, imagemUrl, categoria }, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        // POST para novo
        await api.post('/produtos', { nome, imagemUrl, categoria }, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      onProductAdded();
      onClose();
    } catch (err) {
      console.error('Erro ao salvar produto:', err);
    }
  };

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
      <Input
        type="text"
        placeholder="Categoria"
        value={categoria}
        onChange={(e) => setCategoria(e.target.value)}
        required
      />

      <Hbox>
        <Button
          type="submit"
          
        >
          {existingProduct ? '✏️ Atualizar Produto' : '➕ Adicionar Produto'}
        </Button>
        <LogoutButton
          type="button"
          onClick={onClose}
          
        >
          Cancelar
        </LogoutButton>
      </Hbox>
    </form>
  );
}

export default AddProductForm;