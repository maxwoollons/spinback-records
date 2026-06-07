import { useEffect, useState } from 'react'
import {
  Button,
  CardMedia,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
} from '@mui/material'
import { coverArtUrl } from '../api'
import type { RecordItem } from '../types'

type Props = {
  record: RecordItem | null
  onClose: () => void
  onConfirm: (name: string) => Promise<void>
}

export default function HireDialog({ record, onClose, onConfirm }: Props) {
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
            <Typography sx={{ fontWeight: 700, lineHeight: 1.3 }}>{record.title}</Typography>
            <Typography variant="body2" color="text.secondary">{record.artist}</Typography>
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
            <Button onClick={onClose} sx={{ color: '#78716c' }}>Cancel</Button>
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
