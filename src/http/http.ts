import axios from 'axios'
const instance = axios.create({
  timeout: 60000,
  baseURL: 'http://192.168.2.64:8080',
})

instance.interceptors.request.use(
  config => {
    return config
  },
  error => {
    Promise.reject(error)
  }
)

instance.interceptors.response.use(response => {
  return response.data
})
export default instance
