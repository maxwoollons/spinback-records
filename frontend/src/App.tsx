import axios from 'axios'
import { useEffect, useState } from 'react'
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Container,
  CssBaseline,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Skeleton,
  Snackbar,
  Stack,
  Switch,
  TextField,
  ThemeProvider,
  Typography,
  createTheme,
} from '@mui/material'

type RecordItem = {
  id: number
  artist: string
  title: string
  available: boolean
  mbId: string
  hiredBy?: string
  hiredAt?: string
  duration?: number | null
}

const api = axios.create({
  baseURL: 'http://localhost:7196/api',
  headers: { 'Content-Type': 'application/json' },
})

const coverArtUrl = (mbId: string) =>
  `https://coverartarchive.org/release-group/${mbId}/front`

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#f59e0b' },
    background: { default: '#0d0d0d', paper: '#1a1a1a' },
    text: { primary: '#f5f5f4', secondary: '#78716c' },
  },
  typography: {
    fontFamily: '"Inter", system-ui, sans-serif',
  },
  shape: { borderRadius: 10 },
  components: {
    MuiButton: {
      styleOverrides: { root: { textTransform: 'none', fontWeight: 600 } },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          background: '#1a1a1a',
          border: '1px solid #262626',
          transition: 'transform 0.18s ease, box-shadow 0.18s ease',
        },
      },
    },
  },
})

function VinylFallback() {
  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        bgcolor: '#111',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Box
        sx={{
          width: 90,
          height: 90,
          borderRadius: '50%',
          bgcolor: '#1c1c1c',
          border: '22px solid #2e2e2e',
          boxSizing: 'border-box',
          position: 'relative',
          '&::after': {
            content: '""',
            position: 'absolute',
            width: 14,
            height: 14,
            bgcolor: '#444',
            borderRadius: '50%',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          },
        }}
      />
    </Box>
  )
}

const heeHee = new Audio('/heehee.mp3')

function AlbumCard({ record, onHire, onReturn, onDelete }: {
  record: RecordItem
  onHire: (r: RecordItem) => void
  onReturn: (r: RecordItem) => void
  onDelete: (r: RecordItem) => void
}) {
  const [imgError, setImgError] = useState(false)
  const [imgLoaded, setImgLoaded] = useState(false)

  const isMJ = record.artist.toLowerCase().includes('michael jackson') ||
    record.title.toLowerCase().includes('michael jackson')

  const handleMouseEnter = () => {
    if (isMJ) {
      heeHee.currentTime = 0
      heeHee.play()
    }
  }

  return (
    <Card
      onMouseEnter={handleMouseEnter}
      onClick={() => record.available && onHire(record)}
      sx={{
        cursor: record.available ? 'pointer' : 'default',
        '&:hover': { transform: 'translateY(-5px)', boxShadow: '0 16px 48px rgba(0,0,0,0.6)' },
      }}
    >
      <Box sx={{ position: 'relative', aspectRatio: '1 / 1', bgcolor: '#111', overflow: 'hidden' }}>
        {!imgLoaded && !imgError && (
          <Skeleton
            variant="rectangular"
            sx={{ position: 'absolute', inset: 0, height: '100%', bgcolor: '#1e1e1e' }}
          />
        )}
        {imgError ? (
          <VinylFallback />
        ) : (
          <CardMedia
            component="img"
            image={coverArtUrl(record.mbId)}
            alt={`${record.title} cover art`}
            onLoad={() => setImgLoaded(true)}
            onError={() => { setImgError(true); setImgLoaded(true) }}
            sx={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: imgLoaded ? 'block' : 'none',
            }}
          />
        )}
        <Chip
          label={record.available ? 'Available' : 'Hired'}
          size="small"
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            bgcolor: record.available ? '#15803d' : '#292524',
            color: record.available ? '#dcfce7' : '#78716c',
            fontWeight: 700,
            fontSize: '0.65rem',
            height: 22,
          }}
        />
      </Box>
      <CardContent sx={{ p: 1.5, pb: '12px !important' }}>
        <Typography variant="subtitle2" noWrap sx={{ fontWeight: 700, color: '#e7e5e4' }}>
          {record.title}
        </Typography>
        <Typography variant="caption" color="text.secondary" noWrap sx={{ display: 'block' }}>
          {record.artist}
        </Typography>
        {record.available && (
          <Button
            variant="contained"
            size="small"
            fullWidth
            onClick={(e) => { e.stopPropagation(); onHire(record) }}
            sx={{
              mt: 1.5,
              bgcolor: '#f59e0b',
              color: '#000',
              fontWeight: 700,
              fontSize: '0.75rem',
              '&:hover': { bgcolor: '#d97706' },
            }}
          >
            Hire
          </Button>
        )}
        {record.available && (
          <Button
            size="small"
            fullWidth
            onClick={(e) => { e.stopPropagation(); onDelete(record) }}
            sx={{
              mt: 0.75,
              color: '#57534e',
              fontSize: '0.7rem',
              '&:hover': { color: '#ef4444', bgcolor: 'transparent' },
            }}
          >
            Delete
          </Button>
        )}
        {!record.available && (
          <>
            {record.hiredBy && record.hiredBy !== 'Unknown' && (
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                Hired by {record.hiredBy}
              </Typography>
            )}
            <Button
              variant="outlined"
              size="small"
              fullWidth
              onClick={(e) => { e.stopPropagation(); onReturn(record) }}
              sx={{
                mt: 1.5,
                borderColor: '#44403c',
                color: '#a8a29e',
                fontWeight: 700,
                fontSize: '0.75rem',
                '&:hover': { borderColor: '#ef4444', color: '#ef4444', bgcolor: 'transparent' },
              }}
            >
              Return
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  )
}

