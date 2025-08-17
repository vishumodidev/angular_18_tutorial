import { configureStore } from '@reduxjs/toolkit'
import authReducer from './authSlice.js'
import flightsReducer from './flightsSlice.js'
import baggageReducer from './baggageSlice.js'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    flights: flightsReducer,
    baggage: baggageReducer,
  }
})