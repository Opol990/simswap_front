import React, { useEffect, useState } from 'react';
import { List, Input, Button, Modal, notification } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../store/store';
import { fetchChatMessages, sendMessage } from '../store/slices/chatSlice';
import axiosInstance from '../utils/axiosInstance';
import { Message } from '../models/models';
import "../styles/floatingChat.css";

interface FloatingChatProps {
  product: { producto_id: number, nombre_producto: string, precio: number };  // Ajustar para incluir nombre y precio
  currentUserId: number;
  sellerId: number;
  onClose: () => void;
}

const FloatingChat: React.FC<FloatingChatProps> = ({ product, currentUserId, sellerId, onClose }) => {
  const dispatch: AppDispatch = useDispatch();
  const messages = useSelector((state: RootState) => state.chat.messages);
  const [newMessage, setNewMessage] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isSeller, setIsSeller] = useState(false);
  const [isAvailable, setIsAvailable] = useState(true);
  const [otherUserName, setOtherUserName] = useState('');

  useEffect(() => {
    console.log('Fetching chat messages for:', product.producto_id, currentUserId, sellerId);
    dispatch(fetchChatMessages({ productId: product.producto_id, user1Id: currentUserId, user2Id: sellerId }));

    const intervalId = setInterval(() => {
      dispatch(fetchChatMessages({ productId: product.producto_id, user1Id: currentUserId, user2Id: sellerId }));
      axiosInstance.put(`/messages/mark-as-read/${product.producto_id}/${currentUserId}/${sellerId}`);
    }, 5000);

    axiosInstance.put(`/messages/mark-as-read/${product.producto_id}/${currentUserId}/${sellerId}`);

    // Obtener el id del vendedor y disponibilidad
    axiosInstance.get(`/products/vendedor/${product.producto_id}`)
      .then(response => {
        if (response.data.vendedor_id === currentUserId) {
          setIsSeller(true);
        }
        if (response.data.disponibilidad === 'vendido') {
          setIsAvailable(false);
        }
      })
      .catch(error => {
        console.error('Error fetching vendedor ID and disponibilidad:', error);
      });

    // Obtener el nombre del otro usuario
    const otherUserId = sellerId === currentUserId ? currentUserId : sellerId;
    axiosInstance.get(`/users/${otherUserId}`)
      .then(response => {
        setOtherUserName(response.data.nombre);
      })
      .catch(error => {
        console.error('Error fetching other user name:', error);
      });

    return () => clearInterval(intervalId);
  }, [dispatch, product.producto_id, currentUserId, sellerId]);

  const handleSendMessage = () => {
    if (newMessage.trim() !== '') {
      dispatch(sendMessage({
        producto_id: product.producto_id,
        id_usuario_envia: currentUserId,
        id_usuario_recibe: sellerId,
        contenido: newMessage,
        fecha_envio: new Date(),
        leido: false
      }));
      setNewMessage('');
    }
  };

  const handleBuyProduct = async () => {
    try {
      const response = await axiosInstance.post('/create-checkout-session', {
        producto_id: product.producto_id,
        comprador_id: currentUserId,
        vendedor_id: sellerId,
        nombre_producto: product.nombre_producto,  // Pasar el nombre del producto
        monto: product.precio
      });

      if (response.data && response.data.url) {
        // Guardar la información de la transacción en localStorage
        const transaction = {
          producto_id: product.producto_id,
          comprador_id: currentUserId,
          vendedor_id: sellerId,
          monto: product.precio,
          nombre_producto: product.nombre_producto,
          stripe_payment_id: ""
        };
        localStorage.setItem('transaction', JSON.stringify(transaction));

        window.location.href = response.data.url;
      }
    } catch (error) {
      console.error('Error al crear la sesión de pago:', error);
      notification.error({
        message: 'Error',
        description: 'No se pudo crear la sesión de pago. Por favor, inténtalo de nuevo.'
      });
    }
  };

  return (
    <div className="floating-chat">
      <div className="chat-header">
        <h3>Chat sobre Producto: {product.nombre_producto}</h3>
        <Button type="primary" onClick={onClose}>Cerrar</Button>
      </div>
      <div className="chat-body">
        <List
          dataSource={messages}
          renderItem={(item: Message) => (
            <List.Item key={item.mensaje_id}>
              <List.Item.Meta
                title={`${item.id_usuario_envia === currentUserId ? 'Tú' : otherUserName} a las ${new Date(item.fecha_envio).toLocaleTimeString()}`}
                description={item.contenido}
              />
            </List.Item>
          )}
        />
      </div>
      <div className="chat-footer">
        <Input.TextArea
          rows={2}
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Escribe tu mensaje aquí..."
        />
        <Button type="primary" block onClick={handleSendMessage}>
          Enviar
        </Button>
        {!isSeller && isAvailable && (
          <Button type="primary" block onClick={() => setIsModalVisible(true)}>
            Comprar
          </Button>
        )}
      </div>
      <Modal
        title="Confirmar Compra"
        visible={isModalVisible}
        onOk={handleBuyProduct}
        onCancel={() => setIsModalVisible(false)}
      >
        <p>¿Está seguro de que desea comprar este producto por {product.precio}€?</p>
      </Modal>
    </div>
  );
};

export default FloatingChat;
