const DEFAULT_RESTAURANT_IMAGE =
  'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=900'

const RESTAURANT_IMAGES: Record<string, string> = {
  'la terraza gourmet':
    'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=900',

  'pasta & amore':
    'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=900',

  'sushi house':
    'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=900',

  'burger station':
    'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=900',

  'sabores de colombia':
    'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=900',
}

export const getRestaurantFallbackImage = (
  restaurantName: string
): string => {
  const normalizedName = restaurantName.trim().toLowerCase()

  return (
    RESTAURANT_IMAGES[normalizedName] ||
    DEFAULT_RESTAURANT_IMAGE
  )
}

export const getRestaurantImage = (
  restaurantName: string,
  imageUrl?: string | null
): string => {
  // Primero utiliza la imagen asignada al restaurante.
  // Solo utiliza imageUrl del backend si no existe una asignación.
  return (
    RESTAURANT_IMAGES[restaurantName.trim().toLowerCase()] ||
    imageUrl?.trim() ||
    DEFAULT_RESTAURANT_IMAGE
  )
}

export const getDefaultRestaurantImage = (): string => {
  return DEFAULT_RESTAURANT_IMAGE
}