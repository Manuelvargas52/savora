
import {
  ArrowRight,
  CalendarDays,
  Clock3,
  MapPin,
  Star,
  UtensilsCrossed,
} from 'lucide-react'
import MyReservations from './components/MyReservations'
import RestaurantList from './components/RestaurantList'

const features = [
  {
    icon: CalendarDays,
    title: 'Reserva fácilmente',
    description: 'Encuentra una mesa y reserva en pocos pasos.',
  },
  {
    icon: Clock3,
    title: 'Disponibilidad real',
    description: 'Consulta los horarios disponibles para tu visita.',
  },
  {
    icon: Star,
    title: 'Experiencias únicas',
    description: 'Descubre lugares especiales para cada ocasión.',
  },
]

function App() {
  return (
    <main className="min-h-screen bg-[#faf9f6] text-[#19352b]">

      {/* Navbar */}
      <header className="border-b border-[#e8e7df] bg-white">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">

          <a href="#" className="flex items-center gap-2">
            <UtensilsCrossed size={27} className="text-[#d97736]" />

            <span className="text-2xl font-bold tracking-tight">
              Savora<span className="text-[#d97736]">.</span>
            </span>
          </a>

          <div className="hidden items-center gap-8 md:flex">
            <a href="#inicio" className="text-sm font-medium hover:text-[#d97736]">
              Inicio
            </a>

            <a href="#restaurantes" className="text-sm font-medium hover:text-[#d97736]">
              Restaurantes
            </a>

            <a href="#mis-reservas" className="text-sm font-medium hover:text-[#d97736]">
              Mis reservas
            </a>

            <a href="#beneficios" className="text-sm font-medium hover:text-[#d97736]">
              Beneficios
            </a>
          </div>

          <a
            href="#restaurantes"
            className="rounded-full bg-[#19352b] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#294c3e]"
          >
            Explorar
          </a>

        </nav>
      </header>

      {/* Hero */}
      <section
        id="inicio"
        className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-20 md:grid-cols-2 md:py-28"
      >

        <div>
          <span className="inline-flex items-center gap-2 rounded-full bg-[#f3eadf] px-4 py-2 text-sm font-semibold text-[#a65b2c]">
            <Star size={15} />
            Una nueva forma de reservar
          </span>

          <h1 className="mt-7 text-5xl font-bold leading-tight tracking-tight md:text-6xl">
            Tu próxima experiencia gastronómica
            <span className="text-[#d97736]"> comienza aquí.</span>
          </h1>

          <p className="mt-6 max-w-lg text-lg leading-8 text-[#718078]">
            Descubre restaurantes, consulta disponibilidad y reserva
            tu mesa de manera rápida y sencilla.
          </p>

          <div className="mt-9 flex flex-wrap gap-4">

            <a
              href="#restaurantes"
              className="inline-flex items-center gap-3 rounded-full bg-[#19352b] px-7 py-4 font-semibold text-white transition hover:bg-[#294c3e]"
            >
              Descubrir restaurantes
              <ArrowRight size={19} />
            </a>

            <a
              href="#beneficios"
              className="rounded-full border border-[#d9ded9] px-7 py-4 font-semibold transition hover:bg-white"
            >
              Conocer más
            </a>

          </div>

          <div className="mt-10 flex items-center gap-3 text-sm text-[#718078]">
            <MapPin size={18} className="text-[#d97736]" />
            Encuentra tu próxima mesa favorita
          </div>
        </div>

        {/* Imagen principal */}
        <div className="relative">

          <div className="absolute -inset-4 rounded-[2rem] bg-[#e9e2d6] blur-2xl" />

          <img
            src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200"
            alt="Interior elegante de un restaurante"
            className="relative h-[420px] w-full rounded-[2rem] object-cover shadow-xl md:h-[540px]"
          />

          <div className="absolute bottom-6 left-6 rounded-2xl bg-white p-5 shadow-xl">

            <div className="flex items-center gap-2">
              <Star size={17} className="fill-[#d97736] text-[#d97736]" />

              <span className="font-bold">
                Experiencias especiales
              </span>
            </div>

            <p className="mt-1 text-sm text-gray-500">
              Tu mesa está más cerca.
            </p>

          </div>
        </div>

      </section>

      {/* Catálogo de restaurantes */}
      <div id="restaurantes">
        <RestaurantList />
      </div>

      {/* Mis reservas */}
      <div id="mis-reservas">
        <MyReservations />
      </div>

      {/* Beneficios */}
      <section id="beneficios" className="bg-white px-6 py-20">

        <div className="mx-auto max-w-7xl">

          <div className="max-w-2xl">

            <span className="text-sm font-bold uppercase tracking-widest text-[#d97736]">
              ¿Por qué Savora?
            </span>

            <h2 className="mt-3 text-3xl font-bold md:text-4xl">
              Reservar nunca fue tan sencillo.
            </h2>

            <p className="mt-4 leading-7 text-[#718078]">
              Diseñamos una experiencia sencilla para que disfrutes
              lo importante: una buena comida y grandes momentos.
            </p>

          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">

            {features.map((feature) => {
              const Icon = feature.icon

              return (
                <article
                  key={feature.title}
                  className="rounded-2xl border border-[#eeeee8] bg-[#faf9f6] p-8 transition hover:-translate-y-1 hover:shadow-lg"
                >

                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#f3eadf] text-[#d97736]">
                    <Icon size={24} />
                  </div>

                  <h3 className="mt-6 text-xl font-bold">
                    {feature.title}
                  </h3>

                  <p className="mt-3 leading-7 text-[#718078]">
                    {feature.description}
                  </p>

                </article>
              )
            })}

          </div>
        </div>

      </section>

      {/* Experiencia */}
      <section
        id="experiencia"
        className="mx-auto max-w-7xl px-6 py-20"
      >

        <div className="rounded-[2rem] bg-[#19352b] px-8 py-16 text-center text-white md:px-20">

          <span className="text-sm font-semibold uppercase tracking-widest text-[#e9b17e]">
            Savora
          </span>

          <h2 className="mx-auto mt-4 max-w-2xl text-3xl font-bold md:text-5xl">
            Una buena experiencia comienza con una reserva.
          </h2>

          <p className="mx-auto mt-5 max-w-xl leading-7 text-[#d0dbd4]">
            Estamos construyendo una nueva forma de descubrir y
            reservar tus restaurantes favoritos.
          </p>

          <a
            href="#inicio"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#d97736] px-7 py-4 font-semibold text-white transition hover:bg-[#c5652b]"
          >
            Volver al inicio
            <ArrowRight size={18} />
          </a>

        </div>

      </section>

      {/* Footer */}
      <footer className="border-t border-[#e8e7df] bg-white px-6 py-8">

        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 text-sm text-[#718078] md:flex-row">

          <span className="font-bold text-[#19352b]">
            Savora.
          </span>

          <p>
            © {new Date().getFullYear()} Savora. Proyecto de desarrollo Full Stack.
          </p>

        </div>

      </footer>

    </main>
  )
}

export default App
