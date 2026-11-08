import axios from 'axios'

// Configuración de Axios
const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Datos para crear una reserva
export interface CreateReservationRequest {
  restaurantId: number
  fullName: string
  email: string
  phone: string
  date: string
  time: string
  guests: number
  comments: string
}

// Datos para modificar una reserva
export interface UpdateReservationRequest {
  date: string
  time: string
  guests: number
  comments: string
}

// Respuesta del backend
export interface ReservationResponse {
  id: number
  reservationDate: string
  reservationTime: string
  durationMinutes: number
  guests: number
  status: string
  comments: string | null
  restaurant: {
    id: number
    name: string
    address: string
    city: string
    imageUrl: string | null
  }
  table: {
    id: number
    tableNumber: number
    capacity: number
  }
  customer: {
    id: number
    fullName: string
    email: string
    phone: string
  }
}

// Crear una reserva
export const createReservation = async (
  reservation: CreateReservationRequest
): Promise<ReservationResponse> => {
  const response = await api.post<ReservationResponse>(
    '/reservations',
    reservation
  )

  return response.data
}

// Cancelar una reserva
export const cancelReservation = async (
  reservationId: number
): Promise<ReservationResponse> => {
  const response = await api.patch<ReservationResponse>(
    `/reservations/${reservationId}/cancel`
  )

  return response.data
}

// Modificar una reserva
export const updateReservation = async (
  reservationId: number,
  reservation: UpdateReservationRequest
): Promise<ReservationResponse> => {
  const response = await api.put<ReservationResponse>(
    `/reservations/${reservationId}`,
    reservation
  )

  return response.data
}

// Consultar horarios disponibles
export const getAvailableReservationTimes = async (
  restaurantId: number,
  date: string,
  guests: number,
  excludeReservationId: number
): Promise<string[]> => {
  const response = await api.get<string[]>(
    '/reservations/available-times',
    {
      params: {
        restaurantId,
        date,
        guests,
        excludeReservationId,
      },
    }
  )

  return response.data
}