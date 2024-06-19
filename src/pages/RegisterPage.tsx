// src/pages/RegisterPage.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Form, Input, Button, Typography, Alert, Select } from 'antd';
import { getGeolocation } from '../utils/geolocation';
import "../styles/registerPage.css";

const { Title } = Typography;
const { Option } = Select;

interface GeoapifyFeature {
  properties: {
    formatted: string;
    lat: number;
    lon: number;
  };
}

const RegisterPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [nombre, setNombre] = useState('');
  const [apellido1, setApellido1] = useState('');
  const [apellido2, setApellido2] = useState('');
  const [email, setEmail] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [ubicacion, setUbicacion] = useState('');
  const [ubicacionOpciones, setUbicacionOpciones] = useState<GeoapifyFeature[]>([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSearchUbicacion = async (value: string) => {
    if (value) {
      const results = await getGeolocation(value);
      setUbicacionOpciones(results);
    } else {
      setUbicacionOpciones([]);
    }
  };

  const handleSelectUbicacion = (value: string) => {
    setUbicacion(value);
  };

  const handleRegister = async () => {
    try {
      const response = await axios.post('http://localhost:8000/users/signup', {
        username,
        nombre,
        apellido1,
        apellido2,
        email,
        contraseña,
        ubicacion,
      });
      navigate('/login');
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        setError(error.response.data.detail);
      } else {
        setError('Ocurrió un error desconocido');
      }
    }
  };

  return (
    <div className="register-page">
      <div className="register-card">
        <Title level={2}>Registrarse</Title>
        {error && <Alert message={error} type="error" showIcon />}
        <Form layout="vertical" onFinish={handleRegister}>
          <Form.Item
            label="Nombre de Usuario"
            name="username"
            rules={[{ required: true, message: 'Por favor, ingresa tu nombre de usuario' }]}
          >
            <Input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </Form.Item>
          <Form.Item
            label="Nombre"
            name="nombre"
            rules={[{ required: true, message: 'Por favor, ingresa tu nombre' }]}
          >
            <Input
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
          </Form.Item>
          <Form.Item
            label="Primer Apellido"
            name="apellido1"
            rules={[{ required: true, message: 'Por favor, ingresa tu primer apellido' }]}
          >
            <Input
              value={apellido1}
              onChange={(e) => setApellido1(e.target.value)}
            />
          </Form.Item>
          <Form.Item
            label="Segundo Apellido"
            name="apellido2"
          >
            <Input
              value={apellido2}
              onChange={(e) => setApellido2(e.target.value)}
            />
          </Form.Item>
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
            name="contraseña"
            rules={[{ required: true, message: 'Por favor, ingresa tu contraseña' }]}
          >
            <Input.Password
              value={contraseña}
              onChange={(e) => setContraseña(e.target.value)}
            />
          </Form.Item>
          <Form.Item
            label="Dirección Completa"
            name="ubicacion"
            rules={[{ required: true, message: 'Por favor, ingresa tu dirección completa' }]}
          >
            <Select
              showSearch
              value={ubicacion}
              placeholder="Busca tu ubicación"
              onSearch={handleSearchUbicacion}
              onChange={handleSelectUbicacion}
              filterOption={false}
              notFoundContent={null}
            >
              {ubicacionOpciones.map((option) => (
                <Option key={option.properties.formatted} value={option.properties.formatted}>
                  {option.properties.formatted}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Registrarse
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default RegisterPage;