function HireDialog({
  record,
  onClose,
  onConfirm,
}: {
  record: RecordItem | null
  onClose: () => void
  onConfirm: (name: string) => Promise<void>
}) {
  const [name, setName] = useState('')
  const [busy, setBusy] = useState(false)
  const [imgError, setImgError] = useState(false)

  useEffect(() => {
    if (!record) { setName(''); setImgError(false) }
  }, [record])

  const confirm = async () => {
    if (!name.trim() || busy) return
    setBusy(true)
    await onConfirm(name.trim())
    setBusy(false)
  }

  return (
    <Dialog
      open={!!record}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      slotProps={{ paper: { sx: { bgcolor: '#1a1a1a', border: '1px solid #262626', overflow: 'hidden' } } }}
    >
      {record && (
        <>
          {!imgError && (
            <CardMedia
              component="img"
              image={coverArtUrl(record.mbId)}
              alt={record.title}
              onError={() => setImgError(true)}
              sx={{ width: '100%', maxHeight: 220, objectFit: 'cover' }}
            />
          )}
          <DialogTitle sx={{ pb: 0.5 }}>
            <Typography sx={{ fontWeight: 700, lineHeight: 1.3 }}>
              {record.title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {record.artist}
            </Typography>
          </DialogTitle>
          <DialogContent sx={{ pt: 1.5 }}>
            <TextField
              autoFocus
              fullWidth
              placeholder="Your name, e.g. Jane Smith"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && confirm()}
              sx={{ '& .MuiOutlinedInput-root': { bgcolor: '#111' } }}
            />
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
            <Button onClick={onClose} sx={{ color: '#78716c' }}>
              Cancel
            </Button>
            <Button
              variant="contained"
              disabled={!name.trim() || busy}
              onClick={confirm}
              sx={{ bgcolor: '#f59e0b', color: '#000', '&:hover': { bgcolor: '#d97706' } }}
            >
              {busy ? 'Confirming...' : 'Confirm Hire'}
            </Button>
          </DialogActions>
        </>
      )}
    </Dialog>
  )
}

