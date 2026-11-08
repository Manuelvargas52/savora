
import { useEffect, useState } from 'react'
import { CalendarDays, Clock, Users, X } from 'lucide-react'

import {
  createReservation,
  type ReservationResponse,
} from '../services/reservationService'

import {
  getRestaurantById,
  type Restaurant,
} from '../services/restaurantService'

interface ReservationFormProps {
  restaurantId: number
  restaurantName: string
  onClose: () => void
}

const RESERVATION_DURATION = 60
const SLOT_INTERVAL = 30

function ReservationForm({
  restaurantId,
  restaurantName,
  onClose,
}: ReservationFormProps) {
  const [form, setForm] = useState({
    customerName: '',
    email: '',
    phone: '',
    date: '',
    time: '',
    guests: '2',
    comments: '',
  })

  const [restaurant, setRestaurant] = useState<Restaurant | null>(null)
  const [loadingRestaurant, setLoadingRestaurant] = useState(true)
  const [restaurantError, setRestaurantError] = useState('')

  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [reservation, setReservation] =
    useState<ReservationResponse | null>(null)

  const today = new Date().toLocaleDateString('en-CA')

  // Consultar los horarios del restaurante
  useEffect(() => {
    const loadRestaurant = async () => {
      try {
        setLoadingRestaurant(true)
        setRestaurantError('')

        const data = await getRestaurantById(restaurantId)
        setRestaurant(data)
      } catch (error) {
        console.error('Error al consultar restaurante:', error)
        setRestaurantError(
          'No fue posible consultar el horario del restaurante.'
        )
      } finally {
        setLoadingRestaurant(false)
      }
    }

    loadRestaurant()
  }, [restaurantId])

  // Convertir una hora HH:mm o HH:mm:ss a minutos
  const timeToMinutes = (time: string): number => {
    const [hours, minutes] = time.split(':').map(Number)
    return hours * 60 + minutes
  }

  // Convertir minutos a HH:mm
  const minutesToTime = (minutes: number): string => {
    const hours = Math.floor(minutes / 60)
    const remainingMinutes = minutes % 60

    return `${String(hours).padStart(2, '0')}:${String(
      remainingMinutes
    ).padStart(2, '0')}`
  }

  // Generar horarios disponibles según la apertura y cierre
  const getAvailableTimes = (): string[] => {
    if (!restaurant || !form.date) return []

    const openingMinutes = timeToMinutes(restaurant.openingTime)
    const closingMinutes = timeToMinutes(restaurant.closingTime)

    const lastReservationTime =
      closingMinutes - RESERVATION_DURATION

    const availableTimes: string[] = []

    const now = new Date()
    const selectedDate = new Date(`${form.date}T00:00:00`)
    const currentDate = new Date()
    currentDate.setHours(0, 0, 0, 0)

    const isToday = selectedDate.getTime() === currentDate.getTime()

    const currentMinutes = now.getHours() * 60 + now.getMinutes()

    for (
      let time = openingMinutes;
      time <= lastReservationTime;
      time += SLOT_INTERVAL
    ) {
      if (isToday && time <= currentMinutes) {
        continue
      }

      availableTimes.push(minutesToTime(time))
    }

    return availableTimes
  }

  const availableTimes = getAvailableTimes()

  const handleChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = event.target

    setForm((previous) => ({
      ...previous,
      [name]: value,
      ...(name === 'date' ? { time: '' } : {}),
    }))

    setError('')
  }

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault()
    setError('')

    if (!restaurant) {
      setError('No se pudo consultar el horario del restaurante.')
      return
    }

    // Validar fecha
    const selectedDate = new Date(`${form.date}T00:00:00`)
    const currentDate = new Date()
    currentDate.setHours(0, 0, 0, 0)

    if (selectedDate < currentDate) {
      setError('No puedes reservar en una fecha pasada.')
      return
    }

    // Validar que la hora esté entre las opciones permitidas
    if (!availableTimes.includes(form.time)) {
      setError('Selecciona uno de los horarios disponibles.')
      return
    }

    // Validar cantidad de personas
    const guests = Number(form.guests)

    if (!Number.isInteger(guests) || guests < 1 || guests > 8) {
      setError('El número de personas debe estar entre 1 y 8.')
      return
    }

    try {
      setLoading(true)

      const response = await createReservation({
        restaurantId,
        fullName: form.customerName.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        date: form.date,
        time: form.time,
        guests,
        comments: form.comments.trim(),
      })

      setReservation(response)
      setSubmitted(true)
    } catch (error: unknown) {
      console.error('Error al crear la reserva:', error)

      if (
        typeof error === 'object' &&
        error !== null &&
        'response' in error
      ) {
        const apiError = error as {
          response?: {
            data?: {
              message?: string
              error?: string
            }
          }
        }

        setError(
          apiError.response?.data?.message ||
          apiError.response?.data?.error ||
          'No fue posible crear la reserva. Verifica la disponibilidad e intenta nuevamente.'
        )
      } else {
        setError(
          'No fue posible conectar con el servidor. Intenta nuevamente.'
        )
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/60 p-4">
      <div className="my-auto w-full max-w-xl rounded-3xl bg-white p-6 shadow-2xl md:p-8">

        <div className="flex items-start justify-between">
          <div>
            <span className="text-sm font-bold uppercase tracking-widest text-[#d97736]">
              Nueva reserva
            </span>

            <h2 className="mt-2 text-2xl font-bold text-[#19352b]">
              Reserva tu mesa
            </h2>

            <p className="mt-2 text-sm text-[#718078]">
              Restaurante: {restaurantName}
            </p>

            <p className="mt-1 text-sm text-[#718078]">
              Duración de la reserva: 1 hora
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-full bg-[#f3f4f0] p-2 text-[#19352b] hover:bg-[#e8eae4]"
            aria-label="Cerrar formulario"
          >
            <X size={20} />
          </button>
        </div>

        {submitted ? (
          <div className="py-10 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-3xl text-green-700">
              ✓
            </div>

            <h3 className="mt-5 text-xl font-bold text-[#19352b]">
              ¡Reserva registrada!
            </h3>

            <p className="mt-3 text-sm leading-6 text-[#718078]">
              Tu solicitud fue guardada correctamente en Savora.
            </p>

            {reservation && (
              <div className="mx-auto mt-5 max-w-sm rounded-2xl bg-[#f3f4f0] p-5 text-left">
                <p className="text-sm text-[#718078]">
                  Número de reserva
                </p>

                <p className="text-2xl font-bold text-[#19352b]">
                  #{reservation.id}
                </p>

                <p className="mt-3 text-sm text-[#718078]">
                  Fecha: {reservation.reservationDate}
                </p>

                <p className="mt-1 text-sm text-[#718078]">
                  Hora: {reservation.reservationTime}
                </p>

                <p className="mt-1 text-sm text-[#718078]">
                  Duración: 60 minutos
                </p>

                <p className="mt-1 text-sm text-[#718078]">
                  Personas: {reservation.guests}
                </p>

                <p className="mt-1 text-sm text-[#718078]">
                  Estado: {reservation.status}
                </p>
              </div>
            )}

            <button
              type="button"
              onClick={onClose}
              className="mt-7 rounded-full bg-[#19352b] px-8 py-3 font-semibold text-white hover:bg-[#294c3e]"
            >
              Cerrar
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-7 space-y-5">

            <div>
              <label className="mb-2 block text-sm font-semibold">
                Nombre completo
              </label>

              <input
                type="text"
                name="customerName"
                value={form.customerName}
                onChange={handleChange}
                placeholder="Ingresa tu nombre"
                required
                maxLength={120}
                className="w-full rounded-xl border border-[#e2e4dd] px-4 py-3 outline-none focus:border-[#19352b]"
              />
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Correo electrónico
                </label>

                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="correo@ejemplo.com"
                  required
                  maxLength={150}
                  className="w-full rounded-xl border border-[#e2e4dd] px-4 py-3 outline-none focus:border-[#19352b]"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Teléfono
                </label>

                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="300 000 0000"
                  required
                  maxLength={20}
                  className="w-full rounded-xl border border-[#e2e4dd] px-4 py-3 outline-none focus:border-[#19352b]"
                />
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-3">
              <div>
                <label className="mb-2 flex items-center gap-2 text-sm font-semibold">
                  <CalendarDays size={16} />
                  Fecha
                </label>

                <input
                  type="date"
                  name="date"
                  value={form.date}
                  onChange={handleChange}
                  min={today}
                  required
                  className="w-full min-w-0 rounded-xl border border-[#e2e4dd] px-3 py-3 outline-none focus:border-[#19352b]"
                />
              </div>

              <div>
                <label className="mb-2 flex items-center gap-2 text-sm font-semibold">
                  <Clock size={16} />
                  Hora
                </label>

                <select
                  name="time"
                  value={form.time}
                  onChange={handleChange}
                  required
                  disabled={!form.date || loadingRestaurant || availableTimes.length === 0}
                  className="w-full min-w-0 rounded-xl border border-[#e2e4dd] px-3 py-3 outline-none focus:border-[#19352b] disabled:bg-gray-100"
                >
                  <option value="">
                    Selecciona una hora
                  </option>

                  {availableTimes.map((time) => (
                    <option key={time} value={time}>
                      {time}
                    </option>
                  ))}
                </select>

                {loadingRestaurant && (
                  <p className="mt-1 text-xs text-gray-500">
                    Consultando horarios...
                  </p>
                )}

                {!loadingRestaurant && form.date && availableTimes.length === 0 && (
                  <p className="mt-1 text-xs text-red-600">
                    No hay horarios disponibles.
                  </p>
                )}
              </div>

              <div>
                <label className="mb-2 flex items-center gap-2 text-sm font-semibold">
                  <Users size={16} />
                  Personas
                </label>

                <select
                  name="guests"
                  value={form.guests}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-[#e2e4dd] px-3 py-3 outline-none focus:border-[#19352b]"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((number) => (
                    <option key={number} value={number}>
                      {number}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {restaurant && (
              <p className="text-xs text-gray-500">
                Horario del restaurante: {restaurant.openingTime.slice(0, 5)}
                {' - '}
                {restaurant.closingTime.slice(0, 5)}. Las reservas duran 60 minutos.
              </p>
            )}

            {restaurantError && (
              <div className="rounded-xl bg-red-50 p-3 text-sm text-red-700">
                {restaurantError}
              </div>
            )}

            <div>
              <label className="mb-2 block text-sm font-semibold">
                Comentarios adicionales
              </label>

              <textarea
                name="comments"
                value={form.comments}
                onChange={handleChange}
                rows={3}
                maxLength={500}
                placeholder="¿Tienes alguna solicitud especial?"
                className="w-full resize-none rounded-xl border border-[#e2e4dd] px-4 py-3 outline-none focus:border-[#19352b]"
              />
            </div>

            {error && (
              <div
                role="alert"
                className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
              >
                <span className="mt-0.5 text-lg">⚠️</span>

                <div>
                  <p className="font-semibold">
                    No podemos completar tu reserva
                  </p>

                  <p className="mt-1">{error}</p>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || loadingRestaurant || !restaurant || !!restaurantError}
              className="w-full rounded-full bg-[#19352b] py-4 font-semibold text-white transition hover:bg-[#294c3e] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? 'Registrando reserva...' : 'Continuar con la reserva'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}

export default ReservationForm
