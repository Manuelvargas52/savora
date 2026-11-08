const DEFAULT_RESTAURANT_IMAGE =
  '/images/restaurants/terraza-gourmet.jpg'

const RESTAURANT_IMAGES: Record<string, string> = {
  'la terraza gourmet':
    '/images/restaurants/terraza-gourmet.jpg',

  'pasta & amore':
    '/images/restaurants/pasta-amore.jpg',

  'sushi house':
    '/images/restaurants/sushi-house.jpg',

  'burger station':
    '/images/restaurants/burger-station.jpg',

  'sabores de colombia':
    '/images/restaurants/sabores-colombia.jpg',
}

export const getRestaurantFallbackImage = (
  restaurantName: string
): string => {
  const normalizedName = restaurantName.trim().toLowerCase()

  return RESTAURANT_IMAGES[normalizedName] || DEFAULT_RESTAURANT_IMAGE
}

export const getRestaurantImage = (
  restaurantName: string
): string => {
  return getRestaurantFallbackImage(restaurantName)
}

export const getDefaultRestaurantImage = (): string => {
  return DEFAULT_RESTAURANT_IMAGE
}