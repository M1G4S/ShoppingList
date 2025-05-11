import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Importa useNavigate

const Home = () => {
  const navigate = useNavigate(); // Usa useNavigate ao invés de useHistory
  const token = localStorage.getItem('token'); // Verifica se o usuário está autenticado

  useEffect(() => {
    if (token) {
      // Se o usuário estiver autenticado, redireciona para o Dashboard
      navigate('/dashboard'); // Usa navigate ao invés de history.push
    } else {
      // Caso contrário, redireciona para o Login
      navigate('/login'); // Usa navigate ao invés de history.push
    }
  }, [token, navigate]);

  return null; // Não precisa renderizar nada, já que estamos redirecionando
};

export default Home;