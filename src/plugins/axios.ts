import axios from 'axios'

const axiosIns = axios.create({
  // ดึงค่า URL จากไฟล์ .env มาใช้ (ถ้าไม่มีให้ fallback ไปที่ api จำลอง)
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://jsonplaceholder.typicode.com',
  timeout: 10000,
})

export default axiosIns