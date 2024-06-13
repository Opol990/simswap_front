import React, { useState } from 'react';
import { Layout, Menu } from 'antd';
import HeaderComponent from '../components/HeaderComponent';
import InformacionGeneral from '../components/InformacionGeneral';
import MisProductos from '../components/MisProductos';
import MisChats from '../components/MisChats';
import "../styles/userProfile.css";

const { Content } = Layout;

const UserProfile: React.FC = () => {
  const [selectedMenu, setSelectedMenu] = useState('1');

  const renderSection = () => {
    switch (selectedMenu) {
      case '1':
        return <InformacionGeneral />;
      case '2':
        return <MisProductos />;
      case '3':
        return <MisChats />;
      default:
        return null;
    }
  };

  return (
    <Layout>
      <HeaderComponent />
      <Content style={{ padding: '0 50px', marginTop: 64 }}>
        <div className="profile-menu">
          <Menu
            onClick={(e) => setSelectedMenu(e.key)}
            selectedKeys={[selectedMenu]}
            mode="horizontal"
          >
            <Menu.Item key="1">Información Personal</Menu.Item>
            <Menu.Item key="2">Mis Productos</Menu.Item>
            <Menu.Item key="3">Mis Chats</Menu.Item>
          </Menu>
        </div>
        <div className="profile-content">
          {renderSection()}
        </div>
      </Content>
    </Layout>
  );
};

export default UserProfile;
