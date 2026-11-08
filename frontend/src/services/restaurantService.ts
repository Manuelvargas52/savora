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

// Configuración de conexión con el backend
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
})

// Consultar todos los restaurantes
export const getRestaurants = async (): Promise<Restaurant[]> => {
    const response = await api.get<Restaurant[]>('/restaurants')
    return response.data
}

// Consultar un restaurante por su ID
export const getRestaurantById = async (
    id: number
): Promise<Restaurant> => {
    const response = await api.get<Restaurant>(`/restaurants/${id}`)
    return response.data
}

// Consultar restaurantes por categoría
export const getRestaurantsByCategory = async (
    category: string
): Promise<Restaurant[]> => {
    const response = await api.get<Restaurant[]>(
        `/restaurants/category/${encodeURIComponent(category)}`
    )

    return response.data
}

// Buscar restaurantes por nombre
export const searchRestaurants = async (
    name: string
): Promise<Restaurant[]> => {
    const response = await api.get<Restaurant[]>('/restaurants/search', {
        params: { name },
    })

    return response.data
}