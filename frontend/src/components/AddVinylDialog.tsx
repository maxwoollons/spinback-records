import { useState } from 'react'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material'

type Props = {
  open: boolean
  onClose: () => void
  onAdd: (title: string, artist: string) => Promise<void>
}

export default function AddVinylDialog({ open, onClose, onAdd }: Props) {
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
