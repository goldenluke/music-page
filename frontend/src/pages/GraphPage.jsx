import { useEffect, useState } from "react"
import axios from "axios"

const API = "http://127.0.0.1:3001/api"

export default function GraphPage() {
  const [data, setData] = useState(null)

  useEffect(() => {
    axios.get(`${API}/graph?node=techno`)
      .then(res => setData(res.data))
  }, [])

  return (
    <div style={{ padding: 20 }}>
      <h2>Graph Explorer</h2>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  )
}
