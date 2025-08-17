import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import { io } from 'socket.io-client'

let socket = null

export const fetchFlights = createAsyncThunk('flights/fetch', async (_, thunk) => {
  const token = thunk.getState().auth.token
  const res = await axios.get('/api/flights', { headers: { Authorization: `Bearer ${token}` } })
  return res.data
})

export const createFlight = createAsyncThunk('flights/create', async (payload, thunk) => {
  const token = thunk.getState().auth.token
  const res = await axios.post('/api/flights', payload, { headers: { Authorization: `Bearer ${token}` } })
  return res.data
})

const flightsSlice = createSlice({
  name: 'flights',
  initialState: { list: [], status: 'idle' },
  reducers: {
    ensureSocket(state, action) {}
  },
  extraReducers: builder => {
    builder
      .addCase(fetchFlights.pending, (state) => { state.status = 'loading' })
      .addCase(fetchFlights.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.list = action.payload
      })
  }
})

export function connectFlightSocket(baseUrl = '') {
  if (socket) return socket
  socket = io(baseUrl || window.location.origin, { path: '/socket.io' })
  return socket
}

export default flightsSlice.reducer