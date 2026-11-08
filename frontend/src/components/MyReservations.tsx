import { useEffect, useState } from 'react'
import {
  CalendarDays,
  Clock3,
  MapPin,
  Users,
  Utensils,
  XCircle,
  Search,
  Pencil,
  X,
  Save,
} from 'lucide-react'

import {
  getMyReservations,
  type MyReservation,
} from '../services/myReservationsService'

import {
  cancelReservation,
  updateReservation,
  getAvailableReservationTimes,
} from '../services/reservationService'

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=900'

const MyReservations = () => {
  const [email, setEmail] = useState('')
  const [reservations, setReservations] = useState<MyReservation[]>([])
  const [loading, setLoading] = useState(false)
  const [cancellingId, setCancellingId] = useState<number | null>(null)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [saving, setSaving] = useState(false)

  const [editDate, setEditDate] = useState('')
  const [editTime, setEditTime] = useState('')
  const [editGuests, setEditGuests] = useState(2)
  const [editComments, setEditComments] = useState('')

  const [availableTimes, setAvailableTimes] = useState<string[]>([])
  const [loadingTimes, setLoadingTimes] = useState(false)

  const [error, setError] = useState('')
  const [searched, setSearched] = useState(false)

  // Consultar reservas por correo electrónico
  const handleSearch = async () => {
    if (!email.trim()) {
      setError('Ingresa tu correo electrónico.')
      return
    }

    try {
      setLoading(true)
      setError('')
      setSearched(true)

      const data = await getMyReservations(email.trim())
      setReservations(data)
    } catch (error: unknown) {
      console.error('Error al consultar reservas:', error)

      setError(
        'No fue posible consultar tus reservas. Verifica el correo e intenta nuevamente.'
      )

      setReservations([])
    } finally {
      setLoading(false)
    }
  }

  // Cancelar una reserva
  const handleCancel = async (reservationId: number) => {
    const confirmed = window.confirm(
      '¿Estás seguro de que deseas cancelar esta reserva?'
    )

    if (!confirmed) return

    try {
      setCancellingId(reservationId)
      setError('')

      const updatedReservation = await cancelReservation(reservationId)

      setReservations((previous) =>
        previous.map((reservation) =>
          reservation.id === reservationId
            ? { ...reservation, status: updatedReservation.status }
            : reservation
        )
      )
    } catch (error: unknown) {
      console.error('Error al cancelar reserva:', error)
      setError('No fue posible cancelar la reserva. Inténtalo nuevamente.')
    } finally {
      setCancellingId(null)
    }
  }

  // Preparar los datos para editar una reserva
  const handleEdit = (reservation: MyReservation) => {
    setEditingId(reservation.id)
    setEditDate(reservation.reservationDate)
    setEditTime(reservation.reservationTime.slice(0, 5))
    setEditGuests(reservation.guests)
    setEditComments(reservation.comments || '')
    setAvailableTimes([])
    setError('')
  }

  // Consultar horarios cuando cambie la fecha o cantidad de personas
  useEffect(() => {
    if (editingId === null || !editDate || !editGuests) {
      setAvailableTimes([])
      return
    }

    const currentReservation = reservations.find(
      (reservation) => reservation.id === editingId
    )

    if (!currentReservation) return

    let cancelled = false

    const loadAvailableTimes = async () => {
      try {
        setLoadingTimes(true)
        setAvailableTimes([])
        setError('')

        const times = await getAvailableReservationTimes(
          currentReservation.restaurant.id,
          editDate,
          editGuests,
          editingId
        )

        if (cancelled) return

        setAvailableTimes(times)

        // Conservar la hora actual si todavía está disponible
        if (!times.some((time) => time.slice(0, 5) === editTime)) {
          setEditTime('')
        }
      } catch (error: unknown) {
        console.error('Error consultando horarios disponibles:', error)

        if (!cancelled) {
          setAvailableTimes([])
          setEditTime('')
          setError('No fue posible consultar los horarios disponibles.')
        }
      } finally {
        if (!cancelled) {
          setLoadingTimes(false)
        }
      }
    }

    loadAvailableTimes()

    return () => {
      cancelled = true
    }
  }, [editingId, editDate, editGuests, reservations])

  // Guardar cambios de la reserva
  const handleUpdate = async () => {
    if (editingId === null) return

    if (!editDate || !editTime || editGuests < 1 || editGuests > 8) {
      setError('Completa los datos correctamente. Máximo 8 personas.')
      return
    }

    const isAvailable = availableTimes.some(
      (time) => time.slice(0, 5) === editTime
    )

    if (!isAvailable) {
      setError('Selecciona un horario disponible.')
      return
    }

    try {
      setSaving(true)
      setError('')

      const updatedReservation = await updateReservation(editingId, {
        date: editDate,
        time: editTime,
        guests: editGuests,
        comments: editComments,
      })

      setReservations((previous) =>
        previous.map((reservation) =>
          reservation.id === editingId
            ? {
              ...reservation,
              reservationDate: updatedReservation.reservationDate,
              reservationTime: updatedReservation.reservationTime,
              durationMinutes: updatedReservation.durationMinutes,
              guests: updatedReservation.guests,
              status: updatedReservation.status,
              comments: editComments,
              table: updatedReservation.table,
            }
            : reservation
        )
      )

      setEditingId(null)
      setAvailableTimes([])
    } catch (error: unknown) {
      console.error('Error al modificar reserva:', error)

      setError(
        'No fue posible modificar la reserva. Verifica la disponibilidad y el horario del restaurante.'
      )
    } finally {
      setSaving(false)
    }
  }

  // Traducir los estados
  const getStatusLabel = (status: string) => {
    switch (status.toUpperCase()) {
      case 'PENDING':
        return 'Pendiente'
      case 'CONFIRMED':
        return 'Confirmada'
      case 'CANCELLED':
        return 'Cancelada'
      default:
        return status
    }
  }

  // Formatear fecha
  const formatDate = (date: string) => {
    const [year, month, day] = date.split('-')
    return `${day}/${month}/${year}`
  }

  return (
    <section className="bg-[#faf9f6] px-6 py-20">
      <div className="mx-auto max-w-6xl">
        {/* Encabezado */}
        <div className="mb-10 text-center">
          <span className="text-sm font-semibold uppercase tracking-widest text-orange-600">
            Tus experiencias
          </span>

          <h2 className="mt-3 text-3xl font-bold text-[#173b30] md:text-4xl">
            Mis reservas
          </h2>

          <p className="mt-3 text-gray-500">
            Consulta y administra tus próximas experiencias gastronómicas.
          </p>
        </div>

        {/* Búsqueda */}
        <div className="mx-auto mb-10 max-w-2xl rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <label
            htmlFor="reservation-email"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Correo electrónico
          </label>

          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              id="reservation-email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') handleSearch()
              }}
              placeholder="Ingresa el correo utilizado en tu reserva"
              className="min-w-0 flex-1 rounded-xl border border-gray-200 bg-blue-50 px-4 py-3 outline-none focus:border-[#173b30]"
            />

            <button
              onClick={handleSearch}
              disabled={loading}
              className="flex items-center justify-center gap-2 rounded-xl bg-[#173b30] px-6 py-3 font-semibold text-white hover:bg-[#245443] disabled:opacity-60"
            >
              {loading ? (
                <span className="animate-spin">⏳</span>
              ) : (
                <Search className="h-5 w-5" />
              )}

              {loading ? 'Buscando...' : 'Buscar reservas'}
            </button>
          </div>
        </div>

        {/* Mensajes de error */}
        {error && editingId === null && (
          <div
            role="alert"
            className="mx-auto mb-6 max-w-2xl rounded-xl bg-red-50 p-4 text-sm text-red-700"
          >
            {error}
          </div>
        )}

        {/* Sin resultados */}
        {searched && !loading && reservations.length === 0 && !error && (
          <div className="rounded-2xl bg-white p-10 text-center shadow-sm">
            <Utensils className="mx-auto mb-4 h-10 w-10 text-gray-400" />

            <h3 className="text-lg font-semibold text-gray-800">
              No encontramos reservas
            </h3>

            <p className="mt-2 text-gray-500">
              Verifica el correo electrónico e inténtalo nuevamente.
            </p>
          </div>
        )}

        {/* Tarjetas de reservas */}
        <div className="grid gap-6 md:grid-cols-2">
          {reservations.map((reservation) => (
            <article
              key={reservation.id}
              className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm"
            >
              {/* Imagen del restaurante con respaldo */}
              <img
                src={reservation.restaurant.imageUrl || FALLBACK_IMAGE}
                alt={reservation.restaurant.name}
                className="h-48 w-full object-cover"
                loading="lazy"
                onError={(event) => {
                  event.currentTarget.onerror = null
                  event.currentTarget.src = FALLBACK_IMAGE
                }}
              />

              <div className="p-6">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <span className="text-xs font-semibold uppercase tracking-wider text-orange-600">
                    Reserva #{reservation.id}
                  </span>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${reservation.status === 'CANCELLED'
                        ? 'bg-red-100 text-red-700'
                        : reservation.status === 'CONFIRMED'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-amber-100 text-amber-700'
                      }`}
                  >
                    {getStatusLabel(reservation.status)}
                  </span>
                </div>

                <h3 className="mb-5 text-xl font-bold text-[#173b30]">
                  {reservation.restaurant.name}
                </h3>

                <div className="space-y-3 text-sm text-gray-500">
                  <p className="flex items-center gap-3">
                    <MapPin className="h-4 w-4 shrink-0" />
                    {reservation.restaurant.address}
                  </p>

                  <p className="flex items-center gap-3">
                    <CalendarDays className="h-4 w-4 shrink-0" />
                    {formatDate(reservation.reservationDate)}
                  </p>

                  <p className="flex items-center gap-3">
                    <Clock3 className="h-4 w-4 shrink-0" />
                    {reservation.reservationTime}
                  </p>

                  <p className="flex items-center gap-3">
                    <Users className="h-4 w-4 shrink-0" />
                    {reservation.guests} personas
                  </p>

                  <p className="flex items-center gap-3">
                    <Utensils className="h-4 w-4 shrink-0" />
                    Mesa: {reservation.table.tableNumber}
                  </p>
                </div>

                {/* Acciones */}
                {reservation.status !== 'CANCELLED' && (
                  <div className="mt-6 grid grid-cols-2 gap-3">
                    <button
                      onClick={() => handleEdit(reservation)}
                      className="flex items-center justify-center gap-2 rounded-xl border border-[#173b30] px-3 py-3 text-sm font-semibold text-[#173b30] transition hover:bg-green-50"
                    >
                      <Pencil className="h-4 w-4" />
                      Editar
                    </button>

                    <button
                      onClick={() => handleCancel(reservation.id)}
                      disabled={cancellingId === reservation.id}
                      className="flex items-center justify-center gap-2 rounded-xl border border-red-200 px-3 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-60"
                    >
                      {cancellingId === reservation.id ? (
                        <span className="animate-spin">⏳</span>
                      ) : (
                        <XCircle className="h-4 w-4" />
                      )}

                      {cancellingId === reservation.id
                        ? 'Cancelando...'
                        : 'Cancelar'}
                    </button>
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>

        {/* Modal de edición */}
        {editingId !== null && (
          <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4">
            <div className="my-auto w-full max-w-lg rounded-3xl bg-white p-6 shadow-xl">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-widest text-orange-600">
                    Savora
                  </span>

                  <h3 className="mt-1 text-2xl font-bold text-[#173b30]">
                    Editar reserva
                  </h3>

                  <p className="mt-1 text-sm text-gray-500">
                    Reserva #{editingId}
                  </p>
                </div>

                <button
                  onClick={() => {
                    setEditingId(null)
                    setError('')
                    setAvailableTimes([])
                  }}
                  disabled={saving}
                  className="rounded-full p-2 text-gray-500 hover:bg-gray-100"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-4">
                {/* Fecha */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Fecha
                  </label>

                  <input
                    type="date"
                    value={editDate}
                    min={new Date().toLocaleDateString('en-CA')}
                    onChange={(event) => {
                      setEditDate(event.target.value)
                      setEditTime('')
                    }}
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#173b30]"
                  />
                </div>

                {/* Hora disponible */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Hora
                  </label>

                  <select
                    value={editTime}
                    onChange={(event) => setEditTime(event.target.value)}
                    disabled={loadingTimes || availableTimes.length === 0}
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#173b30] disabled:bg-gray-100"
                  >
                    <option value="">
                      {loadingTimes
                        ? 'Consultando horarios...'
                        : availableTimes.length === 0
                          ? 'No hay horarios disponibles'
                          : 'Selecciona una hora'}
                    </option>

                    {availableTimes.map((time) => (
                      <option key={time} value={time.slice(0, 5)}>
                        {time.slice(0, 5)}
                      </option>
                    ))}
                  </select>

                  <p className="mt-2 text-xs text-gray-500">
                    Los horarios mostrados corresponden a mesas disponibles
                    para la fecha y cantidad de personas seleccionadas.
                  </p>
                </div>

                {/* Personas */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Cantidad de personas
                  </label>

                  <select
                    value={editGuests}
                    onChange={(event) => {
                      setEditGuests(Number(event.target.value))
                      setEditTime('')
                    }}
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#173b30]"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((number) => (
                      <option key={number} value={number}>
                        {number} {number === 1 ? 'persona' : 'personas'}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Comentarios */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Comentarios
                  </label>

                  <textarea
                    value={editComments}
                    onChange={(event) => setEditComments(event.target.value)}
                    rows={3}
                    placeholder="Comentarios adicionales..."
                    className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#173b30]"
                  />
                </div>

                {error && editingId !== null && (
                  <div
                    role="alert"
                    className="rounded-xl bg-red-50 p-3 text-sm text-red-700"
                  >
                    {error}
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <button
                    onClick={() => {
                      setEditingId(null)
                      setError('')
                      setAvailableTimes([])
                    }}
                    disabled={saving}
                    className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 px-4 py-3 font-semibold text-gray-600 hover:bg-gray-50 disabled:opacity-60"
                  >
                    <X className="h-4 w-4" />
                    Cerrar
                  </button>

                  <button
                    onClick={handleUpdate}
                    disabled={
                      saving ||
                      loadingTimes ||
                      !editTime ||
                      !availableTimes.some(
                        (time) => time.slice(0, 5) === editTime
                      )
                    }
                    className="flex items-center justify-center gap-2 rounded-xl bg-[#173b30] px-4 py-3 font-semibold text-white hover:bg-[#245443] disabled:opacity-60"
                  >
                    {saving ? (
                      <span className="animate-spin">⏳</span>
                    ) : (
                      <Save className="h-4 w-4" />
                    )}

                    {saving ? 'Guardando...' : 'Guardar cambios'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

export default MyReservations