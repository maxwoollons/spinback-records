export type RecordItem = {
  id: number
  artist: string
  title: string
  available: boolean
  mbId: string
  hiredBy?: string
  hiredAt?: string
  duration?: number | null
}
