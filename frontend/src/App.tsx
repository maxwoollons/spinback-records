import { useEffect, useState } from 'react'
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Container,
  CssBaseline,
  FormControlLabel,
  Skeleton,
  Snackbar,
  Stack,
  Switch,
  TextField,
  ThemeProvider,
  Typography,
} from '@mui/material'
import api from './api'
import theme from './theme'
import type { RecordItem } from './types'
import AlbumCard from './components/AlbumCard'
import HireDialog from './components/HireDialog'
import AddVinylDialog from './components/AddVinylDialog'

export default function App() {
  const [records, setRecords] = useState<RecordItem[]>([])
  const [artistFilter, setArtistFilter] = useState('')
  const [availableOnly, setAvailableOnly] = useState(false)
  const [hiring, setHiring] = useState<RecordItem | null>(null)
  const [addOpen, setAddOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [snack, setSnack] = useState<{ msg: string; ok: boolean } | null>(null)

  useEffect(() => { loadRecords() }, [])

  const loadRecords = async () => {
    setLoading(true)
    try {
      const { data } = await api.get<RecordItem[]>('/getRecords')
      setRecords(data)
    } catch {
      setSnack({ msg: 'Could not load records', ok: false })
    } finally {
      setLoading(false)
    }
  }

  const openHireDialog = async (record: RecordItem) => {
    try {
      const { data } = await api.get<RecordItem>(`/getRecordById/${record.id}`)
      if (!data.available) {
        setSnack({ msg: 'This record has just been hired out.', ok: false })
        await loadRecords()
        return
      }
      setHiring(data)
    } catch {
      setSnack({ msg: 'Could not load record details.', ok: false })
    }
  }

  const hireRecord = async (name: string) => {
    if (!hiring) return
    try {
      await api.post(`/records/${hiring.id}/hire`, { FirstName: name })
      setSnack({ msg: `"${hiring.title}" is now yours, enjoy!`, ok: true })
      setHiring(null)
      await loadRecords()
    } catch {
      setSnack({ msg: 'Failed to hire record. Please try again.', ok: false })
    }
  }

  const returnRecord = async (record: RecordItem) => {
    try {
      await api.post(`/records/${record.id}/return`)
      setSnack({ msg: `"${record.title}" returned, thanks!`, ok: true })
      await loadRecords()
    } catch {
      setSnack({ msg: 'Failed to return record. Please try again.', ok: false })
    }
  }

  const deleteRecord = async (record: RecordItem) => {
    try {
      await api.delete(`/deleteRecord/${record.id}`)
      setSnack({ msg: `"${record.title}" removed from the collection.`, ok: true })
      await loadRecords()
    } catch {
      setSnack({ msg: 'Failed to delete record. Please try again.', ok: false })
    }
  }

  const addRecord = async (title: string, artist: string) => {
    try {
      await api.post('/addRecord', { Title: title, Artist: artist, Available: true })
      setSnack({ msg: `"${title}" added to the collection!`, ok: true })
      setAddOpen(false)
      await loadRecords()
    } catch {
      setSnack({ msg: 'Failed to add record. Please try again.', ok: false })
    }
  }

  const displayed = records.filter((r) => {
    if (availableOnly && !r.available) return false
    if (artistFilter.trim() && !r.artist.toLowerCase().includes(artistFilter.trim().toLowerCase())) return false
    return true
  })

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ minHeight: '100vh', bgcolor: '#0d0d0d' }}>

        <Box
          sx={{
            background: 'linear-gradient(180deg, #1a1a1a 0%, #0d0d0d 100%)',
            borderBottom: '1px solid #1c1c1c',
            textAlign: 'center',
            py: { xs: 4, md: 6 },
            px: 2,
          }}
        >
          <Typography variant="h4" sx={{ fontWeight: 800, letterSpacing: '-0.03em', color: '#f5f5f4' }}>
            Spinback Records
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.75 }}>
            Just use spotify.
          </Typography>
        </Box>

        <Container maxWidth="lg" sx={{ py: 4 }}>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 4, alignItems: { sm: 'center' } }}>
            <TextField
              fullWidth
              placeholder="Search by artist..."
              value={artistFilter}
              onChange={(e) => setArtistFilter(e.target.value)}
              sx={{ '& .MuiOutlinedInput-root': { bgcolor: '#1a1a1a' } }}
            />
            <FormControlLabel
              control={
                <Switch
                  checked={availableOnly}
                  onChange={(e) => setAvailableOnly(e.target.checked)}
                  sx={{
                    '& .MuiSwitch-switchBase.Mui-checked': { color: '#f59e0b' },
                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { bgcolor: '#f59e0b' },
                  }}
                />
              }
              label={<Typography variant="body2" sx={{ whiteSpace: 'nowrap', color: '#a8a29e' }}>Available only</Typography>}
            />
            <Button
              variant="outlined"
              onClick={() => setAddOpen(true)}
              sx={{
                whiteSpace: 'nowrap',
                borderColor: '#f59e0b',
                color: '#f59e0b',
                '&:hover': { borderColor: '#d97706', color: '#d97706', bgcolor: 'transparent' },
              }}
            >
              + Add Vinyl
            </Button>
          </Stack>

          {!loading && (
            <Typography variant="caption" color="text.secondary" sx={{ mb: 2, display: 'block' }}>
              {displayed.length} {displayed.length === 1 ? 'record' : 'records'}
              {availableOnly ? ' available' : ''}
            </Typography>
          )}

          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(175px, 1fr))', gap: 2.5 }}>
            {loading
              ? Array.from({ length: 8 }).map((_, i) => (
                  <Card key={i} sx={{ pointerEvents: 'none' }}>
                    <Skeleton variant="rectangular" animation="wave" sx={{ aspectRatio: '1 / 1', bgcolor: '#252525' }} />
                    <CardContent sx={{ p: 1.5, pb: '12px !important' }}>
                      <Skeleton animation="wave" sx={{ bgcolor: '#252525', mb: 0.75, borderRadius: 1 }} width="75%" height={16} />
                      <Skeleton animation="wave" sx={{ bgcolor: '#252525', borderRadius: 1 }} width="50%" height={13} />
                      <Skeleton animation="wave" variant="rounded" sx={{ bgcolor: '#252525', mt: 1.5 }} height={30} />
                    </CardContent>
                  </Card>
                ))
              : displayed.map((record) => (
                  <AlbumCard
                    key={record.id}
                    record={record}
                    onHire={setHiring}
                    onReturn={returnRecord}
                    onDelete={deleteRecord}
                  />
                ))}
          </Box>

          {!loading && displayed.length === 0 && (
            <Typography color="text.secondary" sx={{ py: 10, textAlign: 'center' }}>
              No records found.
            </Typography>
          )}

        </Container>
      </Box>

      <HireDialog record={hiring} onClose={() => setHiring(null)} onConfirm={hireRecord} />
      <AddVinylDialog open={addOpen} onClose={() => setAddOpen(false)} onAdd={addRecord} />

      <Snackbar
        open={!!snack}
        autoHideDuration={4000}
        onClose={() => setSnack(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          severity={snack?.ok ? 'success' : 'error'}
          onClose={() => setSnack(null)}
          sx={{ bgcolor: snack?.ok ? '#14532d' : '#450a0a', color: '#f5f5f4' }}
        >
          {snack?.msg}
        </Alert>
      </Snackbar>
    </ThemeProvider>
  )
}
