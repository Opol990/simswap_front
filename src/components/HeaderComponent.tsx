import React from 'react';
import { Layout, Menu, Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/store';
import { logout } from '../store/slices/userSlice';
import '../styles/header.css';

const { Header } = Layout;

const HeaderComponent: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const currentUser = useSelector((state: RootState) => state.user.userData);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <Header className="header">
      <div className="logo" onClick={() => navigate('/home')}>
        SimSwap
      </div>
      {currentUser && (
        <div className="menu-buttons">
          <Button type="text" onClick={() => navigate('/profile')}>
            Perfil
          </Button>
          <Button type="text" onClick={handleLogout}>
            Cerrar sesión
          </Button>
        </div>
      )}
    </Header>
  );
};

export default HeaderComponent;
