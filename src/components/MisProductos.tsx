import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../store/store';
import { Button, Card, List, Modal, Dropdown, Menu } from 'antd';
import { fetchUserProducts, deleteUserProduct, updateUserProduct, createUserProduct } from '../store/slices/productsSlice';
import { ProductModel } from '../models/models';
import ProductForm from './ProductForm';

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
    if (editProduct) {
      dispatch(updateUserProduct({ ...editProduct, ...values, producto_id: editProduct.producto_id }));
      setIsEditModalVisible(false);
    }
  };

  const menu = (product: ProductModel) => (
    <Menu>
      <Menu.Item key="1" onClick={() => handleEditProduct(product)}>Editar</Menu.Item>
      <Menu.Item key="2" onClick={() => handleDeleteProduct(product.producto_id)}>Eliminar</Menu.Item>
    </Menu>
  );

  return (
    <div>
      <h2>Mis Productos</h2>
      <Button type="primary" onClick={() => setIsNewModalVisible(true)}>Añadir Nuevo Producto</Button>
      <List
        grid={{ gutter: 16, column: 4 }}
        dataSource={products}
        renderItem={(product: ProductModel) => (
          <List.Item>
            <Card title={product.nombre_producto} extra={
              <Dropdown overlay={menu(product)} trigger={['click']}>
                <Button type="text">...</Button>
              </Dropdown>
            }>
              <p>{product.descripcion}</p>
              <p>{product.precio} €</p>
              <p>{product.localizacion}</p>
              <p>Categoría: {product.categoria}</p>
            </Card>
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
