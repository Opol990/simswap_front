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
    <Row gutter={[16, 16]}>
      {products.map(product => (
        <Col xs={24} sm={12} md={8} lg={6} key={product.producto_id}>
          <Card
            title={product.nombre_producto}
            cover={
              <img
                alt={product.nombre_producto}
                src={product.imagen || '/path-to-default-image/default-image.jpg'}
              />
            }
          >
            <p>{product.marca}</p>
            <p>{product.modelo}</p>
            <p>{product.precio} €</p>
            <p>{product.localizacion}</p>
            <Button type="primary" onClick={() => onOpenChat(product)}>
              Chatear con el vendedor
            </Button>
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default ProductList;
