import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../store/store';
import { fetchUserMessages } from '../store/slices/chatSlice';
import { List, Button } from 'antd';
import FloatingChat from './FloatingChat';
import { Message } from '../models/models';

const MisChats: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const currentUser = useSelector((state: RootState) => state.user.userData);
  const { messages, status } = useSelector((state: RootState) => state.chat);
  const [selectedChat, setSelectedChat] = useState<{ productId: number, userId: number } | null>(null);

  useEffect(() => {
    if (currentUser) {
      dispatch(fetchUserMessages(currentUser.usuario_id));
    }
  }, [currentUser, dispatch]);

  const organizeChats = (messages: Message[]) => {
    const chatGroups: { [key: string]: Message[] } = {};

    messages.forEach((message) => {
      const key = `${message.producto_id}-${message.id_usuario_envia === currentUser?.usuario_id ? message.id_usuario_recibe : message.id_usuario_envia}`;
      if (!chatGroups[key]) {
        chatGroups[key] = [];
      }
      chatGroups[key].push(message);
    });

    return chatGroups;
  };

  const chatGroups = organizeChats(messages);

  const handleOpenChat = (productId: number, userId: number) => {
    setSelectedChat({ productId, userId });
  };

  const handleCloseChat = () => {
    setSelectedChat(null);
    if (currentUser) {
      dispatch(fetchUserMessages(currentUser.usuario_id));
    }
  };

  return (
    <div>
      <h2>Mis Chats</h2>
      {status === 'loading' && <p>Cargando...</p>}
      {status === 'failed' && <p>Error al cargar los chats</p>}
      {status === 'succeeded' && (
        <List
          itemLayout="horizontal"
          dataSource={Object.entries(chatGroups)}
          renderItem={([key, messages]) => {
            const [productId, userId] = key.split('-').map(Number);
            return (
              <List.Item>
                <List.Item.Meta
                  title={`Producto ID: ${productId}`}
                  description={
                    <div>
                      <Button onClick={() => handleOpenChat(productId, userId)}>
                        Chat con Usuario ID: {userId}
                      </Button>
                    </div>
                  }
                />
              </List.Item>
            );
          }}
        />
      )}
      {selectedChat && currentUser && (
        <FloatingChat
          product={{ producto_id: selectedChat.productId }}  // Solo pasamos el ID del producto
          currentUserId={currentUser.usuario_id}
          sellerId={selectedChat.userId}
          onClose={handleCloseChat}
        />
      )}
    </div>
  );
};

export default MisChats;