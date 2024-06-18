import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../store/store';
import { Button, Card, List, Modal, Dropdown, Menu } from 'antd';
import { EllipsisOutlined } from '@ant-design/icons';
import { fetchUserProducts, deleteUserProduct, updateUserProduct, createUserProduct } from '../store/slices/productsSlice';
import { ProductModel } from '../models/models';
import ProductForm from './ProductForm'
import "../styles/misProductos.css";

const MisProductos: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const currentUser = useSelector((state: RootState) => state.user.userData);
  const products = useSelector((state: RootState) => state.products.userProducts);
  const [editProduct, setEditProduct] = useState<ProductModel | null>(null);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isNewModalVisible, setIsNewModalVisible] = useState(false);

  useEffect(() => {
    if (currentUser) {
      dispatch(fetchUserProducts(currentUser.usuario_id));
    }
  }, [currentUser, dispatch]);

  const handleEditProduct = (product: ProductModel) => {
    setEditProduct(product);
    setIsEditModalVisible(true);
  };

  const handleDeleteProduct = (productId: number) => {
    dispatch(deleteUserProduct(productId));
  };

  const handleCreateProduct = (values: any) => {
    if (currentUser) {
      const productData = { 
        ...values, 
        vendedor_id: currentUser.usuario_id, 
        localizacion: currentUser.ubicacion 
      };
      dispatch(createUserProduct(productData));
      setIsNewModalVisible(false);
    }
  };

  const handleUpdateProduct = (values: any) => {
    if (editProduct && currentUser) {
      dispatch(updateUserProduct({ ...editProduct, ...values, producto_id: editProduct.producto_id })).then(() => {
        setIsEditModalVisible(false);
        dispatch(fetchUserProducts(currentUser.usuario_id)); // Forzar actualización de los productos
      });
    }
  };

  const menu = (product: ProductModel, isSold: boolean) => (
    <Menu>
      <Menu.Item key="1" onClick={() => handleEditProduct(product)} disabled={isSold}>Editar</Menu.Item>
      <Menu.Item key="2" onClick={() => handleDeleteProduct(product.producto_id)} disabled={isSold}>Eliminar</Menu.Item>
    </Menu>
  );

  const renderProductCard = (product: ProductModel, isSold: boolean) => (
    <Card
      key={product.producto_id}
      title={
        <div className="product-card-header">
          {product.nombre_producto}
          <Dropdown overlay={menu(product, isSold)} trigger={['click']}>
            <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
              <EllipsisOutlined style={{ fontSize: '24px', transform: 'rotate(90deg)' }} />
            </a>
          </Dropdown>
        </div>
      }
      className={isSold ? 'sold-product' : ''}
    >
      <p>Marca: {product.marca}</p>
      <p>Modelo: {product.modelo}</p>
      <p>Precio: {product.precio}€</p>
      <p>Descripción: {product.descripcion}</p>
      <p>Localización: {product.localizacion}</p>
      <p>Categoría: {product.categoria}</p>
      {isSold && <p className="sold-label">Vendido</p>}
    </Card>
  );

  const availableProducts = products.filter(product => product.disponibilidad === 'disponible');
  const soldProducts = products.filter(product => product.disponibilidad === 'vendido');

  return (
    <div>
      <h2>Mis Productos</h2>
      <Button type="primary" onClick={() => setIsNewModalVisible(true)}>Añadir Nuevo Producto</Button>

      <h3>Disponibles</h3>
      <List
        grid={{ gutter: 16, column: 4 }}
        dataSource={availableProducts}
        renderItem={(product: ProductModel) => (
          <List.Item>
            {renderProductCard(product, false)}
          </List.Item>
        )}
      />

      <h3>Vendidos</h3>
      <List
        grid={{ gutter: 16, column: 4 }}
        dataSource={soldProducts}
        renderItem={(product: ProductModel) => (
          <List.Item>
            {renderProductCard(product, true)}
          </List.Item>
        )}
      />

      <Modal
        title="Editar Producto"
        visible={isEditModalVisible}
        onCancel={() => setIsEditModalVisible(false)}
        footer={null}
      >
        {editProduct && (
          <ProductForm product={editProduct} onSubmit={handleUpdateProduct} />
        )}
      </Modal>

      <Modal
        title="Añadir Nuevo Producto"
        visible={isNewModalVisible}
        onCancel={() => setIsNewModalVisible(false)}
        footer={null}
      >
        <ProductForm onSubmit={handleCreateProduct} />
      </Modal>
    </div>
  );
};

export default MisProductos;

