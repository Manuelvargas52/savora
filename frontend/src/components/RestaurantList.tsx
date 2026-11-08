import { useEffect, useMemo, useState } from 'react'
import { MapPin, Search, Star, Users } from 'lucide-react'

import ReservationForm from './ReservationForm'

import {
    getRestaurants,
    type Restaurant,
} from '../services/restaurantService'

import {
    getRestaurantImage,
    getDefaultRestaurantImage,
} from '../utils/restaurantImages'

function RestaurantList() {
    const [restaurants, setRestaurants] = useState<Restaurant[]>([])
    const [selectedRestaurant, setSelectedRestaurant] = useState<string | null>(
        null
    )
    const [search, setSearch] = useState('')
    const [category, setCategory] = useState('Todos')
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        const loadRestaurants = async () => {
            try {
                setLoading(true)
                setError('')

                const data = await getRestaurants()
                setRestaurants(data)
            } catch (error) {
                console.error('Error al consultar restaurantes:', error)

                setError(
                    'No fue posible cargar los restaurantes. Verifica que el backend esté funcionando.'
                )
            } finally {
                setLoading(false)
            }
        }

        loadRestaurants()
    }, [])

    const categories = useMemo(() => {
        return [
            'Todos',
            ...new Set(restaurants.map((restaurant) => restaurant.category)),
        ]
    }, [restaurants])

    const filteredRestaurants = useMemo(() => {
        return restaurants.filter((restaurant) => {
            const matchesSearch =
                restaurant.name.toLowerCase().includes(search.toLowerCase()) ||
                restaurant.address.toLowerCase().includes(search.toLowerCase()) ||
                restaurant.city.toLowerCase().includes(search.toLowerCase())

            const matchesCategory =
                category === 'Todos' || restaurant.category === category

            return matchesSearch && matchesCategory && restaurant.active
        })
    }, [restaurants, search, category])

    if (loading) {
        return (
            <section className="bg-[#faf9f6] px-6 py-20 text-center">
                <p className="text-lg font-semibold text-[#19352b]">
                    Cargando restaurantes...
                </p>
            </section>
        )
    }

    if (error) {
        return (
            <section className="bg-[#faf9f6] px-6 py-20 text-center">
                <p className="font-semibold text-red-600">{error}</p>

                <button
                    onClick={() => window.location.reload()}
                    className="mt-5 rounded-full bg-[#19352b] px-6 py-3 font-semibold text-white"
                >
                    Intentar nuevamente
                </button>
            </section>
        )
    }

    return (
        <>
            <section className="bg-[#faf9f6] px-6 py-20">
                <div className="mx-auto max-w-7xl">
                    <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
                        <div>
                            <span className="text-sm font-bold uppercase tracking-widest text-[#d97736]">
                                Explora
                            </span>

                            <h2 className="mt-3 text-3xl font-bold md:text-4xl">
                                Descubre restaurantes
                            </h2>

                            <p className="mt-3 text-[#718078]">
                                Encuentra el lugar perfecto para tu próxima experiencia.
                            </p>
                        </div>

                        <div className="relative w-full md:max-w-sm">
                            <Search
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-[#718078]"
                                size={20}
                            />

                            <input
                                type="text"
                                value={search}
                                onChange={(event) => setSearch(event.target.value)}
                                placeholder="Buscar restaurante o ubicación..."
                                className="w-full rounded-full border border-[#e2e4dd] bg-white py-4 pl-12 pr-5 outline-none transition focus:border-[#19352b]"
                            />
                        </div>
                    </div>

                    <div className="mt-8 flex flex-wrap gap-3">
                        {categories.map((item) => (
                            <button
                                key={item}
                                onClick={() => setCategory(item)}
                                className={`rounded-full px-5 py-2.5 text-sm font-semibold transition ${category === item
                                        ? 'bg-[#19352b] text-white'
                                        : 'border border-[#e2e4dd] bg-white text-[#718078] hover:border-[#19352b]'
                                    }`}
                            >
                                {item}
                            </button>
                        ))}
                    </div>

                    <div className="mt-10 grid gap-7 md:grid-cols-2 lg:grid-cols-3">
                        {filteredRestaurants.map((restaurant) => (
                            <article
                                key={restaurant.id}
                                className="overflow-hidden rounded-3xl border border-[#eeeee8] bg-white transition hover:-translate-y-1 hover:shadow-xl"
                            >
                                <div className="relative">
                                    <img
                                        src={getRestaurantImage(
                                            restaurant.name,
                                            restaurant.imageUrl
                                        )}
                                        alt={restaurant.name}
                                        className="h-56 w-full object-cover"
                                        loading="lazy"
                                        onError={(event) => {
                                            event.currentTarget.onerror = null
                                            event.currentTarget.src = getDefaultRestaurantImage()
                                        }}
                                    />

                                    <span className="absolute right-4 top-4 rounded-full bg-white px-3 py-2 text-sm font-bold shadow">
                                        {restaurant.priceLevel || '$$'}
                                    </span>
                                </div>

                                <div className="p-6">
                                    <div className="flex items-start justify-between gap-3">
                                        <div>
                                            <span className="text-xs font-semibold uppercase tracking-wider text-[#d97736]">
                                                {restaurant.category}
                                            </span>

                                            <h3 className="mt-2 text-xl font-bold">
                                                {restaurant.name}
                                            </h3>
                                        </div>

                                        <div className="flex items-center gap-1 rounded-lg bg-[#f3eadf] px-2 py-1 text-sm font-bold">
                                            <Star
                                                size={15}
                                                className="fill-[#d97736] text-[#d97736]"
                                            />
                                            {restaurant.rating ?? 'Nuevo'}
                                        </div>
                                    </div>

                                    <div className="mt-5 space-y-3 text-sm text-[#718078]">
                                        <p className="flex items-center gap-2">
                                            <MapPin size={17} />
                                            {restaurant.address}, {restaurant.city}
                                        </p>

                                        <p className="flex items-center gap-2">
                                            <Users size={17} />
                                            Consulta las mesas disponibles
                                        </p>
                                    </div>

                                    <button
                                        onClick={() => setSelectedRestaurant(restaurant.name)}
                                        className="mt-6 w-full rounded-full bg-[#19352b] py-3.5 font-semibold text-white transition hover:bg-[#294c3e]"
                                    >
                                        Reservar mesa
                                    </button>
                                </div>
                            </article>
                        ))}
                    </div>

                    {filteredRestaurants.length === 0 && (
                        <div className="py-16 text-center">
                            <p className="text-lg font-semibold">
                                No encontramos restaurantes.
                            </p>

                            <p className="mt-2 text-sm text-[#718078]">
                                Intenta con otro nombre o categoría.
                            </p>
                        </div>
                    )}
                </div>
            </section>

            {selectedRestaurant && (
                <ReservationForm
                    restaurantId={
                        restaurants.find(
                            (restaurant) => restaurant.name === selectedRestaurant
                        )!.id
                    }
                    restaurantName={selectedRestaurant}
                    onClose={() => setSelectedRestaurant(null)}
                />
            )}
        </>
    )
}

export default RestaurantList