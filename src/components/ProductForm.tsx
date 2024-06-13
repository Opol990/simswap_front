import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Form, Input, Button, Modal, Select } from 'antd';
import { RootState, AppDispatch } from '../store/store';
import { fetchCategories } from '../store/slices/productsSlice';
import { fetchUserDetails } from '../store/slices/userSlice';
import { ProductModel } from '../models/models';

const { Option } = Select;

interface ProductFormProps {
  product?: ProductModel;
  onSubmit: (values: any) => void;
}

const ProductForm: React.FC<ProductFormProps> = ({ product, onSubmit }) => {
  const dispatch: AppDispatch = useDispatch();
  const categories = useSelector((state: RootState) => state.products.categories);
  const currentUser = useSelector((state: RootState) => state.user.userData);

  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchUserDetails());
  }, [dispatch]);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    if (product) {
      form.setFieldsValue({ ...product, category: product.categoria });
    }
    if (currentUser) {
      form.setFieldsValue({ localizacion: currentUser.ubicacion });
    }
  }, [product, currentUser, form]);

  const handleFinish = (values: any) => {
    if (!values.localizacion) {
      setIsModalVisible(true);
      return;
    }
    const productData = { ...values, categoria: values.category };
    if (product) {
      productData.producto_id = product.producto_id;  // Añadimos el ID del producto si estamos editando
    }
    onSubmit(productData);
  };

  const handleModalOk = () => {
    setIsModalVisible(false);
  };

  return (
    <div>
      <Form
        form={form}
        layout="vertical"
        initialValues={product || { localizacion: currentUser?.ubicacion }}
        onFinish={handleFinish}
      >
        <Form.Item label="Nombre del Producto" name="nombre_producto" rules={[{ required: true, message: 'Por favor ingrese el nombre del producto' }]}>
          <Input />
        </Form.Item>
        <Form.Item label="Marca" name="marca" rules={[{ required: true, message: 'Por favor ingrese la marca' }]}>
          <Input />
        </Form.Item>
        <Form.Item label="Modelo" name="modelo" rules={[{ required: true, message: 'Por favor ingrese el modelo' }]}>
          <Input />
        </Form.Item>
        <Form.Item label="Descripción" name="descripcion">
          <Input.TextArea />
        </Form.Item>
        <Form.Item label="Precio" name="precio" rules={[{ required: true, message: 'Por favor ingrese el precio' }]}>
          <Input type="number" />
        </Form.Item>
        <Form.Item label="Localización" name="localizacion">
          <Input disabled />
        </Form.Item>
        <Form.Item label="Categoría" name="category" rules={[{ required: true, message: 'Por favor seleccione una categoría' }]}>
          <Select>
            {categories.map((category) => (
              <Option key={category.categoria_id} value={category.nombre}>
                {category.nombre}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Button type="primary" htmlType="submit">
          {product ? 'Actualizar Producto' : 'Agregar Producto'}
        </Button>
      </Form>

      <Modal
        title="Información Incompleta"
        visible={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalOk}
      >
        <p>Por favor, actualice su información de localización antes de añadir un producto.</p>
      </Modal>
    </div>
  );
};

export default ProductForm;
