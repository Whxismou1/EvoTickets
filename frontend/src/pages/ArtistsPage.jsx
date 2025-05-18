"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Link } from "react-router-dom"
import { Search, Music, Filter, ChevronDown, Users, Calendar, MapPin, Star } from "lucide-react"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import useAlert from "../hooks/useAlert"
import Alert from "../components/Alert"

const ArtistsPage = () => {
  const { alert, showAlert, hideAlert } = useAlert()
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeFilter, setActiveFilter] = useState("all")
  const [showFilters, setShowFilters] = useState(false)
  const [selectedGenres, setSelectedGenres] = useState([])

  // Mock data
  const artists = [
    {
      id: 1,
      name: "DJ Martínez",
      type: "DJ / Productor",
      genres: ["Electrónica", "House", "Techno"],
      followers: 12458,
      image: "/placeholder.svg?height=300&width=300",
      verified: true,
      rating: 4.8,
      upcomingEvents: 3,
      location: "Madrid, España",
    },
    {
      id: 2,
      name: "Banda Rockera",
      type: "Banda de Rock",
      genres: ["Rock", "Indie", "Alternativo"],
      followers: 8732,
      image: "/placeholder.svg?height=300&width=300",
      verified: true,
      rating: 4.6,
      upcomingEvents: 2,
      location: "Barcelona, España",
    },
    {
      id: 3,
      name: "Laura Sánchez",
      type: "Cantante",
      genres: ["Pop", "R&B", "Soul"],
      followers: 5621,
      image: "/placeholder.svg?height=300&width=300",
      verified: false,
      rating: 4.5,
      upcomingEvents: 1,
      location: "Valencia, España",
    },
    {
      id: 4,
      name: "Los Flamantes",
      type: "Grupo Flamenco",
      genres: ["Flamenco", "Fusión"],
      followers: 7845,
      image: "/placeholder.svg?height=300&width=300",
      verified: true,
      rating: 4.9,
      upcomingEvents: 4,
      location: "Sevilla, España",
    },
    {
      id: 5,
      name: "Jazzistas Unidos",
      type: "Grupo de Jazz",
      genres: ["Jazz", "Blues", "Swing"],
      followers: 3254,
      image: "/placeholder.svg?height=300&width=300",
      verified: false,
      rating: 4.7,
      upcomingEvents: 2,
      location: "Bilbao, España",
    },
    {
      id: 6,
      name: "Electro Beats",
      type: "DJ / Productor",
      genres: ["Electrónica", "Dubstep", "Drum & Bass"],
      followers: 9876,
      image: "/placeholder.svg?height=300&width=300",
      verified: true,
      rating: 4.4,
      upcomingEvents: 5,
      location: "Madrid, España",
    },
  ]

  const genres = [
    "Electrónica",
    "House",
    "Techno",
    "Rock",
    "Indie",
    "Alternativo",
    "Pop",
    "R&B",
    "Soul",
    "Flamenco",
    "Fusión",
    "Jazz",
    "Blues",
    "Swing",
    "Dubstep",
    "Drum & Bass",
  ]

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  const handleFollow = (artistId) => {
    showAlert({
      type: "success",
      message: "Ahora sigues a este artista",
    })
    // Logic to follow artist would go here
  }

  const toggleGenre = (genre) => {
    if (selectedGenres.includes(genre)) {
      setSelectedGenres(selectedGenres.filter((g) => g !== genre))
    } else {
      setSelectedGenres([...selectedGenres, genre])
    }
  }

  const filteredArtists = artists.filter((artist) => {
    const matchesSearch =
      artist.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      artist.type.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType =
      activeFilter === "all" ||
      (activeFilter === "dj" && artist.type.toLowerCase().includes("dj")) ||
      (activeFilter === "band" && artist.type.toLowerCase().includes("banda")) ||
      (activeFilter === "singer" && artist.type.toLowerCase().includes("cantante"))
    const matchesGenres = selectedGenres.length === 0 || selectedGenres.some((genre) => artist.genres.includes(genre))

    return matchesSearch && matchesType && matchesGenres
  })

  return (
    <>
      <Navbar />
      <Alert type={alert.type} message={alert.message} isVisible={alert.isVisible} onClose={hideAlert} />

      <div className="min-h-screen bg-gray-50 mt-16">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-[#2E1A47] mb-2">Descubre Artistas</h1>
            <p className="text-gray-600">Explora y conecta con tus artistas favoritos</p>
          </div>

          {/* Search and Filters */}
          <div className="bg-white rounded-xl shadow-md p-4 mb-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar artistas, bandas..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5C3D8D] focus:border-transparent"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="flex space-x-2 overflow-x-auto pb-2 md:pb-0">
                <button
                  onClick={() => setActiveFilter("all")}
                  className={`px-3 py-1 rounded-full text-sm whitespace-nowrap ${
                    activeFilter === "all" ? "bg-[#5C3D8D] text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Todos
                </button>
                <button
                  onClick={() => setActiveFilter("dj")}
                  className={`px-3 py-1 rounded-full text-sm whitespace-nowrap ${
                    activeFilter === "dj" ? "bg-[#5C3D8D] text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  DJs
                </button>
                <button
                  onClick={() => setActiveFilter("band")}
                  className={`px-3 py-1 rounded-full text-sm whitespace-nowrap ${
                    activeFilter === "band" ? "bg-[#5C3D8D] text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Bandas
                </button>
                <button
                  onClick={() => setActiveFilter("singer")}
                  className={`px-3 py-1 rounded-full text-sm whitespace-nowrap ${
                    activeFilter === "singer"
                      ? "bg-[#5C3D8D] text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Cantantes
                </button>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="px-3 py-1 rounded-full text-sm whitespace-nowrap bg-gray-100 text-gray-700 hover:bg-gray-200 flex items-center"
                >
                  <Filter className="h-3 w-3 mr-1" />
                  Filtros
                  <ChevronDown className={`h-3 w-3 ml-1 transition-transform ${showFilters ? "rotate-180" : ""}`} />
                </button>
              </div>
            </div>

            {/* Advanced Filters */}
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="pt-4 border-t border-gray-100"
              >
                <h4 className="text-sm font-medium text-[#2E1A47] mb-2">Géneros Musicales</h4>
                <div className="flex flex-wrap gap-2">
                  {genres.map((genre) => (
                    <button
                      key={genre}
                      onClick={() => toggleGenre(genre)}
                      className={`px-3 py-1 rounded-full text-xs ${
                        selectedGenres.includes(genre)
                          ? "bg-[#5C3D8D] text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {genre}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* Artists Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse bg-white rounded-xl shadow-md overflow-hidden">
                  <div className="h-48 bg-gray-200"></div>
                  <div className="p-4 space-y-3">
                    <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                    <div className="h-8 bg-gray-200 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredArtists.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredArtists.map((artist) => (
                <motion.div
                  key={artist.id}
                  className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <Link to={`/artists/${artist.id}`} className="block relative">
                    <img
                      src={artist.image || "/placeholder.svg"}
                      alt={artist.name}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-3 right-3 bg-white/80 backdrop-blur-sm rounded-full px-2 py-1 flex items-center">
                      <Star className="h-3 w-3 text-yellow-500 fill-yellow-500 mr-1" />
                      <span className="text-xs font-medium">{artist.rating}</span>
                    </div>
                  </Link>

                  <div className="p-4">
                    <Link to={`/artists/${artist.id}`}>
                      <div className="flex items-center mb-2">
                        <h3 className="text-lg font-semibold text-[#2E1A47]">{artist.name}</h3>
                        {artist.verified && (
                          <span className="ml-1 bg-blue-500 text-white rounded-full p-0.5">
                            <svg
                              className="h-3 w-3"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="3"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M20 6L9 17l-5-5" />
                            </svg>
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 mb-2">{artist.type}</p>
                    </Link>

                    <div className="flex flex-wrap gap-1 mb-3">
                      {artist.genres.slice(0, 3).map((genre) => (
                        <span key={genre} className="text-xs bg-[#F3F0FA] text-[#5C3D8D] px-2 py-0.5 rounded-full">
                          {genre}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center text-sm text-gray-500 mb-2">
                      <MapPin className="h-4 w-4 mr-1" />
                      {artist.location}
                    </div>

                    <div className="flex justify-between items-center mb-4">
                      <div className="flex items-center text-sm text-gray-500">
                        <Users className="h-4 w-4 mr-1" />
                        {artist.followers.toLocaleString()} seguidores
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="h-4 w-4 mr-1" />
                        {artist.upcomingEvents} eventos
                      </div>
                    </div>

                    <button
                      className="w-full py-2 bg-[#5C3D8D] text-white rounded-lg hover:bg-[#2E1A47] transition-colors"
                      onClick={(e) => {
                        e.preventDefault()
                        handleFollow(artist.id)
                      }}
                    >
                      Seguir
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <Music className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-[#2E1A47] mb-2">No se encontraron artistas</h3>
              <p className="text-gray-500 max-w-md mx-auto">
                No hay artistas que coincidan con tu búsqueda. Intenta con otros términos o filtros.
              </p>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </>
  )
}

export default ArtistsPage
