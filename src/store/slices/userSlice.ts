import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axiosInstance from '../../utils/axiosInstance';
import { RootState } from '../store';

interface UserState {
  isAuthenticated: boolean;
  userData: { id: number; [key: string]: any } | null;
  token: string | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null; // Agregar estado de error
}

const initialState: UserState = {
  isAuthenticated: false,
  userData: null,
  token: localStorage.getItem('token'),
  status: 'idle',
  error: null, // Inicializar estado de error
};

export const fetchUserDetails = createAsyncThunk('user/fetchUserDetails', async (_, { getState }) => {
  const state = getState() as RootState;
  const token = state.user.token;
  const response = await axiosInstance.get('/users/me', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
});

export const updateUserDetails = createAsyncThunk('user/updateUserDetails', async (userData: { username?: string; nombre?: string; apellido1?: string; apellido2?: string; email?: string; hash_contraseña?: string; fecha_registro?: string; ubicacion?: string }) => {
  const response = await axiosInstance.put('/users/me', userData);
  return response.data;
});

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<{ userData: { id: number; [key: string]: any }; token: string }>) => {
      state.isAuthenticated = true;
      state.userData = action.payload.userData;
      state.token = action.payload.token;
      localStorage.setItem('token', action.payload.token);
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.userData = null;
      state.token = null;
      localStorage.removeItem('token');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserDetails.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchUserDetails.fulfilled, (state, action: PayloadAction<{ id: number; [key: string]: any }>) => {
        state.status = 'succeeded';
        state.userData = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(fetchUserDetails.rejected, (state) => {
        state.status = 'failed';
        state.isAuthenticated = false;
        state.token = null;
        state.error = "Failed to fetch user details"; // Establecer mensaje de error
        localStorage.removeItem('token');
      })
      .addCase(updateUserDetails.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateUserDetails.fulfilled, (state, action: PayloadAction<{ id: number; [key: string]: any }>) => {
        state.status = 'succeeded';
        state.userData = action.payload;
        state.error = null; // Limpiar error en caso de éxito
      })
      .addCase(updateUserDetails.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || "Failed to update user details"; // Establecer mensaje de error
      });
  },
});

export const { login, logout } = userSlice.actions;

export const selectUser = (state: RootState) => state.user;

export default userSlice.reducer;
