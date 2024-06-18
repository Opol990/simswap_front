import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../store/store';
import axiosInstance from '../utils/axiosInstance';
import { notification } from 'antd';
import { useNavigate } from 'react-router-dom';

const CheckoutSuccess: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const completePurchase = async () => {
      const transactionData = localStorage.getItem('transaction');
      if (transactionData) {
        const transaction = JSON.parse(transactionData);
        console.log(transaction)
        try {
          const response = await axiosInstance.post('/purchase_product', transaction);
          if (response.data) {
            notification.success({
              message: 'Compra completada',
              description: 'El producto ha sido comprado exitosamente.'
            });

            // Limpiar los datos de la transacción del localStorage
            localStorage.removeItem('transaction');

            // Navegar a la página de inicio o cualquier otra página
            navigate('/home');
          }
        } catch (error) {
          console.error('Error al completar la compra:', error);
          notification.error({
            message: 'Error',
            description: 'No se pudo completar la compra. Por favor, inténtalo de nuevo.'
          });
        }
      }
    };

    completePurchase();
  }, [dispatch, navigate]);

  return (
    <div>
      <h2>Compra exitosa</h2>
      <p>Tu compra ha sido completada exitosamente.</p>
    </div>
  );
};

export default CheckoutSuccess;