function AddVinylDialog({ open, onClose, onAdd }: {
  open: boolean
  onClose: () => void
  onAdd: (title: string, artist: string) => Promise<void>
}) {
  const [title, setTitle] = useState('')
  const [artist, setArtist] = useState('')
  const [busy, setBusy] = useState(false)

  const handleClose = () => { setTitle(''); setArtist(''); onClose() }

  const submit = async () => {
    if (!title.trim() || !artist.trim() || busy) return
    setBusy(true)
    await onAdd(title.trim(), artist.trim())
    setBusy(false)
    setTitle(''); setArtist('')
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="xs"
      fullWidth
      slotProps={{ paper: { sx: { bgcolor: '#1a1a1a', border: '1px solid #262626' } } }}
    >
      <DialogTitle sx={{ fontWeight: 700 }}>Add Vinyl</DialogTitle>
      <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: '8px !important' }}>
        <TextField
          autoFocus
          fullWidth
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && submit()}
          sx={{ '& .MuiOutlinedInput-root': { bgcolor: '#111' } }}
        />
        <TextField
          fullWidth
          placeholder="Artist"
          value={artist}
          onChange={(e) => setArtist(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && submit()}
          sx={{ '& .MuiOutlinedInput-root': { bgcolor: '#111' } }}
        />
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
        <Button onClick={handleClose} sx={{ color: '#78716c' }}>Cancel</Button>
        <Button
          variant="contained"
          disabled={!title.trim() || !artist.trim() || busy}
          onClick={submit}
          sx={{ bgcolor: '#f59e0b', color: '#000', '&:hover': { bgcolor: '#d97706' } }}
        >
          {busy ? 'Adding...' : 'Add'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default function App() {
  const [records, setRecords] = useState<RecordItem[]>([])
  const [artistFilter, setArtistFilter] = useState('')
  const [availableOnly, setAvailableOnly] = useState(false)
  const [hiring, setHiring] = useState<RecordItem | null>(null)
  const [addOpen, setAddOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [snack, setSnack] = useState<{ msg: string; ok: boolean } | null>(null)

  useEffect(() => { load() }, [])

  const load = async () => {
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

  const hireRecord = async (name: string) => {
    if (!hiring) return
    try {
      await api.post(`/records/${hiring.id}/hire`, { FirstName: name })
      setSnack({ msg: `"${hiring.title}" is now yours, enjoy!`, ok: true })
      setHiring(null)
      await load()
    } catch {
      setSnack({ msg: 'Failed to hire record. Please try again.', ok: false })
    }
  }

  const returnRecord = async (record: RecordItem) => {
    try {
      await api.post(`/records/${record.id}/return`)
      setSnack({ msg: `"${record.title}" returned, thanks!`, ok: true })
      await load()
    } catch {
      setSnack({ msg: 'Failed to return record. Please try again.', ok: false })
    }
  }

  const deleteRecord = async (record: RecordItem) => {
    try {
      await api.delete(`/deleteRecord/${record.id}`)
      setSnack({ msg: `"${record.title}" removed from the collection.`, ok: true })
      await load()
    } catch {
      setSnack({ msg: 'Failed to delete record. Please try again.', ok: false })
    }
  }

  const addRecord = async (title: string, artist: string) => {
    try {
      await api.post('/records', { Title: title, Artist: artist, Available: true })
      setSnack({ msg: `"${title}" added to the collection!`, ok: true })
      setAddOpen(false)
      await load()
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
          <Typography
            variant="h4"
            sx={{ fontWeight: 800, letterSpacing: '-0.03em', color: '#f5f5f4' }}
          >
            Spinback Records
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.75 }}>
            Hire vinyl &nbsp;·&nbsp; Listen &nbsp;·&nbsp; Return
          </Typography>
        </Box>

        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2}
            sx={{ mb: 4, alignItems: { sm: 'center' } }}
          >
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
              label={
                <Typography variant="body2" sx={{ whiteSpace: 'nowrap', color: '#a8a29e' }}>
                  Available only
                </Typography>
              }
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

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(175px, 1fr))',
              gap: 2.5,
            }}
          >
            {loading
              ? Array.from({ length: 8 }).map((_, i) => (
                  <Card key={i} sx={{ pointerEvents: 'none' }}>
                    <Skeleton
                      variant="rectangular"
                      animation="wave"
                      sx={{ aspectRatio: '1 / 1', bgcolor: '#252525' }}
                    />
                    <CardContent sx={{ p: 1.5, pb: '12px !important' }}>
                      <Skeleton animation="wave" sx={{ bgcolor: '#252525', mb: 0.75, borderRadius: 1 }} width="75%" height={16} />
                      <Skeleton animation="wave" sx={{ bgcolor: '#252525', borderRadius: 1 }} width="50%" height={13} />
                      <Skeleton animation="wave" variant="rounded" sx={{ bgcolor: '#252525', mt: 1.5 }} height={30} />
                    </CardContent>
                  </Card>
                ))

              : displayed.length === 0
              ? null
              : displayed.map((record) => (
                  <AlbumCard key={record.id} record={record} onHire={setHiring} onReturn={returnRecord} onDelete={deleteRecord} />
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
