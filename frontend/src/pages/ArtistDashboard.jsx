"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import {
  Calendar,
  BarChart3,
  Music,
  Settings,
  Search,
  Users,
  DollarSign,
  Eye,
  Edit,
  ImageIcon,
  MessageSquare,
  Heart,
  Share2,
} from "lucide-react"
import Nav from "../components/Navbar"
import Footer from "../components/Footer"
import useAlert from "../hooks/useAlert"
import Alert from "../components/Alert"

const ArtistDashboard = () => {
  const { alert, showAlert, hideAlert } = useAlert()
  const [activeTab, setActiveTab] = useState("overview")
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  // Mock data
  const stats = {
    totalPerformances: 18,
    upcomingPerformances: 5,
    totalFollowers: 12458,
    totalRevenue: 45780.5,
  }

  const performances = [
    {
      id: 1,
      eventName: "Festival de Verano",
      date: "2023-06-15",
      location: "Parque Central, Madrid",
      status: "Confirmado",
      attendees: 1245,
      fee: 3500,
    },
    {
      id: 2,
      eventName: "Concierto Rock en Vivo",
      date: "2023-06-20",
      location: "Palacio de Deportes, Barcelona",
      status: "Pendiente",
      attendees: 876,
      fee: 2800,
    },
    {
      id: 3,
      eventName: "Noche de Jazz",
      date: "2023-06-25",
      location: "Club Blue Note, Valencia",
      status: "Confirmado",
      attendees: 450,
      fee: 1500,
    },
    {
      id: 4,
      eventName: "Festival Indie",
      date: "2023-06-30",
      location: "Recinto Ferial, Sevilla",
      status: "Finalizado",
      attendees: 1320,
      fee: 4200,
    },
    {
      id: 5,
      eventName: "Concierto Benéfico",
      date: "2023-07-05",
      location: "Auditorio Municipal, Bilbao",
      status: "Confirmado",
      attendees: 678,
      fee: 2000,
    },
  ]

  const upcomingPerformances = performances
    .filter((performance) => performance.status === "Confirmado" || performance.status === "Pendiente")
    .slice(0, 3)

  const posts = [
    {
      id: 1,
      content: "¡Emocionado por mi próxima actuación en el Festival de Verano! ¿Quién se apunta?",
      date: "Hace 2 días",
      likes: 345,
      comments: 42,
      image: "/placeholder.svg?height=300&width=500",
    },
    {
      id: 2,
      content: "Ensayando nuevas canciones para el concierto del próximo mes. ¡Va a ser increíble!",
      date: "Hace 5 días",
      likes: 278,
      comments: 31,
      image: "/placeholder.svg?height=300&width=500",
    },
  ]

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  const handleCreatePost = () => {
    showAlert({
      type: "success",
      message: "Publicación creada correctamente",
    })
    // Logic to create post would go here
  }

  const filteredPerformances = performances.filter(
    (performance) =>
      performance.eventName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      performance.location.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <>
      <Nav isAuthenticated={true}/>
      <Alert type={alert.type} message={alert.message} isVisible={alert.isVisible} onClose={hideAlert} />

      <div className="min-h-screen bg-gray-50 mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Sidebar */}
            <motion.div
              className="w-full md:w-64 bg-white rounded-xl shadow-md p-4"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex flex-col items-center mb-6">
                <div className="w-24 h-24 rounded-full bg-[#F3F0FA] flex items-center justify-center text-[#5C3D8D] mb-3">
                  <Music className="h-12 w-12" />
                </div>
                <h2 className="text-xl font-bold text-[#2E1A47]">DJ Martínez</h2>
                <p className="text-sm text-gray-500">Artista / DJ</p>
              </div>

              <nav className="space-y-2">
                <button
                  onClick={() => setActiveTab("overview")}
                  className={`w-full flex items-center p-3 rounded-lg text-left transition-colors ${
                    activeTab === "overview" ? "bg-[#F3F0FA] text-[#5C3D8D]" : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <BarChart3 className="h-5 w-5 mr-3" />
                  <span>Resumen</span>
                </button>

                <button
                  onClick={() => setActiveTab("performances")}
                  className={`w-full flex items-center p-3 rounded-lg text-left transition-colors ${
                    activeTab === "performances" ? "bg-[#F3F0FA] text-[#5C3D8D]" : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <Calendar className="h-5 w-5 mr-3" />
                  <span>Actuaciones</span>
                </button>

                <button
                  onClick={() => setActiveTab("content")}
                  className={`w-full flex items-center p-3 rounded-lg text-left transition-colors ${
                    activeTab === "content" ? "bg-[#F3F0FA] text-[#5C3D8D]" : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <ImageIcon className="h-5 w-5 mr-3" />
                  <span>Contenido</span>
                </button>

                <button
                  onClick={() => setActiveTab("followers")}
                  className={`w-full flex items-center p-3 rounded-lg text-left transition-colors ${
                    activeTab === "followers" ? "bg-[#F3F0FA] text-[#5C3D8D]" : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <Users className="h-5 w-5 mr-3" />
                  <span>Seguidores</span>
                </button>

                <button
                  onClick={() => setActiveTab("settings")}
                  className={`w-full flex items-center p-3 rounded-lg text-left transition-colors ${
                    activeTab === "settings" ? "bg-[#F3F0FA] text-[#5C3D8D]" : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <Settings className="h-5 w-5 mr-3" />
                  <span>Configuración</span>
                </button>
              </nav>
            </motion.div>

            {/* Main Content */}
            <motion.div
              className="flex-1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* Search Bar
              <div className="bg-white rounded-xl shadow-md p-4 mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Buscar actuaciones, eventos..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5C3D8D] focus:border-transparent"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div> */}

              {/* Content based on active tab */}
              {activeTab === "overview" && (
                <div className="space-y-6">
                  {/* Stats Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <motion.div
                      className="bg-white p-6 rounded-xl shadow-md"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.1 }}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-500">Total Actuaciones</p>
                          <h3 className="text-2xl font-bold text-[#2E1A47]">{stats.totalPerformances}</h3>
                        </div>
                        <div className="p-3 bg-[#F3F0FA] rounded-full">
                          <Music className="h-6 w-6 text-[#5C3D8D]" />
                        </div>
                      </div>
                    </motion.div>

                    <motion.div
                      className="bg-white p-6 rounded-xl shadow-md"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.2 }}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-500">Próximas Actuaciones</p>
                          <h3 className="text-2xl font-bold text-[#2E1A47]">{stats.upcomingPerformances}</h3>
                        </div>
                        <div className="p-3 bg-[#F3F0FA] rounded-full">
                          <Calendar className="h-6 w-6 text-[#5C3D8D]" />
                        </div>
                      </div>
                    </motion.div>

                    <motion.div
                      className="bg-white p-6 rounded-xl shadow-md"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.3 }}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-500">Seguidores</p>
                          <h3 className="text-2xl font-bold text-[#2E1A47]">{stats.totalFollowers.toLocaleString()}</h3>
                        </div>
                        <div className="p-3 bg-[#F3F0FA] rounded-full">
                          <Users className="h-6 w-6 text-[#5C3D8D]" />
                        </div>
                      </div>
                    </motion.div>

                    <motion.div
                      className="bg-white p-6 rounded-xl shadow-md"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.4 }}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-500">Ingresos Totales</p>
                          <h3 className="text-2xl font-bold text-[#2E1A47]">
                            €
                            {stats.totalRevenue.toLocaleString(undefined, {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </h3>
                        </div>
                        <div className="p-3 bg-[#F3F0FA] rounded-full">
                          <DollarSign className="h-6 w-6 text-[#5C3D8D]" />
                        </div>
                      </div>
                    </motion.div>
                  </div>

                  {/* Upcoming Performances */}
                  <motion.div
                    className="bg-white rounded-xl shadow-md overflow-hidden"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.5 }}
                  >
                    <div className="p-4 border-b border-gray-100">
                      <h3 className="text-lg font-semibold text-[#2E1A47]">Próximas Actuaciones</h3>
                    </div>
                    <div className="p-4">
                      <div className="space-y-4">
                        {isLoading ? (
                          <div className="animate-pulse space-y-3">
                            {[...Array(3)].map((_, i) => (
                              <div key={i} className="flex items-center space-x-4">
                                <div className="rounded-lg bg-gray-200 h-16 w-16"></div>
                                <div className="flex-1 space-y-2">
                                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                                  <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          upcomingPerformances.map((performance) => (
                            <div
                              key={performance.id}
                              className="flex flex-col md:flex-row md:items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50"
                            >
                              <div className="flex items-center mb-3 md:mb-0">
                                <div className="w-16 h-16 rounded-lg bg-[#F3F0FA] flex items-center justify-center text-[#5C3D8D]">
                                  <Music className="h-8 w-8" />
                                </div>
                                <div className="ml-4">
                                  <h4 className="text-md font-medium text-[#2E1A47]">{performance.eventName}</h4>
                                  <p className="text-sm text-gray-500">
                                    {performance.date} | {performance.location}
                                  </p>
                                  <div className="flex items-center mt-1">
                                    <span
                                      className={`text-xs px-2 py-0.5 rounded-full ${
                                        performance.status === "Confirmado"
                                          ? "bg-green-100 text-green-800"
                                          : performance.status === "Pendiente"
                                            ? "bg-yellow-100 text-yellow-800"
                                            : "bg-red-100 text-red-800"
                                      }`}
                                    >
                                      {performance.status}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <div className="flex flex-col md:items-end">
                                <div className="flex items-center mb-2">
                                  <Users className="h-4 w-4 text-gray-500 mr-1" />
                                  <span className="text-sm text-gray-700">{performance.attendees} asistentes</span>
                                </div>
                                <div className="flex items-center mb-2">
                                  <DollarSign className="h-4 w-4 text-gray-500 mr-1" />
                                  <span className="text-sm text-gray-700">€{performance.fee.toLocaleString()}</span>
                                </div>
                                <div className="flex space-x-2">
                                  <button className="p-2 text-[#5C3D8D] hover:bg-[#F3F0FA] rounded-lg transition-colors">
                                    <Eye className="h-4 w-4" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>

                      <div className="mt-4 text-center">
                        <button
                          onClick={() => setActiveTab("performances")}
                          className="text-sm text-[#5C3D8D] hover:text-[#2E1A47]"
                        >
                          Ver todas las actuaciones
                        </button>
                      </div>
                    </div>
                  </motion.div>

                  {/* Recent Posts */}
                  <motion.div
                    className="bg-white rounded-xl shadow-md overflow-hidden"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.6 }}
                  >
                    <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                      <h3 className="text-lg font-semibold text-[#2E1A47]">Publicaciones Recientes</h3>
                      <button
                        onClick={() => setActiveTab("content")}
                        className="text-sm text-[#5C3D8D] hover:text-[#2E1A47]"
                      >
                        Ver todas
                      </button>
                    </div>
                    <div className="p-4">
                      <div className="space-y-6">
                        {posts.map((post) => (
                          <div key={post.id} className="border border-gray-100 rounded-lg overflow-hidden">
                            <div className="p-4">
                              <p className="text-gray-700 mb-3">{post.content}</p>
                              <p className="text-xs text-gray-500">{post.date}</p>
                            </div>
                            {post.image && (
                              <img
                                src={post.image || "/placeholder.svg"}
                                alt="Post"
                                className="w-full h-48 object-cover"
                              />
                            )}
                            <div className="p-4 flex items-center justify-between border-t border-gray-100">
                              <div className="flex items-center space-x-4">
                                <button className="flex items-center text-gray-500 hover:text-[#5C3D8D]">
                                  <Heart className="h-4 w-4 mr-1" />
                                  <span className="text-xs">{post.likes}</span>
                                </button>
                                <button className="flex items-center text-gray-500 hover:text-[#5C3D8D]">
                                  <MessageSquare className="h-4 w-4 mr-1" />
                                  <span className="text-xs">{post.comments}</span>
                                </button>
                              </div>
                              <button className="flex items-center text-gray-500 hover:text-[#5C3D8D]">
                                <Share2 className="h-4 w-4 mr-1" />
                                <span className="text-xs">Compartir</span>
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                </div>
              )}

              {activeTab === "performances" && (
                <motion.div
                  className="bg-white rounded-xl shadow-md overflow-hidden"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="p-4 border-b border-gray-100">
                    <h3 className="text-lg font-semibold text-[#2E1A47]">Mis Actuaciones</h3>
                  </div>
                  <div className="p-4">
                    <div className="space-y-4">
                      {filteredPerformances.length > 0 ? (
                        filteredPerformances.map((performance) => (
                          <div
                            key={performance.id}
                            className="flex flex-col md:flex-row md:items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50"
                          >
                            <div className="flex items-center mb-3 md:mb-0">
                              <div className="w-16 h-16 rounded-lg bg-[#F3F0FA] flex items-center justify-center text-[#5C3D8D]">
                                <Music className="h-8 w-8" />
                              </div>
                              <div className="ml-4">
                                <h4 className="text-md font-medium text-[#2E1A47]">{performance.eventName}</h4>
                                <p className="text-sm text-gray-500">
                                  {performance.date} | {performance.location}
                                </p>
                                <div className="flex items-center mt-1">
                                  <span
                                    className={`text-xs px-2 py-0.5 rounded-full ${
                                      performance.status === "Confirmado"
                                        ? "bg-green-100 text-green-800"
                                        : performance.status === "Pendiente"
                                          ? "bg-yellow-100 text-yellow-800"
                                          : performance.status === "Finalizado"
                                            ? "bg-blue-100 text-blue-800"
                                            : "bg-red-100 text-red-800"
                                    }`}
                                  >
                                    {performance.status}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="flex flex-col md:items-end">
                              <div className="flex items-center mb-2">
                                <Users className="h-4 w-4 text-gray-500 mr-1" />
                                <span className="text-sm text-gray-700">{performance.attendees} asistentes</span>
                              </div>
                              <div className="flex items-center mb-2">
                                <DollarSign className="h-4 w-4 text-gray-500 mr-1" />
                                <span className="text-sm text-gray-700">€{performance.fee.toLocaleString()}</span>
                              </div>
                              <div className="flex space-x-2">
                                <button className="p-2 text-[#5C3D8D] hover:bg-[#F3F0FA] rounded-lg transition-colors">
                                  <Eye className="h-4 w-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-8">
                          <Music className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                          <h3 className="text-lg font-medium text-[#2E1A47] mb-1">No hay actuaciones</h3>
                          <p className="text-gray-500">No se encontraron actuaciones con los filtros actuales.</p>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === "content" && (
                <motion.div
                  className="bg-white rounded-xl shadow-md overflow-hidden"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="p-4 border-b border-gray-100">
                    <h3 className="text-lg font-semibold text-[#2E1A47]">Gestión de Contenido</h3>
                  </div>
                  <div className="p-4">
                    <div className="mb-6 border border-gray-200 rounded-lg p-4">
                      <h4 className="text-md font-medium text-[#2E1A47] mb-3">Nueva Publicación</h4>
                      <textarea
                        placeholder="¿Qué quieres compartir con tus seguidores?"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5C3D8D] focus:border-transparent mb-3"
                        rows={3}
                      ></textarea>
                      <div className="flex justify-between items-center">
                        <button className="flex items-center text-[#5C3D8D] hover:text-[#2E1A47]">
                          <ImageIcon className="h-5 w-5 mr-1" />
                          <span>Añadir Imagen</span>
                        </button>
                        <button
                          className="px-4 py-2 bg-[#5C3D8D] text-white rounded-lg hover:bg-[#2E1A47] transition-colors"
                          onClick={handleCreatePost}
                        >
                          Publicar
                        </button>
                      </div>
                    </div>

                    <div className="space-y-6">
                      {posts.map((post) => (
                        <div key={post.id} className="border border-gray-100 rounded-lg overflow-hidden">
                          <div className="p-4">
                            <p className="text-gray-700 mb-3">{post.content}</p>
                            <p className="text-xs text-gray-500">{post.date}</p>
                          </div>
                          {post.image && (
                            <img
                              src={post.image || "/placeholder.svg"}
                              alt="Post"
                              className="w-full h-48 object-cover"
                            />
                          )}
                          <div className="p-4 flex items-center justify-between border-t border-gray-100">
                            <div className="flex items-center space-x-4">
                              <button className="flex items-center text-gray-500 hover:text-[#5C3D8D]">
                                <Heart className="h-4 w-4 mr-1" />
                                <span className="text-xs">{post.likes}</span>
                              </button>
                              <button className="flex items-center text-gray-500 hover:text-[#5C3D8D]">
                                <MessageSquare className="h-4 w-4 mr-1" />
                                <span className="text-xs">{post.comments}</span>
                              </button>
                            </div>
                            <div className="flex space-x-2">
                              <button className="p-2 text-[#5C3D8D] hover:bg-[#F3F0FA] rounded-lg transition-colors">
                                <Edit className="h-4 w-4" />
                              </button>
                              <button className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                                <trash-2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === "followers" && (
                <motion.div
                  className="bg-white rounded-xl shadow-md overflow-hidden"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="p-4 border-b border-gray-100">
                    <h3 className="text-lg font-semibold text-[#2E1A47]">Mis Seguidores</h3>
                  </div>
                  <div className="p-4">
                    <div className="text-center py-8">
                      <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-[#2E1A47] mb-1">Seguidores</h3>
                      <p className="text-gray-500 mb-2">Tienes {stats.totalFollowers.toLocaleString()} seguidores</p>
                      <p className="text-sm text-gray-500">
                        Aquí podrás ver estadísticas detalladas de tus seguidores.
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === "settings" && (
                <motion.div
                  className="bg-white rounded-xl shadow-md overflow-hidden"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="p-4 border-b border-gray-100">
                    <h3 className="text-lg font-semibold text-[#2E1A47]">Configuración de Perfil</h3>
                  </div>
                  <div className="p-6">
                    <div className="space-y-6">
                      <div>
                        <h4 className="text-md font-medium text-[#2E1A47] mb-4">Información Personal</h4>
                        <div className="space-y-4">
                          <div>
                            <label htmlFor="artist-name" className="block text-sm font-medium text-gray-700 mb-1">
                              Nombre Artístico
                            </label>
                            <input
                              type="text"
                              id="artist-name"
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5C3D8D] focus:border-transparent"
                              defaultValue="DJ Martínez"
                            />
                          </div>

                          <div>
                            <label htmlFor="artist-bio" className="block text-sm font-medium text-gray-700 mb-1">
                              Biografía
                            </label>
                            <textarea
                              id="artist-bio"
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5C3D8D] focus:border-transparent"
                              rows={4}
                              defaultValue="DJ con más de 10 años de experiencia en la escena electrónica. Especializado en house y techno."
                            ></textarea>
                          </div>

                          <div>
                            <label htmlFor="artist-email" className="block text-sm font-medium text-gray-700 mb-1">
                              Email de Contacto
                            </label>
                            <input
                              type="email"
                              id="artist-email"
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5C3D8D] focus:border-transparent"
                              defaultValue="djmartinez@example.com"
                            />
                          </div>

                          <div>
                            <label htmlFor="artist-phone" className="block text-sm font-medium text-gray-700 mb-1">
                              Teléfono
                            </label>
                            <input
                              type="tel"
                              id="artist-phone"
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5C3D8D] focus:border-transparent"
                              defaultValue="+34 612 345 678"
                            />
                          </div>

                          <div>
                            <label htmlFor="artist-website" className="block text-sm font-medium text-gray-700 mb-1">
                              Sitio Web
                            </label>
                            <input
                              type="url"
                              id="artist-website"
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5C3D8D] focus:border-transparent"
                              defaultValue="https://www.djmartinez.com"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-gray-200">
                        <h4 className="text-md font-medium text-[#2E1A47] mb-4">Redes Sociales</h4>
                        <div className="space-y-4">
                          <div>
                            <label htmlFor="artist-instagram" className="block text-sm font-medium text-gray-700 mb-1">
                              Instagram
                            </label>
                            <input
                              type="text"
                              id="artist-instagram"
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5C3D8D] focus:border-transparent"
                              defaultValue="@djmartinez"
                            />
                          </div>

                          <div>
                            <label htmlFor="artist-twitter" className="block text-sm font-medium text-gray-700 mb-1">
                              Twitter
                            </label>
                            <input
                              type="text"
                              id="artist-twitter"
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5C3D8D] focus:border-transparent"
                              defaultValue="@djmartinez"
                            />
                          </div>

                          <div>
                            <label htmlFor="artist-facebook" className="block text-sm font-medium text-gray-700 mb-1">
                              Facebook
                            </label>
                            <input
                              type="text"
                              id="artist-facebook"
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5C3D8D] focus:border-transparent"
                              defaultValue="DJ Martínez Oficial"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-gray-200">
                        <button
                          className="px-4 py-2 bg-[#5C3D8D] text-white rounded-lg hover:bg-[#2E1A47] transition-colors"
                          onClick={() => showAlert({ type: "success", message: "Perfil actualizado correctamente" })}
                        >
                          Guardar Cambios
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  )
}

export default ArtistDashboard
