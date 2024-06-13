import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Form, Input, Button, Typography, Alert } from 'antd';
import { login } from '../store/slices/userSlice';  // Importa desde userSlice

const { Title, Text } = Typography;

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:8000/users/login', {
        email,
        password,
      });
      const { token, user } = response.data;
      dispatch(login({ userData: user, token }));
      navigate('/home');  // Redirige a la página de productos
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        setError(error.response.data.detail);
      } else {
        setError('Ocurrió un error desconocido');
      }
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <div style={{ width: '300px' }}>
        <Title level={2}>Iniciar Sesión</Title>
        {error && <Alert message={error} type="error" showIcon />}
        <Form layout="vertical" onFinish={handleLogin}>
          <Form.Item
            label="Correo Electrónico"
            name="email"
            rules={[{ required: true, message: 'Por favor, ingresa tu correo electrónico' }]}
          >
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Item>
          <Form.Item
            label="Contraseña"
            name="password"
            rules={[{ required: true, message: 'Por favor, ingresa tu contraseña' }]}
          >
            <Input.Password
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Iniciar Sesión
            </Button>
          </Form.Item>
        </Form>
        <div style={{ marginTop: '10px' }}>
          <Text>
            ¿No tienes una cuenta? <Link to="/register">Regístrate</Link>
          </Text>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
