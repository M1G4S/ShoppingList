import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import api from '../services/api';
import { AiOutlineArrowLeft } from 'react-icons/ai';

const RegisterContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f4f6f9;
`;

const RegisterBox = styled.div`
  background-color: #fff;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
`;

const Title = styled.h2`
  text-align: center;
  color: #333;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 16px;
  box-sizing: border-box;
`;

const Button = styled.button`
  width: 100%;
  padding: 12px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  &:hover {
    background-color: #0056b3;
  }
`;

const BackButton = styled.button`
  background: none;
  border: none;
  color: #007bff;
  font-size: 24px;
  cursor: pointer;
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  &:hover {
    color: #0056b3;
  }
`;

const Register = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/auth/register', {
        email,
        password,
      });

      if (response.data.user) {
        navigate('/login');
      }
    } catch (err) {
      setError('Erro ao registrar');
    }
  };

  return (
    <RegisterContainer>
      <RegisterBox>
        <BackButton onClick={() => navigate('/login')}>
          <AiOutlineArrowLeft style={{ marginRight: '10px' }} />
        </BackButton>
        <Title>Registo</Title> 
        {error && <div style={{ color: 'red', textAlign: 'center' }}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <Input
            type="email"
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Button type="submit">Registar</Button>
        </form>
      </RegisterBox>
    </RegisterContainer>
  );
};

export default Register;