import axios from 'axios';
import { ProductModel } from '../models/models';
import axiosInstance from '../utils/axiosInstance';


export const getAllProducts = async (): Promise<ProductModel[]> => {
  try {
    const response = await axiosInstance.get('/allproducts');
    return response.data;
  } catch (error) {
    throw new Error('Unable to fetch products');
  }
};

export const getProductsByCategoryName = async (categoryName: string): Promise<ProductModel[]> => {
  let category = categoryName.toLowerCase()
  const response = await axiosInstance.get(`products/category/${category}`);
  return response.data;
};

