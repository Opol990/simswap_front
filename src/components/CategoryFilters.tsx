import React, { useEffect, useState } from 'react';
import Slider from 'react-slick';
import { Button } from 'antd';
import { useDispatch } from 'react-redux';
import { fetchProducts, filterProductsByCategory } from '../store/slices/productsSlice';
import { AppDispatch } from '../store/store';
import axiosInstance from '../utils/axiosInstance';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
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

  const settings = {
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />
  };

  return (
    <div className="category-slider-container">
      <Slider {...settings} className="category-slider">
        {categories.map(category => (
          <div key={category} className="category-slide">
            <Button className="category-button" onClick={() => handleCategoryClick(category)}>
              {category}
            </Button>
          </div>
        ))}
      </Slider>
    </div>
  );
};

function SampleNextArrow(props: any) {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{ ...style, display: 'block', right: 0, zIndex: 2 }}
      onClick={onClick}
    />
  );
}

function SamplePrevArrow(props: any) {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{ ...style, display: 'block', left: 0, zIndex: 2 }}
      onClick={onClick}
    />
  );
}

export default CategoryFilters;
