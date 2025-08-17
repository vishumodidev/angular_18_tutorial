import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

const saved = localStorage.getItem('token')

export const login = createAsyncThunk('auth/login', async ({ email, password }) => {
  const res = await axios.post('/api/auth/login', { email, password })
  return res.data
})

export const fetchMe = createAsyncThunk('auth/me', async (_, thunk) => {
  const token = thunk.getState().auth.token
  if (!token) throw new Error('No token')
  const res = await axios.get('/api/auth/me', { headers: { Authorization: `Bearer ${token}` } })
  return res.data.user
})

const authSlice = createSlice({
  name: 'auth',
  initialState: { token: saved || null, user: null, status: 'idle', error: null },
  reducers: {
    logout(state) {
      state.token = null
      state.user = null
      localStorage.removeItem('token')
    }
  },
  extraReducers: builder => {
    builder
      .addCase(login.pending, (state) => { state.status = 'loading' })
      .addCase(login.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.token = action.payload.token
        state.user = action.payload.user
        localStorage.setItem('token', state.token)
      })
      .addCase(login.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message
      })
      .addCase(fetchMe.fulfilled, (state, action) => {
        state.user = action.payload
      })
  }
})

export const { logout } = authSlice.actions
export default authSlice.reducer