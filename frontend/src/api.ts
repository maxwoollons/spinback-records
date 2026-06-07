import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:7196/api',
  headers: { 'Content-Type': 'application/json' },
})

export const coverArtUrl = (mbId: string) =>
  `https://coverartarchive.org/release-group/${mbId}/front`

export default api
