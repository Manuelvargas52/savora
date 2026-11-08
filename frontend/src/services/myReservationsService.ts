import axios from 'axios'

// Configuración de conexión con el backend
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Información del restaurante
export interface ReservationRestaurant {
  id: number
  name: string
  address: string
  city: string
  imageUrl: string | null
}

// Información de la mesa
export interface ReservationTable {
  id: number
  tableNumber: number
  capacity: number
}

// Información completa de una reserva
export interface MyReservation {
  id: number
  reservationDate: string
  reservationTime: string
  durationMinutes: number
  guests: number
  status: string
  comments: string | null
  restaurant: ReservationRestaurant
  table: ReservationTable
}

// Consultar reservas por correo electrónico
export const getMyReservations = async (
  email: string
): Promise<MyReservation[]> => {
  const response = await api.get<MyReservation[]>(
    '/reservations/customer/email',
    {
      params: { email },
    }
  )

  return response.data
}