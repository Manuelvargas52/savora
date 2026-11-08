
import axios from 'axios'

export interface Restaurant {
    id: number
    name: string
    description: string | null
    category: string
    address: string
    city: string
    phone: string | null
    email: string | null
    imageUrl: string | null
    openingTime: string
    closingTime: string
    active: boolean
    createdAt: string
    rating: number | null
    priceLevel: string | null
}

const api = axios.create({
    baseURL: 'http://localhost:8080/api',
    headers: {
        'Content-Type': 'application/json',
    },
})

export const getRestaurants = async (): Promise<Restaurant[]> => {
    const response = await api.get<Restaurant[]>('/restaurants')
    return response.data
}

export const getRestaurantById = async (
    id: number
): Promise<Restaurant> => {
    const response = await api.get<Restaurant>(`/restaurants/${id}`)
    return response.data
}

export const getRestaurantsByCategory = async (
    category: string
): Promise<Restaurant[]> => {
    const response = await api.get<Restaurant[]>(
        `/restaurants/category/${encodeURIComponent(category)}`
    )

    return response.data
}

export const searchRestaurants = async (
    name: string
): Promise<Restaurant[]> => {
    const response = await api.get<Restaurant[]>('/restaurants/search', {
        params: { name },
    })

    return response.data
}
