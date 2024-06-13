import React from 'react';
import { Layout, Menu, Dropdown, Button } from 'antd';
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

  const menu = (
    <Menu>
      <Menu.Item key="1" onClick={() => navigate('/profile')}>
        Perfil
      </Menu.Item>
      <Menu.Item key="2" onClick={handleLogout}>
        Cerrar sesión
      </Menu.Item>
    </Menu>
  );

  return (
    <Header className="header">
      <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['1']} className="menu">
        <Menu.Item key="1" onClick={() => navigate('/home')}>Inicio</Menu.Item>
      </Menu>
      {currentUser && (
        <Dropdown overlay={menu} placement="bottomRight">
          <Button type="text" className="profile-button" style={{ float: 'right' }}>
            {currentUser.username}
          </Button>
        </Dropdown>
      )}
    </Header>
  );
};

export default HeaderComponent;
