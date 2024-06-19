import React from 'react';
import { Card, Row, Col, Button } from 'antd';
import { ProductModel } from '../models/models';
import "../styles/ProductList.css";

interface ProductListProps {
  products: ProductModel[];
  onOpenChat: (product: ProductModel) => void; 
}

const ProductList: React.FC<ProductListProps> = ({ products, onOpenChat }) => {
  return (
    <Row gutter={[16, 16]} className="product-list">
      {products.map(product => (
        <Col xs={24} sm={12} md={8} lg={6} key={product.producto_id} className="product-col">
          <Card
            className="product-card"
            title={product.nombre_producto}
          >
            <p className="product-detail">Marca: {product.marca}</p>
            <p className="product-detail">Modelo: {product.modelo}</p>
            <p className="product-detail">Precio: {product.precio} €</p>
            <p className="product-detail">Localización: {product.localizacion}</p>
            <Button type="primary" className="chat-button" onClick={() => onOpenChat(product)}>
              Chatear con el vendedor
            </Button>
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default ProductList;
