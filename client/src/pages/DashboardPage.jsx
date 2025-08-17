import { useEffect, useMemo, useState } from 'react'
import { Container, Typography, Paper, Box, Button, Grid, List, ListItem, ListItemText, Divider } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { fetchFlights } from '../store/flightsSlice.js'
import { fetchBaggageForFlight } from '../store/baggageSlice.js'
import { logout } from '../store/authSlice.js'
import { io } from 'socket.io-client'

export default function DashboardPage() {
  const dispatch = useDispatch()
  const flights = useSelector(s => s.flights.list)
  const token = useSelector(s => s.auth.token)
  const [selectedFlightId, setSelectedFlightId] = useState(null)

  useEffect(() => {
    dispatch(fetchFlights())
  }, [dispatch])

  useEffect(() => {
    if (!token) return
    const socket = io(window.location.origin, { path: '/socket.io' })
    const events = ['flight-created','flight-updated','flight-delayed','gate-changed','baggage-loaded','baggage-unloaded','baggage-in-transit','baggage-at-belt']
    events.forEach(evt => socket.on(evt, () => dispatch(fetchFlights())))
    return () => socket.disconnect()
  }, [token, dispatch])

  const selectedFlight = useMemo(() => flights.find(f => f._id === selectedFlightId) || null, [flights, selectedFlightId])

  useEffect(() => {
    if (selectedFlightId) dispatch(fetchBaggageForFlight(selectedFlightId))
  }, [selectedFlightId, dispatch])

  const baggage = useSelector(s => selectedFlightId ? (s.baggage.byFlight[selectedFlightId] || []) : [])

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4">Operations Dashboard</Typography>
        <Button onClick={() => dispatch(logout())}>Logout</Button>
      </Box>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>Flights</Typography>
            <List>
              {flights.map(f => (
                <>
                  <ListItem key={f._id} button onClick={() => setSelectedFlightId(f._id)} selected={selectedFlightId===f._id}>
                    <ListItemText primary={`${f.flightNumber} ${f.origin}→${f.destination}`} secondary={`Gate ${f.gate || '-'} • ${f.status} • ${new Date(f.scheduledTime).toLocaleString()}`} />
                  </ListItem>
                  <Divider />
                </>
              ))}
            </List>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>Baggage {selectedFlight ? `for ${selectedFlight.flightNumber}` : ''}</Typography>
            {selectedFlight ? (
              <List>
                {baggage.map(b => (
                  <>
                    <ListItem key={b._id}>
                      <ListItemText primary={`${b.tagId} • ${b.passengerName || ''}`} secondary={`${b.status}${b.currentLocation ? ' • ' + b.currentLocation : ''}`} />
                    </ListItem>
                    <Divider />
                  </>
                ))}
              </List>
            ) : (
              <Typography>Select a flight to view baggage.</Typography>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  )
}