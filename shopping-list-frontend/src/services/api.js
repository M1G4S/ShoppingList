import axios from 'axios'

const api = axios.create({
  baseURL: 'https://shoppinglist-production-8ca0.up.railway.app/api',
})

export default api