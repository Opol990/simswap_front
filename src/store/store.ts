import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import productsReducer from './slices/productsSlice';
import authReducer from './slices/authSlice';
import chatReducer from './slices/chatSlice';
import purchaseSlice from './slices/purchaseSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    products: productsReducer,
    chat: chatReducer,
    purchase: purchaseSlice
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
