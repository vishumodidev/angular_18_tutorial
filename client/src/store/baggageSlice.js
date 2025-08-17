import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

export const fetchBaggageForFlight = createAsyncThunk('baggage/byFlight', async (flightId, thunk) => {
  const token = thunk.getState().auth.token
  const res = await axios.get(`/api/baggage/flight/${flightId}`, { headers: { Authorization: `Bearer ${token}` } })
  return res.data
})

const baggageSlice = createSlice({
  name: 'baggage',
  initialState: { byFlight: {}, status: 'idle' },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchBaggageForFlight.pending, (state) => { state.status = 'loading' })
      .addCase(fetchBaggageForFlight.fulfilled, (state, action) => {
        state.status = 'succeeded'
        const flightId = action.meta.arg
        state.byFlight[flightId] = action.payload
      })
  }
})

export default baggageSlice.reducer