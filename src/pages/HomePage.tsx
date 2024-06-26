import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchProducts } from '../store/slices/productsSlice';
import HeaderComponent from '../components/HeaderComponent';
import CategoryFilters from '../components/CategoryFilters';
import SortOptions from '../components/SortOptions';
import ProductList from '../components/ProductList';
import FloatingChat from '../components/FloatingChat';
import { RootState, AppDispatch } from '../store/store';
import { Layout, Row, Col, Typography } from 'antd';
import "../styles/homePage.css";
import { ProductModel } from '../models/models';
import { fetchUserDetails } from '../store/slices/userSlice';

const { Content } = Layout;
const { Title } = Typography;

const HomePage: React.FC = () => {
  const dispatch: AppDispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const products = useSelector((state: RootState) => state.products.filteredProducts);
  const status = useSelector((state: RootState) => state.products.status);
  const currentUser = useSelector((state: RootState) => state.user.userData);
  const [selectedProduct, setSelectedProduct] = useState<ProductModel | null>(null);
  const [isChatVisible, setIsChatVisible] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    } else {
      dispatch(fetchUserDetails());
      dispatch(fetchProducts());
    }
  }, [navigate, dispatch]);

  useEffect(() => {
    console.log('Current user:', currentUser);
  }, [currentUser]);

  const handleOpenChat = (product: ProductModel) => {
    console.log('Opening chat for product:', product);
    console.log('Current user ID:', currentUser?.usuario_id);
    setSelectedProduct(product);
    setIsChatVisible(true);
  };

  const handleCloseChat = () => {
    setIsChatVisible(false);
    setSelectedProduct(null);
  };

  if (status === 'loading') {
    return <div className="text-center p-5">Loading...</div>;
  }

  if (status === 'failed') {
    return <div className="alert alert-danger" role="alert">Error loading products</div>;
  }

  return (
    <Layout className="full-height-layout">
      <HeaderComponent />
      <Content className="container mt-5">
        <div className="welcome-banner text-center p-3 mb-4">
          <Title level={2} className="welcome-title">
            ¡Bienvenido a SimSwap!
          </Title>
        </div>
        <Row justify="space-between" align="middle" className="mb-3">
          <Col span={18}>
            <CategoryFilters />
          </Col>
          <Col span={6}>
            <SortOptions />
          </Col>
        </Row>
        <div className="site-layout-content">
          <ProductList products={products} onOpenChat={handleOpenChat} />
        </div>
      </Content>
      {selectedProduct && currentUser && isChatVisible && (
        <FloatingChat
          product={{ 
            producto_id: selectedProduct.producto_id, 
            nombre_producto: selectedProduct.nombre_producto || "Producto", 
            precio: selectedProduct.precio 
          }}
          currentUserId={currentUser.usuario_id}
          sellerId={selectedProduct.vendedor_id}
          onClose={handleCloseChat}
        />
      )}
    </Layout>
  );
};

export default HomePage;
