import styled from 'styled-components';

export const MenuIcon = styled.div`
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

export const Dot = styled.div`
  width: 6px;
  height: 6px;
  background-color: #333;
  border-radius: 50%;
`;

export const OptionsMenu = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
  width: 150px;
  padding: 10px;
  ${({ $isOpen }) => `display: ${$isOpen ? 'block' : 'none'};`};
  transition: opacity 0.2s ease-in-out;
`;

export const OptionButton = styled.button`
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

export const Container = styled.div`
  display: flex;
  gap: 2rem;
  padding: 2rem;
  background-color: #f4f6f9;
  height: calc(100vh - 80px);
  box-sizing: border-box;
`;

export const Column = styled.div`
  flex: 1;
  background-color: #fff;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  overflow-y: auto;
`;

export const Title = styled.h2`
  margin-bottom: 1rem;
  color: #333;
`;

export const Product = styled.div`
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

export const Button = styled.button`
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

export const ProductImage = styled.img`
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 8px;
`;

export const TopBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #ffffff;
  padding: 1rem 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
`;

export const LogoutButton = styled.button`
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

export const ConfirmDeleteModal = styled.div`
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

export const ModalContent = styled.div`
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
`;

export const ModalActions = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
  justify-content: center;
`;