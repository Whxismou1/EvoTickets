"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Link } from "react-router-dom"
import { Button } from "@heroui/button"
import { MapPin, Clock, Calendar, Ticket, Bell, Search, Filter, ChevronRight, TrendingUp, Users } from "lucide-react"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import { useTranslation } from "react-i18next"

const mockEvents = [
  {
    id: 1,
    title: "Festival de Música Urbana",
    location: "Madrid, España",
    date: "2025-06-15T18:00:00",
    image: "/placeholder.svg",
    category: "festivals",
    featured: true,
    price: "45€",
    hot: true,
  },
  {
    id: 2,
    title: "Concierto de Rock Alternativo",
    location: "Barcelona, España",
    date: "2025-06-22T20:00:00",
    image: "/placeholder.svg",
    category: "concerts",
    featured: true,
    price: "35€",
    hot: true,
  },
  {
    id: 3,
    title: "Partido de Fútbol - Liga Nacional",
    location: "Sevilla, España",
    date: "2025-06-18T16:00:00",
    image: "/placeholder.svg",
    category: "sports",
    featured: true,
    price: "25€",
  },
  {
    id: 4,
    title: "Obra de Teatro Clásico",
    location: "Valencia, España",
    date: "2025-06-25T19:30:00",
    image: "/placeholder.svg",
    category: "theater",
    featured: false,
    price: "30€",
  },
  {
    id: 5,
    title: "Monólogos de Comedia",
    location: "Málaga, España",
    date: "2025-06-29T21:00:00",
    image: "/placeholder.svg",
    category: "comedy",
    featured: false,
    price: "20€",
  },
]

