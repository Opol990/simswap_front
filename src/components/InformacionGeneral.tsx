import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../store/store';
import { Form, Input, Button, Modal } from 'antd';
import { fetchUserDetails, updateUserDetails } from '../store/slices/userSlice';

const InformacionGeneral: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const currentUser = useSelector((state: RootState) => state.user.userData);
  const updateStatus = useSelector((state: RootState) => state.user.status);
  const updateError = useSelector((state: RootState) => state.user.error);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState({ title: '', message: '' });
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    dispatch(fetchUserDetails());
  }, [dispatch]);

  useEffect(() => {
    if (isUpdating) {
      if (updateStatus === 'succeeded') {
        setModalContent({ title: 'Success', message: 'User details updated successfully.' });
        setIsModalVisible(true);
        setIsUpdating(false);
      } else if (updateStatus === 'failed') {
        setModalContent({ title: 'Error', message: updateError || 'Failed to update user details.' });
        setIsModalVisible(true);
        setIsUpdating(false);
      }
    }
  }, [updateStatus, updateError, isUpdating]);

  const handleUpdateUser = (values: any) => {
    setIsUpdating(true);
    dispatch(updateUserDetails(values));
  };

  const handleModalOk = () => {
    setIsModalVisible(false);
  };

  return (
    <div>
      <h2>Información Personal</h2>
      {currentUser && (
        <Form
          layout="vertical"
          initialValues={currentUser}
          onFinish={handleUpdateUser}
        >
          <Form.Item label="Nombre de Usuario" name="username">
            <Input />
          </Form.Item>
          <Form.Item label="Nombre" name="nombre">
            <Input />
          </Form.Item>
          <Form.Item label="Apellido 1" name="apellido1">
            <Input />
          </Form.Item>
          <Form.Item label="Apellido 2" name="apellido2">
            <Input />
          </Form.Item>
          <Form.Item label="Correo Electrónico" name="email">
            <Input disabled />
          </Form.Item>
          <Form.Item label="Fecha de Registro" name="fecha_registro">
            <Input disabled />
          </Form.Item>
          <Form.Item label="Ubicación" name="ubicacion">
            <Input />
          </Form.Item>
          <Button type="primary" htmlType="submit">Actualizar</Button>
        </Form>
      )}

      <Modal
        title={modalContent.title}
        visible={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalOk}
      >
        <p>{modalContent.message}</p>
      </Modal>
    </div>
  );
};

export default InformacionGeneral;
