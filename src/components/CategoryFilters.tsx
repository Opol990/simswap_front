import React, { useEffect, useState } from 'react';
import { Button, Space } from 'antd';
import { useDispatch } from 'react-redux';
import { fetchProducts, filterProductsByCategory } from '../store/slices/productsSlice';
import { AppDispatch } from '../store/store';
import axiosInstance from '../utils/axiosInstance';
import '../styles/categoryFilters.css';

const CategoryFilters: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axiosInstance.get('/categories');
        setCategories(['Todos', ...response.data.map((category: { nombre: string }) => category.nombre)]);
      } catch (error) {
        console.error('Error fetching categories', error);
      }
    };

    fetchCategories();
  }, []);

  const handleCategoryClick = (categoryName: string) => {
    if (categoryName === 'Todos') {
      dispatch(fetchProducts());
    } else {
      dispatch(filterProductsByCategory(categoryName));
    }
  };

  return (
    <Space className="category-list" size="middle">
      {categories.map(category => (
        <Button key={category} className="category-button" onClick={() => handleCategoryClick(category)}>
          {category}
        </Button>
      ))}
    </Space>
  );
};

export default CategoryFilters;
