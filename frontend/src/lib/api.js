import axios from "axios"

function getCSRFToken() {
  const name = "csrftoken"
  const cookies = document.cookie.split(";")

  for (let c of cookies) {
    const cookie = c.trim()
    if (cookie.startsWith(name + "=")) {
      return decodeURIComponent(cookie.substring(name.length + 1))
    }
  }
  return null
}

const api = axios.create({
  baseURL: "/api",
  withCredentials: true
})

api.interceptors.request.use((config) => {
  const csrf = getCSRFToken()
  if (csrf) {
    config.headers["X-CSRFToken"] = csrf
  }
  return config
})

export default api
