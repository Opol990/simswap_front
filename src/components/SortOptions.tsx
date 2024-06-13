import React from 'react';
import { Select } from 'antd';
import { useDispatch } from 'react-redux';
import { sortProducts } from '../store/slices/productsSlice';
import { AppDispatch } from '../store/store';
import '../styles/sortOptions.css';

const { Option } = Select;

const SortOptions: React.FC = () => {
    const dispatch: AppDispatch = useDispatch();

    const handleSortChange = (value: string) => {
        dispatch(sortProducts(value));
    };

    return (
        <div className="sort-options">
            <Select defaultValue="novedad" style={{ width: 200 }} onChange={handleSortChange}>
                <Option value="novedad">Novedad</Option>
                <Option value="precio">Precio</Option>
            </Select>
        </div>
    );
};

export default SortOptions;
