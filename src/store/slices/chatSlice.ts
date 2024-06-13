import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axiosInstance from '../../utils/axiosInstance';
import { Message } from '../../models/models';

interface ChatState {
  messages: Message[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
}

const initialState: ChatState = {
  messages: [],
  status: 'idle',
};

export const fetchChatMessages = createAsyncThunk(
  'chat/fetchChatMessages',
  async ({ productId, user1Id, user2Id }: { productId: number; user1Id: number; user2Id: number }) => {
    const response = await axiosInstance.get(`/messages/chat/${productId}/${user1Id}/${user2Id}`);
    return response.data;
  }
);

export const fetchUserMessages = createAsyncThunk(
  'chat/fetchUserMessages',
  async (userId: number) => {
    const response = await axiosInstance.get(`/messages/user/${userId}`);
    return response.data;
  }
);

export const sendMessage = createAsyncThunk(
  'chat/sendMessage',
  async (message: Omit<Message, 'mensaje_id'>) => {
    const response = await axiosInstance.post('/messages/', message);
    return response.data;
  }
);

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchChatMessages.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchChatMessages.fulfilled, (state, action: PayloadAction<Message[]>) => {
        state.status = 'succeeded';
        state.messages = action.payload;
      })
      .addCase(fetchChatMessages.rejected, (state) => {
        state.status = 'failed';
      })
      .addCase(fetchUserMessages.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchUserMessages.fulfilled, (state, action: PayloadAction<Message[]>) => {
        state.status = 'succeeded';
        state.messages = action.payload;
      })
      .addCase(fetchUserMessages.rejected, (state) => {
        state.status = 'failed';
      })
      .addCase(sendMessage.fulfilled, (state, action: PayloadAction<Message>) => {
        state.messages.push(action.payload);
      });
  },
});

export default chatSlice.reducer;
