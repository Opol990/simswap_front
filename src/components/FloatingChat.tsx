import React, { useEffect, useState } from 'react';
import { List, Input, Button } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../store/store';
import { fetchChatMessages, sendMessage } from '../store/slices/chatSlice';
import { Message } from '../models/models';
import "../styles/floatingChat.css";

interface FloatingChatProps {
  product: { producto_id: number };
  currentUserId: number;
  sellerId: number;
  onClose: () => void;
}

const FloatingChat: React.FC<FloatingChatProps> = ({ product, currentUserId, sellerId, onClose }) => {
  const dispatch: AppDispatch = useDispatch();
  const messages = useSelector((state: RootState) => state.chat.messages);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    console.log('Fetching chat messages for:', product.producto_id, currentUserId, sellerId);
    dispatch(fetchChatMessages({ productId: product.producto_id, user1Id: currentUserId, user2Id: sellerId }));
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

  return (
    <div className="floating-chat">
      <div className="chat-header">
        <h3>Chat sobre Producto ID: {product.producto_id}</h3>
        <Button type="primary" onClick={onClose}>Cerrar</Button>
      </div>
      <div className="chat-body">
        <List
          dataSource={messages}
          renderItem={(item: Message) => (
            <List.Item key={item.mensaje_id}>
              <List.Item.Meta
                title={`${item.id_usuario_envia === currentUserId ? 'Tú' : 'Vendedor'} a las ${new Date(item.fecha_envio).toLocaleTimeString()}`}
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
      </div>
    </div>
  );
};

export default FloatingChat;
