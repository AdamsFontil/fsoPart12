import axios from 'axios'
console.log('the backend url is -----', process.env.REACT_APP_BACKEND_URL)
const apiClient = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_URL,
})

export default apiClient
