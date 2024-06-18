import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface PurchaseState {
  producto_id: number | null;
  comprador_id: number | null;
  vendedor_id: number | null;
  nombre_producto: string | null;
  monto: number | null;
}

const initialState: PurchaseState = {
  producto_id: null,
  comprador_id: null,
  vendedor_id: null,
  nombre_producto: null,
  monto: null,
};

const purchaseSlice = createSlice({
  name: 'purchase',
  initialState,
  reducers: {
    initiatePurchase: (state, action: PayloadAction<PurchaseState>) => {
      state.producto_id = action.payload.producto_id;
      state.comprador_id = action.payload.comprador_id;
      state.vendedor_id = action.payload.vendedor_id;
      state.nombre_producto = action.payload.nombre_producto;
      state.monto = action.payload.monto;
    },
    clearPurchase: (state) => {
      state.producto_id = null;
      state.comprador_id = null;
      state.vendedor_id = null;
      state.nombre_producto = null;
      state.monto = null;
    }
  },
});

export const { initiatePurchase, clearPurchase } = purchaseSlice.actions;

export default purchaseSlice.reducer;
