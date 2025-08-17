import { useState } from 'react'
import { Container, Box, TextField, Button, Typography, Paper } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { login } from '../store/authSlice.js'
import { Navigate } from 'react-router-dom'

export default function LoginPage() {
  const dispatch = useDispatch()
  const { token, status } = useSelector(s => s.auth)
  const [email, setEmail] = useState('admin@airport.local')
  const [password, setPassword] = useState('admin123')

  if (token) return <Navigate to="/" replace />

  return (
    <Container maxWidth="xs" sx={{ display: 'flex', alignItems: 'center', minHeight: '100vh' }}>
      <Paper sx={{ p: 3, width: '100%' }}>
        <Typography variant="h5" gutterBottom>Airport Ops Login</Typography>
        <Box component="form" onSubmit={e => { e.preventDefault(); dispatch(login({ email, password })) }}>
          <TextField fullWidth margin="normal" label="Email" value={email} onChange={e => setEmail(e.target.value)} />
          <TextField fullWidth margin="normal" type="password" label="Password" value={password} onChange={e => setPassword(e.target.value)} />
          <Button fullWidth variant="contained" type="submit" disabled={status==='loading'}>Login</Button>
        </Box>
      </Paper>
    </Container>
  )
}