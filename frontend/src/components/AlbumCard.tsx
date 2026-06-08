import { useState } from 'react'
import { Box, Button, Card, CardContent, CardMedia, Chip, Skeleton, Typography } from '@mui/material'
import { coverArtUrl } from '../api'
import type { RecordItem } from '../types'

function VinylFallback() {
  return (
    <Box sx={{ width: '100%', height: '100%', bgcolor: '#111', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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

type Props = {
  record: RecordItem
  onHire: (r: RecordItem) => void
  onReturn: (r: RecordItem) => void
  onDelete: (r: RecordItem) => void
}

export default function AlbumCard({ record, onHire, onReturn, onDelete }: Props) {
  const [imgError, setImgError] = useState(false)
  const [imgLoaded, setImgLoaded] = useState(false)

  return (
    <Card
      onClick={() => record.available && onHire(record)}
      sx={{
        cursor: record.available ? 'pointer' : 'default',
        '&:hover': { transform: 'translateY(-5px)', boxShadow: '0 16px 48px rgba(0,0,0,0.6)' },
      }}
    >
      <Box sx={{ position: 'relative', aspectRatio: '1 / 1', bgcolor: '#111', overflow: 'hidden' }}>
        {!imgLoaded && !imgError && (
          <Skeleton variant="rectangular" sx={{ position: 'absolute', inset: 0, height: '100%', bgcolor: '#1e1e1e' }} />
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
            sx={{ width: '100%', height: '100%', objectFit: 'cover', display: imgLoaded ? 'block' : 'none' }}
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
          <>
            <Button
              variant="contained"
              size="small"
              fullWidth
              onClick={(e) => { e.stopPropagation(); onHire(record) }}
              sx={{ mt: 1.5, bgcolor: '#f59e0b', color: '#000', fontWeight: 700, fontSize: '0.75rem', '&:hover': { bgcolor: '#d97706' } }}
            >
              Hire
            </Button>
            <Button
              size="small"
              fullWidth
              onClick={(e) => { e.stopPropagation(); onDelete(record) }}
              sx={{ mt: 0.75, color: '#57534e', fontSize: '0.7rem', '&:hover': { color: '#ef4444', bgcolor: 'transparent' } }}
            >
              Delete
            </Button>
          </>
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
