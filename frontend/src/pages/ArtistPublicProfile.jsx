"use client"

import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { motion } from "framer-motion"
import {
  Calendar,
  MapPin,
  Users,
  Star,
  Heart,
  MessageSquare,
  Share2,
  Instagram,
  Twitter,
  Facebook,
  Globe,
  ChevronDown,
  ChevronUp,
} from "lucide-react"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import useAlert from "../hooks/useAlert"
import Alert from "../components/Alert"

const ArtistPublicProfile = () => {
  const { id } = useParams()
  const { alert, showAlert, hideAlert } = useAlert()
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("feed")
  const [showFullBio, setShowFullBio] = useState(false)

  // Mock data
  const artist = {
    id: 1,
    name: "DJ Martínez",
    type: "DJ / Productor",
    genres: ["Electrónica", "House", "Techno"],
    followers: 12458,
    image: "/placeholder.svg?height=400&width=400",
    coverImage: "/placeholder.svg?height=600&width=1200",
    verified: true,
    rating: 4.8,
    location: "Madrid, España",
    bio: "DJ con más de 10 años de experiencia en la escena electrónica. Especializado en house y techno. He actuado en los mejores clubes y festivales de Europa, compartiendo cabina con artistas de renombre internacional. Mi estilo se caracteriza por mezclas fluidas y una selección musical que va desde lo más underground hasta temas más comerciales, siempre manteniendo la esencia de la música electrónica. Además de mi faceta como DJ, también produzco mi propia música y he lanzado varios EPs en sellos reconocidos. Mi objetivo es hacer que la gente disfrute y baile con mi música, creando experiencias únicas en cada sesión.",
    socialMedia: {
      instagram: "@djmartinez",
      twitter: "@djmartinez",
      facebook: "DJ Martínez Oficial",
      website: "https://www.djmartinez.com",
    },
  }

  const posts = [
    {
      id: 1,
      content:
        "¡Emocionado por mi próxima actuación en el Festival de Verano! ¿Quién se apunta? Vamos a hacer historia juntos en este increíble evento. Prepárense para una noche llena de la mejor música electrónica.",
      date: "Hace 2 días",
      likes: 345,
      comments: 42,
      image: "/placeholder.svg?height=400&width=600",
    },
    {
      id: 2,
      content:
        "Ensayando nuevas canciones para el concierto del próximo mes. ¡Va a ser increíble! He estado trabajando en algunas mezclas especiales que estoy seguro que les encantarán.",
      date: "Hace 5 días",
      likes: 278,
      comments: 31,
      image: "/placeholder.svg?height=400&width=600",
    },
    {
      id: 3,
      content:
        "Acabo de lanzar mi nuevo EP 'Electronic Dreams'. Ya disponible en todas las plataformas digitales. ¡Espero que lo disfruten tanto como yo disfruté creándolo!",
      date: "Hace 1 semana",
      likes: 512,
      comments: 87,
      image: "/placeholder.svg?height=400&width=600",
    },
  ]

  const upcomingEvents = [
    {
      id: 1,
      name: "Festival de Verano",
      date: "15 Jun 2023",
      time: "22:00",
      location: "Parque Central, Madrid",
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      id: 2,
      name: "Noche Electrónica",
      date: "22 Jun 2023",
      time: "23:30",
      location: "Club Sonido, Barcelona",
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      id: 3,
      name: "Beach Party",
      date: "30 Jun 2023",
      time: "16:00",
      location: "Playa del Sol, Valencia",
      image: "/placeholder.svg?height=200&width=300",
    },
  ]

  const pastEvents = [
    {
      id: 4,
      name: "Club Night",
      date: "28 May 2023",
      location: "Sala Groove, Madrid",
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      id: 5,
      name: "Festival Primavera",
      date: "15 May 2023",
      location: "Recinto Ferial, Sevilla",
      image: "/placeholder.svg?height=200&width=300",
    },
  ]

  const gallery = [
    {
      id: 1,
      image: "/placeholder.svg?height=300&width=300",
      caption: "Festival de Invierno 2022",
    },
    {
      id: 2,
      image: "/placeholder.svg?height=300&width=300",
      caption: "Sesión en Club Sonido",
    },
    {
      id: 3,
      image: "/placeholder.svg?height=300&width=300",
      caption: "Backstage en Festival EDM",
    },
    {
      id: 4,
      image: "/placeholder.svg?height=300&width=300",
      caption: "Produciendo en el estudio",
    },
    {
      id: 5,
      image: "/placeholder.svg?height=300&width=300",
      caption: "Fiesta en la playa",
    },
    {
      id: 6,
      image: "/placeholder.svg?height=300&width=300",
      caption: "Concierto en Madrid",
    },
  ]

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [id])

  const handleFollow = () => {
    showAlert({
      type: "success",
      message: "Ahora sigues a este artista",
    })
    // Logic to follow artist would go here
  }

  const handleLike = (postId) => {
    showAlert({
      type: "success",
      message: "Te gusta esta publicación",
    })
    // Logic to like post would go here
  }

  const handleShare = (postId) => {
    showAlert({
      type: "success",
      message: "Publicación compartida",
    })
    // Logic to share post would go here
  }

  return (
    <>
      <Navbar />
      <Alert type={alert.type} message={alert.message} isVisible={alert.isVisible} onClose={hideAlert} />

      <div className="min-h-screen bg-gray-50">
        {isLoading ? (
          <div className="animate-pulse">
            <div className="h-64 bg-gray-200 w-full"></div>
            <div className="container mx-auto px-4 -mt-16">
              <div className="h-32 w-32 bg-gray-300 rounded-full mx-auto"></div>
              <div className="mt-4 space-y-3 max-w-2xl mx-auto text-center">
                <div className="h-8 bg-gray-200 rounded w-1/3 mx-auto"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4 mx-auto"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Cover Image */}
            <div
              className="h-64 bg-cover bg-center"
              style={{ backgroundImage: `url(${artist.coverImage || "/placeholder.svg"})` }}
            >
              <div className="h-full w-full bg-black bg-opacity-30 flex items-end">
                <div className="container mx-auto px-4 pb-20">
                  <h1 className="text-white text-3xl font-bold drop-shadow-lg">{artist.name}</h1>
                  <p className="text-white text-lg drop-shadow-lg">{artist.type}</p>
                </div>
              </div>
            </div>

            {/* Artist Info */}
            <div className="container mx-auto px-4 -mt-16 mb-8">
              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex flex-col md:flex-row">
                  {/* Profile Image */}
                  <div className="flex-shrink-0 mx-auto md:mx-0 mb-4 md:mb-0">
                    <div className="relative">
                      <img
                        src={artist.image || "/placeholder.svg"}
                        alt={artist.name}
                        className="w-32 h-32 rounded-full border-4 border-white object-cover"
                      />
                      {artist.verified && (
                        <span className="absolute bottom-0 right-0 bg-blue-500 text-white rounded-full p-1 border-2 border-white">
                          <svg
                            className="h-4 w-4"
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
                  </div>

                  {/* Artist Details */}
                  <div className="md:ml-6 flex-1 text-center md:text-left">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                      <div>
                        <h1 className="text-2xl font-bold text-[#2E1A47] flex items-center justify-center md:justify-start">
                          {artist.name}
                          <span className="ml-2 bg-[#F3F0FA] text-[#5C3D8D] text-xs px-2 py-0.5 rounded-full flex items-center">
                            <Star className="h-3 w-3 mr-1 fill-[#5C3D8D]" />
                            {artist.rating}
                          </span>
                        </h1>
                        <p className="text-gray-500 mb-2">{artist.type}</p>
                      </div>
                      <button
                        className="mt-4 md:mt-0 px-6 py-2 bg-[#5C3D8D] text-white rounded-lg hover:bg-[#2E1A47] transition-colors"
                        onClick={handleFollow}
                      >
                        Seguir
                      </button>
                    </div>

                    <div className="flex flex-wrap justify-center md:justify-start gap-2 my-3">
                      {artist.genres.map((genre) => (
                        <span key={genre} className="text-xs bg-[#F3F0FA] text-[#5C3D8D] px-2 py-1 rounded-full">
                          {genre}
                        </span>
                      ))}
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4 mt-3">
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 text-gray-500 mr-1" />
                        <span className="text-sm text-gray-500">{artist.location}</span>
                      </div>
                      <div className="flex items-center">
                        <Users className="h-4 w-4 text-gray-500 mr-1" />
                        <span className="text-sm text-gray-500">{artist.followers.toLocaleString()} seguidores</span>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 text-gray-500 mr-1" />
                        <span className="text-sm text-gray-500">{upcomingEvents.length} próximos eventos</span>
                      </div>
                    </div>

                    {/* Social Media */}
                    <div className="flex items-center justify-center md:justify-start space-x-4 mt-4">
                      {artist.socialMedia.instagram && (
                        <a
                          href={`https://instagram.com/${artist.socialMedia.instagram.replace("@", "")}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-500 hover:text-[#5C3D8D]"
                        >
                          <Instagram className="h-5 w-5" />
                        </a>
                      )}
                      {artist.socialMedia.twitter && (
                        <a
                          href={`https://twitter.com/${artist.socialMedia.twitter.replace("@", "")}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-500 hover:text-[#5C3D8D]"
                        >
                          <Twitter className="h-5 w-5" />
                        </a>
                      )}
                      {artist.socialMedia.facebook && (
                        <a
                          href={`https://facebook.com/${artist.socialMedia.facebook}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-500 hover:text-[#5C3D8D]"
                        >
                          <Facebook className="h-5 w-5" />
                        </a>
                      )}
                      {artist.socialMedia.website && (
                        <a
                          href={artist.socialMedia.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-500 hover:text-[#5C3D8D]"
                        >
                          <Globe className="h-5 w-5" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                {/* Bio */}
                <div className="mt-6 border-t border-gray-100 pt-6">
                  <h3 className="text-lg font-semibold text-[#2E1A47] mb-2">Biografía</h3>
                  <p className="text-gray-700">{showFullBio ? artist.bio : `${artist.bio.substring(0, 250)}...`}</p>
                  <button
                    className="mt-2 text-[#5C3D8D] hover:text-[#2E1A47] flex items-center"
                    onClick={() => setShowFullBio(!showFullBio)}
                  >
                    {showFullBio ? (
                      <>
                        Mostrar menos <ChevronUp className="h-4 w-4 ml-1" />
                      </>
                    ) : (
                      <>
                        Leer más <ChevronDown className="h-4 w-4 ml-1" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="container mx-auto px-4 mb-8">
              <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="flex border-b border-gray-100">
                  <button
                    className={`flex-1 py-3 px-4 text-center font-medium ${
                      activeTab === "feed"
                        ? "text-[#5C3D8D] border-b-2 border-[#5C3D8D]"
                        : "text-gray-500 hover:text-[#5C3D8D]"
                    }`}
                    onClick={() => setActiveTab("feed")}
                  >
                    Publicaciones
                  </button>
                  <button
                    className={`flex-1 py-3 px-4 text-center font-medium ${
                      activeTab === "events"
                        ? "text-[#5C3D8D] border-b-2 border-[#5C3D8D]"
                        : "text-gray-500 hover:text-[#5C3D8D]"
                    }`}
                    onClick={() => setActiveTab("events")}
                  >
                    Eventos
                  </button>
                  <button
                    className={`flex-1 py-3 px-4 text-center font-medium ${
                      activeTab === "gallery"
                        ? "text-[#5C3D8D] border-b-2 border-[#5C3D8D]"
                        : "text-gray-500 hover:text-[#5C3D8D]"
                    }`}
                    onClick={() => setActiveTab("gallery")}
                  >
                    Galería
                  </button>
                </div>

                {/* Tab Content */}
                <div className="p-4">
                  {/* Feed Tab */}
                  {activeTab === "feed" && (
                    <div className="space-y-6">
                      {posts.map((post) => (
                        <motion.div
                          key={post.id}
                          className="border border-gray-100 rounded-lg overflow-hidden"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5 }}
                        >
                          <div className="p-4">
                            <div className="flex items-center mb-3">
                              <img
                                src={artist.image || "/placeholder.svg"}
                                alt={artist.name}
                                className="h-10 w-10 rounded-full object-cover mr-3"
                              />
                              <div>
                                <h4 className="font-medium text-[#2E1A47]">{artist.name}</h4>
                                <p className="text-xs text-gray-500">{post.date}</p>
                              </div>
                            </div>
                            <p className="text-gray-700 mb-3">{post.content}</p>
                          </div>
                          {post.image && (
                            <img
                              src={post.image || "/placeholder.svg"}
                              alt="Post"
                              className="w-full h-64 object-cover"
                            />
                          )}
                          <div className="p-4 flex items-center justify-between border-t border-gray-100">
                            <div className="flex items-center space-x-4">
                              <button
                                className="flex items-center text-gray-500 hover:text-[#5C3D8D]"
                                onClick={() => handleLike(post.id)}
                              >
                                <Heart className="h-5 w-5 mr-1" />
                                <span className="text-sm">{post.likes}</span>
                              </button>
                              <button className="flex items-center text-gray-500 hover:text-[#5C3D8D]">
                                <MessageSquare className="h-5 w-5 mr-1" />
                                <span className="text-sm">{post.comments}</span>
                              </button>
                            </div>
                            <button
                              className="flex items-center text-gray-500 hover:text-[#5C3D8D]"
                              onClick={() => handleShare(post.id)}
                            >
                              <Share2 className="h-5 w-5 mr-1" />
                              <span className="text-sm">Compartir</span>
                            </button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}

                  {/* Events Tab */}
                  {activeTab === "events" && (
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-semibold text-[#2E1A47] mb-4">Próximos Eventos</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {upcomingEvents.map((event) => (
                            <motion.div
                              key={event.id}
                              className="border border-gray-100 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.5 }}
                            >
                              <img
                                src={event.image || "/placeholder.svg"}
                                alt={event.name}
                                className="w-full h-32 object-cover"
                              />
                              <div className="p-3">
                                <h4 className="font-medium text-[#2E1A47]">{event.name}</h4>
                                <div className="flex items-center text-sm text-gray-500 mt-1">
                                  <Calendar className="h-4 w-4 mr-1" />
                                  {event.date} - {event.time}
                                </div>
                                <div className="flex items-center text-sm text-gray-500 mt-1">
                                  <MapPin className="h-4 w-4 mr-1" />
                                  {event.location}
                                </div>
                                <button className="mt-3 w-full py-1.5 bg-[#5C3D8D] text-white text-sm rounded-lg hover:bg-[#2E1A47] transition-colors">
                                  Comprar Entradas
                                </button>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>

                      <div className="pt-6 border-t border-gray-100">
                        <h3 className="text-lg font-semibold text-[#2E1A47] mb-4">Eventos Pasados</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {pastEvents.map((event) => (
                            <motion.div
                              key={event.id}
                              className="border border-gray-100 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.5 }}
                            >
                              <div className="relative">
                                <img
                                  src={event.image || "/placeholder.svg"}
                                  alt={event.name}
                                  className="w-full h-32 object-cover filter grayscale"
                                />
                                <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                                  <span className="text-white font-medium">Finalizado</span>
                                </div>
                              </div>
                              <div className="p-3">
                                <h4 className="font-medium text-[#2E1A47]">{event.name}</h4>
                                <div className="flex items-center text-sm text-gray-500 mt-1">
                                  <Calendar className="h-4 w-4 mr-1" />
                                  {event.date}
                                </div>
                                <div className="flex items-center text-sm text-gray-500 mt-1">
                                  <MapPin className="h-4 w-4 mr-1" />
                                  {event.location}
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Gallery Tab */}
                  {activeTab === "gallery" && (
                    <div>
                      <h3 className="text-lg font-semibold text-[#2E1A47] mb-4">Galería de Fotos</h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {gallery.map((item) => (
                          <motion.div
                            key={item.id}
                            className="relative rounded-lg overflow-hidden group"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5 }}
                          >
                            <img
                              src={item.image || "/placeholder.svg"}
                              alt={item.caption}
                              className="w-full h-40 object-cover"
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center">
                              <div className="text-white text-center p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <p className="text-sm font-medium">{item.caption}</p>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      <Footer />
    </>
  )
}

export default ArtistPublicProfile
