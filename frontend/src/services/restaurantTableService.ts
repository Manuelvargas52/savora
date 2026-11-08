import axios from 'axios'

export interface RestaurantTable {
  id: number
  tableNumber: number
  capacity: number
  active: boolean
}

// Configuración de conexión con el backend
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Consultar las mesas de un restaurante
export const getRestaurantTables = async (
  restaurantId: number
): Promise<RestaurantTable[]> => {
  const response = await api.get<RestaurantTable[]>(
    `/restaurants/${restaurantId}/tables`
  )

  return response.data
}