const DEFAULT_RESTAURANT_IMAGE =
  'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=900'

const RESTAURANT_IMAGES: Record<string, string> = {
  'la terraza gourmet':
    'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=900',

  'pasta & amore':
    'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=900',

  'sushi house':
    'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=900',

  'burger station':
    'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=900',

  'sabores de colombia':
    'https://images.unsplash.com/photo-1515003197210-e0cd7187c17b?w=900',
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
  return imageUrl?.trim() || getRestaurantFallbackImage(restaurantName)
}

export const getDefaultRestaurantImage = (): string => {
  return DEFAULT_RESTAURANT_IMAGE
}