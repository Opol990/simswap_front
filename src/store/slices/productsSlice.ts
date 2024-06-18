// store/slices/productsSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axiosInstance from '../../utils/axiosInstance';
import { ProductModel } from '../../models/models';

interface ProductsState {
  products: ProductModel[];
  userProducts: ProductModel[];
  filteredProducts: ProductModel[];
  categories: { categoria_id: number; nombre: string }[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: ProductsState = {
  products: [],
  userProducts: [],
  filteredProducts: [],
  categories: [],
  status: 'idle',
  error: null,
};

export const fetchProducts = createAsyncThunk('products/fetchProducts', async () => {
  const response = await axiosInstance.get('/allproducts');
  return response.data;
});

export const fetchUserProducts = createAsyncThunk('products/fetchUserProducts', async (userId: number) => {
  const response = await axiosInstance.get(`/users/${userId}/products`);
  return response.data;
});

export const createUserProduct = createAsyncThunk('products/createUserProduct', async (product: ProductModel) => {
  const response = await axiosInstance.post('/products', product);
  return response.data;
});

export const updateUserProduct = createAsyncThunk('products/updateUserProduct', async (product: ProductModel) => {
  const response = await axiosInstance.put(`/products/${product.producto_id}`, product);
  return response.data;
});

export const deleteUserProduct = createAsyncThunk('products/deleteUserProduct', async (productId: number) => {
  await axiosInstance.delete(`/products/${productId}`);
  return productId;
});

export const filterProductsByCategory = createAsyncThunk('products/filterProductsByCategory', async (categoryName: string) => {
  const response = await axiosInstance.get(`/products/category/${categoryName}`);
  return response.data;
});

export const fetchCategories = createAsyncThunk('products/fetchCategories', async () => {
  const response = await axiosInstance.get('/categories');
  return response.data;
});

export const fetchProductById = createAsyncThunk('products/fetchProductById', async (productId: number) => {
  const response = await axiosInstance.get(`/products/${productId}`);
  return response.data;
});

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    sortProducts: (state, action: PayloadAction<string>) => {
      switch (action.payload) {
        case 'novedad':
          state.filteredProducts = [...state.filteredProducts].sort((a, b) => new Date(b.fecha_publicacion).getTime() - new Date(a.fecha_publicacion).getTime());
          break;
        case 'precio':
          state.filteredProducts = [...state.filteredProducts].sort((a, b) => a.precio - b.precio);
          break;
        default:
          break;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.fulfilled, (state, action: PayloadAction<ProductModel[]>) => {
        state.status = 'succeeded';
        state.products = action.payload;
        state.filteredProducts = action.payload;
      })
      .addCase(fetchUserProducts.fulfilled, (state, action: PayloadAction<ProductModel[]>) => {
        state.status = 'succeeded';
        state.userProducts = action.payload;
      })
      .addCase(createUserProduct.fulfilled, (state, action: PayloadAction<ProductModel>) => {
        state.userProducts.push(action.payload);
      })
      .addCase(updateUserProduct.fulfilled, (state, action: PayloadAction<ProductModel>) => {
        const index = state.userProducts.findIndex(product => product.producto_id === action.payload.producto_id);
        if (index !== -1) {
          state.userProducts[index] = action.payload;
        }
      })
      .addCase(deleteUserProduct.fulfilled, (state, action: PayloadAction<number>) => {
        state.userProducts = state.userProducts.filter(product => product.producto_id !== action.payload);
      })
      .addCase(filterProductsByCategory.fulfilled, (state, action: PayloadAction<ProductModel[]>) => {
        state.filteredProducts = action.payload;
      })
      .addCase(fetchCategories.fulfilled, (state, action: PayloadAction<{ categoria_id: number; nombre: string }[]>) => {
        state.categories = action.payload;
      })
      .addCase(fetchProductById.fulfilled, (state, action: PayloadAction<ProductModel>) => {
        const existingProductIndex = state.products.findIndex(p => p.producto_id === action.payload.producto_id);
        if (existingProductIndex >= 0) {
          state.products[existingProductIndex] = action.payload;
        } else {
          state.products.push(action.payload);
        }
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.error = action.error.message || "Failed to fetch product details";
      });
  },
});

export const { sortProducts } = productsSlice.actions;

export default productsSlice.reducer;