export default function HomePage() {
  const { t } = useTranslation()
  const [events, setEvents] = useState([])
  const [featuredEvents, setFeaturedEvents] = useState([])
  const [hotEvents, setHotEvents] = useState([])
  const [recommendedEvents, setRecommendedEvents] = useState([])
  const [upcomingEvents, setUpcomingEvents] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setIsLoading(true)

        setTimeout(() => {
          setEvents(mockEvents)
          setFeaturedEvents(mockEvents.filter((event) => event.featured))
          setHotEvents(mockEvents.filter((event) => event.hot))
          setRecommendedEvents(mockEvents.slice(0, 3))
          setUpcomingEvents(mockEvents.slice(0, 4))
          setIsLoading(false)
        }, 1000)
      } catch (error) {
        console.error("Error fetching events:", error)
        setIsLoading(false)
      }
    }

    fetchEvents()
  }, [])

  // Categories for filtering
  const categories = [
    { id: "all", label: "Todos" },
    { id: "concerts", label: "Conciertos" },
    { id: "festivals", label: "Festivales" },
    { id: "sports", label: "Deportes" },
    { id: "theater", label: "Teatro" },
    { id: "comedy", label: "Comedia" },
  ]

  const handleSearch = (e) => {
    e.preventDefault()
    console.log("Searching for:", searchQuery)
  }

  return (
    <>
      <Navbar isAuthenticated={true} />
      <main className="min-h-screen bg-[#F3F0FA] pt-16">
        {/* Welcome Banner */}
        <section className="bg-gradient-to-r from-[#5C3D8D] to-[#2E1A47] py-8 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="mb-4 md:mb-0">
                <h1 className="text-2xl md:text-3xl font-bold text-white">{t("home.welcome")}</h1>
                <p className="text-[#D7A6F3]">{t("home.discover")}</p>
              </div>
              {/* <div className="flex gap-3">
                <Link to="/tickets">
                  <Button
                    variant="outline"
                    className="border-white text-white hover:bg-white/10"
                    startContent={<Ticket size={16} />}
                  >
                    Mis Tickets
                  </Button>
                </Link>
                <Link to="/notifications">
                  <Button className="bg-[#D7A6F3] hover:bg-[#A28CD4] text-[#2E1A47]" startContent={<Bell size={16} />}>
                    Notificaciones
                  </Button>
                </Link>
              </div> */}
            </div>
          </div>
        </section>

        {/* Search and Filter */}
        <section className="py-6 px-4 bg-white shadow-sm">
          <div className="container mx-auto max-w-6xl">
            <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-3">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#5C3D8D]" size={18} />
                <input
                  type="text"
                  placeholder="Búsqueda rápida de eventos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-[#A28CD4]/30 focus:outline-none focus:ring-2 focus:ring-[#5C3D8D]/50"
                />
              </div>
              <Link to="/events">
                <Button className="bg-[#5C3D8D] hover:bg-[#2E1A47] text-white" startContent={<Filter size={16} />}>
                  {t("home.advanced_search")}
                </Button>
              </Link>
              <Button type="submit" className="bg-[#D7A6F3] hover:bg-[#A28CD4] text-[#2E1A47]">
                {t("home.search")}
              </Button>
            </form>
          </div>
        </section>


        {/* Upcoming Events */}
        <section className="py-6 px-4 bg-white">
          <div className="container mx-auto max-w-6xl">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-[#5C3D8D]" />
                <h2 className="text-xl font-bold text-[#2E1A47]">{t("home.next_events")}</h2>
              </div>
              <Link to="/calendar" className="text-[#5C3D8D] hover:text-[#2E1A47] text-sm flex items-center">
                {t("home.see_calendar")} <ChevronRight size={16} />
              </Link>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="bg-[#F3F0FA]/50 animate-pulse rounded-lg h-32"></div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {upcomingEvents.map((event) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 * event.id }}
                    className="bg-[#F3F0FA] rounded-lg hover:shadow-md transition-shadow p-4 flex"
                  >
                    <div className="w-16 h-16 bg-[#5C3D8D]/10 rounded-lg flex flex-col items-center justify-center text-[#5C3D8D] mr-4 flex-shrink-0">
                      <span className="text-lg font-bold">{new Date(event.date).getDate()}</span>
                      <span className="text-xs">
                        {new Date(event.date).toLocaleString("default", { month: "short" })}
                      </span>
                    </div>
                    <div className="flex-grow">
                      <h3 className="font-semibold text-[#2E1A47] mb-1">{event.title}</h3>
                      <div className="flex items-center text-sm text-[#5C3D8D] mb-1">
                        <MapPin className="h-3 w-3 mr-1" /> {event.location}
                      </div>
                      <div className="flex items-center text-sm text-[#5C3D8D]">
                        <Clock className="h-3 w-3 mr-1" />{" "}
                        {new Date(event.date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </div>
                    </div>
                    <Link
                      to={`/events/${event.id}`}
                      className="self-center ml-2 px-3 py-1 bg-[#5C3D8D]/10 text-[#5C3D8D] rounded-md hover:bg-[#5C3D8D]/20 transition-colors text-sm"
                    >
                      {t("home.see")}
                    </Link>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Artistas que sigues */}
        <section className="py-6 px-4 bg-white">
          <div className="container mx-auto max-w-6xl">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-[#5C3D8D]" />
                <h2 className="text-xl font-bold text-[#2E1A47]">{t("home.followed_artist")}</h2>
              </div>
              <Link to="/artists" className="text-[#5C3D8D] hover:text-[#2E1A47] text-sm flex items-center">
              {t("home.see_all")} <ChevronRight size={16} />
              </Link>
            </div>

            <div className="space-y-4">
              {isLoading ? (
                [1, 2, 3].map((i) => <div key={i} className="bg-[#F3F0FA]/50 animate-pulse rounded-lg h-16"></div>)
              ) : (
                <>
                  <motion.div
                    className="bg-[#F3F0FA] rounded-lg p-4 flex items-center"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="w-10 h-10 rounded-full bg-[#A28CD4] mr-3 flex-shrink-0">
                      <img src="/placeholder.svg" alt="Artist" className="w-full h-full rounded-full object-cover" />
                    </div>
                    <div className="flex-grow">
                      <p className="text-[#2E1A47] font-medium">Rosalía</p>
                      <p className="text-xs text-[#5C3D8D]">Nuevo concierto anunciado en Madrid</p>
                    </div>
                    <Link
                      to="/events/5"
                      className="px-3 py-1 bg-[#5C3D8D] text-white rounded-md hover:bg-[#2E1A47] transition-colors text-sm"
                    >
                      {t("home.see_event")}
                    </Link>
                  </motion.div>

                  <motion.div
                    className="bg-[#F3F0FA] rounded-lg p-4 flex items-center"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                  >
                    <div className="w-10 h-10 rounded-full bg-[#A28CD4] mr-3 flex-shrink-0">
                      <img src="/placeholder.svg" alt="Artist" className="w-full h-full rounded-full object-cover" />
                    </div>
                    <div className="flex-grow">
                      <p className="text-[#2E1A47] font-medium">Coldplay</p>
                      <p className="text-xs text-[#5C3D8D]">Entradas a la venta para su gira mundial</p>
                    </div>
                    <Link
                      to="/events/6"
                      className="px-3 py-1 bg-[#5C3D8D] text-white rounded-md hover:bg-[#2E1A47] transition-colors text-sm"
                    >
                      {t("home.see_event")}
                    </Link>
                  </motion.div>

                  <motion.div
                    className="bg-[#F3F0FA] rounded-lg p-4 flex items-center"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                  >
                    <div className="w-10 h-10 rounded-full bg-[#A28CD4] mr-3 flex-shrink-0">
                      <img src="/placeholder.svg" alt="Artist" className="w-full h-full rounded-full object-cover" />
                    </div>
                    <div className="flex-grow">
                      <p className="text-[#2E1A47] font-medium">Bad Bunny</p>
                      <p className="text-xs text-[#5C3D8D]">Nuevo álbum y fechas de conciertos</p>
                    </div>
                    <Link
                      to="/events/7"
                      className="px-3 py-1 bg-[#5C3D8D] text-white rounded-md hover:bg-[#2E1A47] transition-colors text-sm"
                    >
                      {t("home.see_event")}
                    </Link>
                  </motion.div>
                </>
              )}
            </div>
          </div>
        </section>

        {/* Trending Events */}
        <section className="py-6 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-[#5C3D8D]" />
                <h2 className="text-xl font-bold text-[#2E1A47]">{t("home.trending")}</h2>
              </div>
              <Link to="/trending" className="text-[#5C3D8D] hover:text-[#2E1A47] text-sm flex items-center">
              {t("home.see_more")} <ChevronRight size={16} />
              </Link>
            </div>

            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {isLoading ? (
                  [1, 2, 3, 4].map((i) => <div key={i} className="bg-[#F3F0FA]/50 animate-pulse rounded-lg h-24"></div>)
                ) : (
                  <>
                    <motion.div
                      className="bg-[#F3F0FA] rounded-lg p-3 flex flex-col"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium bg-[#5C3D8D]/10 text-[#5C3D8D] px-2 py-1 rounded-full">
                          #1 Trending
                        </span>
                        <TrendingUp className="h-4 w-4 text-[#5C3D8D]" />
                      </div>
                      <h3 className="font-medium text-[#2E1A47] mb-1">Festival de Música Urbana</h3>
                      <p className="text-xs text-[#5C3D8D]">+2500 personas interesadas hoy</p>
                    </motion.div>

                    <motion.div
                      className="bg-[#F3F0FA] rounded-lg p-3 flex flex-col"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: 0.1 }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium bg-[#5C3D8D]/10 text-[#5C3D8D] px-2 py-1 rounded-full">
                          #2 Trending
                        </span>
                        <TrendingUp className="h-4 w-4 text-[#5C3D8D]" />
                      </div>
                      <h3 className="font-medium text-[#2E1A47] mb-1">Concierto de Rock Alternativo</h3>
                      <p className="text-xs text-[#5C3D8D]">+1800 personas interesadas hoy</p>
                    </motion.div>

                    <motion.div
                      className="bg-[#F3F0FA] rounded-lg p-3 flex flex-col"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: 0.2 }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium bg-[#5C3D8D]/10 text-[#5C3D8D] px-2 py-1 rounded-full">
                          #3 Trending
                        </span>
                        <TrendingUp className="h-4 w-4 text-[#5C3D8D]" />
                      </div>
                      <h3 className="font-medium text-[#2E1A47] mb-1">Partido de Fútbol - Liga Nacional</h3>
                      <p className="text-xs text-[#5C3D8D]">+1200 personas interesadas hoy</p>
                    </motion.div>

                    <motion.div
                      className="bg-[#F3F0FA] rounded-lg p-3 flex flex-col"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: 0.3 }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium bg-[#5C3D8D]/10 text-[#5C3D8D] px-2 py-1 rounded-full">
                          #4 Trending
                        </span>
                        <TrendingUp className="h-4 w-4 text-[#5C3D8D]" />
                      </div>
                      <h3 className="font-medium text-[#2E1A47] mb-1">Obra de Teatro Clásico</h3>
                      <p className="text-xs text-[#5C3D8D]">+950 personas interesadas hoy</p>
                    </motion.div>
                  </>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}