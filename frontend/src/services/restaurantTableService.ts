
import axios from 'axios'

export interface RestaurantTable {
  id: number
  tableNumber: number
  capacity: number
  active: boolean
}

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
})

export const getRestaurantTables = async (
  restaurantId: number
): Promise<RestaurantTable[]> => {
  const response = await api.get<RestaurantTable[]>(
    `/restaurants/${restaurantId}/tables`
  )

  return response.data
}
