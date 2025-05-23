"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useNavigate } from "react-router-dom"
import {
  Calendar,
  BarChart3,
  Users,
  Settings,
  Search,
  Ticket,
  DollarSign,
  Clock,
  Plus,
  Eye,
  Edit,
  Trash2,
  Filter,
} from "lucide-react"
import Nav from "../components/Navbar"
import Footer from "../components/Footer"
import useAlert from "../hooks/useAlert"
import Alert from "../components/Alert"
import { getEventsByOrganizer } from "../services/eventService";
import { useAuthStore } from "../store/authStore";
import { useTranslation } from "react-i18next";

const EventManagerDashboard = () => {
  const navigate = useNavigate()
  const { t } = useTranslation();
  const { alert, showAlert, hideAlert } = useAlert()
  const [activeTab, setActiveTab] = useState("overview")
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")


  // // Mock data
  // const stats = {
  //   totalEvents: 24,
  //   activeEvents: 8,
  //   totalTicketsSold: 3567,
  //   totalRevenue: 85430.75,
  // }

  // const events = [
  //   {
  //     id: 1,
  //     name: "Festival de Verano",
  //     date: "2023-06-15",
  //     location: "Parque Central, Madrid",
  //     status: "Activo",
  //     ticketsSold: 1245,
  //     capacity: 2000,
  //     revenue: 24900,
  //   },
  //   {
  //     id: 2,
  //     name: "Concierto Rock en Vivo",
  //     date: "2023-06-20",
  //     location: "Palacio de Deportes, Barcelona",
  //     status: "Pendiente",
  //     ticketsSold: 876,
  //     capacity: 1500,
  //     revenue: 17520,
  //   },
  //   {
  //     id: 3,
  //     name: "Teatro: Romeo y Julieta",
  //     date: "2023-06-25",
  //     location: "Teatro Principal, Valencia",
  //     status: "Activo",
  //     ticketsSold: 450,
  //     capacity: 500,
  //     revenue: 13500,
  //   },
  //   {
  //     id: 4,
  //     name: "Exposición de Arte",
  //     date: "2023-06-30",
  //     location: "Galería Central, Sevilla",
  //     status: "Finalizado",
  //     ticketsSold: 320,
  //     capacity: 400,
  //     revenue: 6400,
  //   },
  //   {
  //     id: 5,
  //     name: "Conferencia Tech",
  //     date: "2023-07-05",
  //     location: "Centro de Convenciones, Bilbao",
  //     status: "Activo",
  //     ticketsSold: 678,
  //     capacity: 800,
  //     revenue: 23730,
  //   },
  // ]

  const [events, setEvents] = useState([])
  const [stats, setStats] = useState({
    totalEvents: 0,
    activeEvents: 0,
    totalTicketsSold: 0,
    totalRevenue: 0,
  })

  
    useEffect(() => {
        const fetchEvents = async () => {
            try {
                /*const user = useAuthStore.getState().user;
                const userId = user?.id;*/
                const userId = 39;

                if (!userId) {
                    throw new Error("No se encontró el ID del organizador");
                }

                const data = await getEventsByOrganizer(userId);

                // Guardar eventos en estado
                setEvents(data);
                console.log(data);

                // Calcular estadísticas
                const total = data.length;
                const activos = data.filter(e => e.status === "Activo").length;
                const tickets = data.reduce((sum, e) => sum + (e.ticketsSold || 0), 0);
                const ingresos = data.reduce((sum, e) => sum + (e.price || 0), 0);

                setStats({
                    totalEvents: total,
                    activeEvents: activos,
                    totalTicketsSold: tickets,
                    totalRevenue: ingresos,
                });
            } catch (error) {
                showAlert({ type: "error", message: "No se pudieron cargar los eventos" });
            } finally {
                setIsLoading(false);
            }
        };

        fetchEvents();
    }, [])

    const upcomingEvents = events.filter((event) => event.status === "Confirmado" || event.status === "Pendiente").slice(0, 3)
    

    /*useEffect(() => {
        // Simulate loading data
        const timer = setTimeout(() => {
        setIsLoading(false)
        }, 1000)

        return () => clearTimeout(timer)
    }, [])*/

    const handleDeleteEvent = (id) => {
        showAlert({
        type: "info",
        message: "Evento eliminado correctamente",
        })
        // Logic to delete would go here
    }

    const filteredEvents = events.filter((event) => {
    const matchesSearch =
      event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.location.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesFilter = filterStatus === "all" || event.status === filterStatus

    return matchesSearch && matchesFilter
    })

  return (
    <>
      <Nav isAuthenticated={true} />
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
              <h2 className="text-xl font-bold text-[#2E1A47] mb-6">{t("eventManagerDash.panel")}</h2>

              <nav className="space-y-2">
                <button
                  onClick={() => setActiveTab("overview")}
                  className={`w-full flex items-center p-3 rounded-lg text-left transition-colors ${activeTab === "overview" ? "bg-[#F3F0FA] text-[#5C3D8D]" : "text-gray-600 hover:bg-gray-100"
                    }`}
                >
                  <BarChart3 className="h-5 w-5 mr-3" />
                  <span>{t("eventManagerDash.summary")}</span>
                </button>

                <button
                  onClick={() => setActiveTab("events")}
                  className={`w-full flex items-center p-3 rounded-lg text-left transition-colors ${activeTab === "events" ? "bg-[#F3F0FA] text-[#5C3D8D]" : "text-gray-600 hover:bg-gray-100"
                    }`}
                >
                  <Calendar className="h-5 w-5 mr-3" />
                  <span>{t("eventManagerDash.myEvents")}</span>
                </button>

                <button
                  onClick={() => setActiveTab("tickets")}
                  className={`w-full flex items-center p-3 rounded-lg text-left transition-colors ${activeTab === "tickets" ? "bg-[#F3F0FA] text-[#5C3D8D]" : "text-gray-600 hover:bg-gray-100"
                    }`}
                >
                  <Ticket className="h-5 w-5 mr-3" />
                  <span>{t("eventManagerDash.tickets")}</span>
                </button>

                <button
                  onClick={() => setActiveTab("attendees")}
                  className={`w-full flex items-center p-3 rounded-lg text-left transition-colors ${activeTab === "attendees" ? "bg-[#F3F0FA] text-[#5C3D8D]" : "text-gray-600 hover:bg-gray-100"
                    }`}
                >
                  <Users className="h-5 w-5 mr-3" />
                  <span>{t("eventManagerDash.attendees")}</span>
                </button>

                <button
                  onClick={() => setActiveTab("settings")}
                  className={`w-full flex items-center p-3 rounded-lg text-left transition-colors ${activeTab === "settings" ? "bg-[#F3F0FA] text-[#5C3D8D]" : "text-gray-600 hover:bg-gray-100"
                    }`}
                >
                  <Settings className="h-5 w-5 mr-3" />
                  <span>{t("eventManagerDash.configuration")}</span>
                </button>
              </nav>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <button
                  onClick={() => navigate('/eventCreation')}
                  className="w-full flex items-center justify-center p-3 bg-[#5C3D8D] text-white rounded-lg hover:bg-[#2E1A47] transition-colors"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  <span>{t("eventManagerDash.createEvent")}</span>
                </button>
              </div>
            </motion.div>

            {/* Main Content */}
            <motion.div
              className="flex-1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* Search Bar */}
              <div className="bg-white rounded-xl shadow-md p-4 mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder={t("eventManagerDash.searchEvent")}
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5C3D8D] focus:border-transparent"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

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
                          <p className="text-sm text-gray-500">{t("eventManagerDash.statsCards.totalEvents")}</p>
                          <h3 className="text-2xl font-bold text-[#2E1A47]">{stats.totalEvents}</h3>
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
                      transition={{ duration: 0.3, delay: 0.2 }}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-500">{t("eventManagerDash.statsCards.activatedEvents")}</p>
                          <h3 className="text-2xl font-bold text-[#2E1A47]">{stats.activeEvents}</h3>
                        </div>
                        <div className="p-3 bg-[#F3F0FA] rounded-full">
                          <Clock className="h-6 w-6 text-[#5C3D8D]" />
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
                          <p className="text-sm text-gray-500">{t("eventManagerDash.statsCards.sellTickets")}</p>
                          <h3 className="text-2xl font-bold text-[#2E1A47]">
                            {stats.totalTicketsSold.toLocaleString()}
                          </h3>
                        </div>
                        <div className="p-3 bg-[#F3F0FA] rounded-full">
                          <Ticket className="h-6 w-6 text-[#5C3D8D]" />
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
                          <p className="text-sm text-gray-500">{t("eventManagerDash.statsCards.totalIncome")}</p>
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

                  {/* Upcoming Events */}
                  <motion.div
                    className="bg-white rounded-xl shadow-md overflow-hidden"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.5 }}
                  >
                    <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                      <h3 className="text-lg font-semibold text-[#2E1A47]">{t("eventManagerDash.upcomingEvents.nextEvents")}</h3>
                      <button
                        onClick={() => navigate('/eventCreation')}
                        className="text-sm text-[#5C3D8D] hover:text-[#2E1A47] flex items-center"
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        <span>{t("eventManagerDash.upcomingEvents.createEvent")}</span>
                      </button>
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
                          upcomingEvents.map((event) => (
                            <div
                              key={event.id}
                              className="flex flex-col md:flex-row md:items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50"
                            >
                              <div className="flex items-center mb-3 md:mb-0">
                                <div className="w-16 h-16 rounded-lg bg-[#F3F0FA] flex items-center justify-center text-[#5C3D8D]">
                                  <Calendar className="h-8 w-8" />
                                </div>
                                <div className="ml-4">
                                  <h4 className="text-md font-medium text-[#2E1A47]">{event.name}</h4>
                                  <p className="text-sm text-gray-500">
                                    {event.date} | {event.location.name}
                                  </p>
                                  <div className="flex items-center mt-1">
                                    <span
                                      className={`text-xs px-2 py-0.5 rounded-full ${event.status === "Activo"
                                        ? "bg-green-100 text-green-800"
                                        : event.status === "Pendiente"
                                          ? "bg-yellow-100 text-yellow-800"
                                          : "bg-red-100 text-red-800"
                                        }`}
                                    >
                                      {event.status}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <div className="flex flex-col md:items-end">
                                <div className="flex items-center mb-2">
                                  <Ticket className="h-4 w-4 text-gray-500 mr-1" />
                                  <span className="text-sm text-gray-700">
                                    {event.ticketsSold} / {event.capacity} {t("eventManagerDash.upcomingEvents.tickets")}
                                  </span>
                                </div>
                                <div className="flex space-x-2">
                                  <button className="p-2 text-[#5C3D8D] hover:bg-[#F3F0FA] rounded-lg transition-colors">
                                    <Eye className="h-4 w-4" />
                                  </button>
                                  <button className="p-2 text-[#5C3D8D] hover:bg-[#F3F0FA] rounded-lg transition-colors">
                                    <Edit className="h-4 w-4" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>

                      <div className="mt-4 text-center">
                        <button
                          onClick={() => setActiveTab("events")}
                          className="text-sm text-[#5C3D8D] hover:text-[#2E1A47]"
                        >
                          {t("eventManagerDash.upcomingEvents.seeAllEvents")}
                        </button>
                      </div>
                    </div>
                  </motion.div>

                  {/* Sales Chart Placeholder */}
                  <motion.div
                    className="bg-white rounded-xl shadow-md overflow-hidden"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.6 }}
                  >
                    <div className="p-4 border-b border-gray-100">
                      <h3 className="text-lg font-semibold text-[#2E1A47]">{t("eventManagerDash.salesChart.recentSells")}</h3>
                    </div>
                    <div className="p-4">
                      <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                        <div className="text-center">
                          <BarChart3 className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                          <p className="text-gray-500">{t("eventManagerDash.salesChart.graph")}</p>
                          <p className="text-xs text-gray-400">{t("eventManagerDash.salesChart.lastDays")}</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              )}

              {activeTab === "events" && (
                <motion.div
                  className="bg-white rounded-xl shadow-md overflow-hidden"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-[#2E1A47]">{t("eventManagerDash.myEvents")}</h3>
                    <div className="flex items-center space-x-2">
                      <div className="relative">
                        <button className="flex items-center text-sm text-gray-600 hover:text-[#5C3D8D] p-2 border border-gray-200 rounded-lg">
                          <Filter className="h-4 w-4 mr-1" />
                          <span>{t("eventManagerDash.myEventsPage.filter")}</span>
                        </button>
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-10 hidden">
                          <div className="p-2">
                            <button
                              onClick={() => setFilterStatus("all")}
                              className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 rounded-lg"
                            >
                              {t("eventManagerDash.myEventsPage.all")}
                            </button>
                            <button
                              onClick={() => setFilterStatus("Activo")}
                              className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 rounded-lg"
                            >
                              {t("eventManagerDash.myEventsPage.active")}
                            </button>
                            <button
                              onClick={() => setFilterStatus("Pendiente")}
                              className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 rounded-lg"
                            >
                              {t("eventManagerDash.myEventsPage.pending")}
                            </button>
                            <button
                              onClick={() => setFilterStatus("Finalizado")}
                              className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 rounded-lg"
                            >
                              {t("eventManagerDash.myEventsPage.completed")}
                            </button>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => navigate('/eventCreation')}
                        className="flex items-center text-sm text-white bg-[#5C3D8D] hover:bg-[#2E1A47] p-2 rounded-lg"
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        <span>{t("eventManagerDash.myEventsPage.create")}</span>
                      </button>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="space-y-4">
                      {filteredEvents.length > 0 ? (
                        filteredEvents.map((event) => (
                          <div
                            key={event.id}
                            className="flex flex-col md:flex-row md:items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50"
                          >
                            <div className="flex items-center mb-3 md:mb-0">
                              <div className="w-16 h-16 rounded-lg bg-[#F3F0FA] flex items-center justify-center text-[#5C3D8D]">
                                <Calendar className="h-8 w-8" />
                              </div>
                              <div className="ml-4">
                                <h4 className="text-md font-medium text-[#2E1A47]">{event.name}</h4>
                                <p className="text-sm text-gray-500">
                                  {event.date} | {event.location.name}
                                </p>
                                <div className="flex items-center mt-1">
                                  <span
                                    className={`text-xs px-2 py-0.5 rounded-full ${event.status === "Activo"
                                      ? "bg-green-100 text-green-800"
                                      : event.status === "Pendiente"
                                        ? "bg-yellow-100 text-yellow-800"
                                        : "bg-red-100 text-red-800"
                                      }`}
                                  >
                                    {event.status}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="flex flex-col md:items-end">
                              <div className="flex items-center mb-2">
                                <Ticket className="h-4 w-4 text-gray-500 mr-1" />
                                <span className="text-sm text-gray-700">
                                  {event.ticketsSold} / {event.capacity} {t("eventManagerDash.upcomingEvents.tickets")}
                                </span>
                              </div>
                              <div className="flex items-center mb-2">
                                <DollarSign className="h-4 w-4 text-gray-500 mr-1" />
                                <span className="text-sm text-gray-700">€{event.price}</span>
                              </div>
                              <div className="flex space-x-2">
                                <button className="p-2 text-[#5C3D8D] hover:bg-[#F3F0FA] rounded-lg transition-colors">
                                  <Eye className="h-4 w-4" />
                                </button>
                                <button className="p-2 text-[#5C3D8D] hover:bg-[#F3F0FA] rounded-lg transition-colors">
                                  <Edit className="h-4 w-4" />
                                </button>
                                <button
                                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                  onClick={() => handleDeleteEvent(event.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-8">
                          <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                          <h3 className="text-lg font-medium text-[#2E1A47] mb-1">{t("eventManagerDash.myEventsPage.noEvents")}</h3>
                          <p className="text-gray-500 mb-4">{t("eventManagerDash.myEventsPage.noFindEvents")}</p>
                          <button
                            onClick={() => navigate('/eventCreation')}
                            className="inline-flex items-center px-4 py-2 bg-[#5C3D8D] text-white rounded-lg hover:bg-[#2E1A47] transition-colors"
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            <span>{t("eventManagerDash.myEventsPage.createEvent")}</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === "tickets" && (
                <motion.div
                  className="bg-white rounded-xl shadow-md overflow-hidden"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="p-4 border-b border-gray-100">
                    <h3 className="text-lg font-semibold text-[#2E1A47]">{t("eventManagerDash.myEventsPage.filter")}</h3>
                  </div>
                  <div className="p-4">
                    <div className="text-center py-8">
                      <Ticket className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-[#2E1A47] mb-1">{t("eventManagerDash.ticketManagement.title")}</h3>
                      <p className="text-gray-500 mb-4">{t("eventManagerDash.ticketManagement.selectEvent")}</p>
                      <button
                        onClick={() => setActiveTab("events")}
                        className="inline-flex items-center px-4 py-2 bg-[#5C3D8D] text-white rounded-lg hover:bg-[#2E1A47] transition-colors"
                      >
                        <Calendar className="h-4 w-4 mr-2" />
                        <span>{t("eventManagerDash.ticketManagement.seeEvent")}</span>
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === "attendees" && (
                <motion.div
                  className="bg-white rounded-xl shadow-md overflow-hidden"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="p-4 border-b border-gray-100">
                    <h3 className="text-lg font-semibold text-[#2E1A47]">{t("eventManagerDash.attendeesPage.title")}</h3>
                  </div>
                  <div className="p-4">
                    <div className="text-center py-8">
                      <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-[#2E1A47] mb-1">{t("eventManagerDash.attendeesPage.title")}</h3>
                      <p className="text-gray-500 mb-4">{t("eventManagerDash.attendeesPage.selectEvent")}</p>
                      <button
                        onClick={() => setActiveTab("events")}
                        className="inline-flex items-center px-4 py-2 bg-[#5C3D8D] text-white rounded-lg hover:bg-[#2E1A47] transition-colors"
                      >
                        <Calendar className="h-4 w-4 mr-2" />
                        <span>{t("eventManagerDash.attendeesPage.seeEvent")}</span>
                      </button>
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
                    <h3 className="text-lg font-semibold text-[#2E1A47]">{t("eventManagerDash.settingsPage.title")}</h3>
                  </div>
                  <div className="p-6">
                    <div className="space-y-6">
                      <div>
                        <h4 className="text-md font-medium text-[#2E1A47] mb-4">{t("eventManagerDash.settingsPage.infoOrganization.title")}</h4>
                        <div className="space-y-4">
                          <div>
                            <label htmlFor="org-name" className="block text-sm font-medium text-gray-700 mb-1">
                              {t("eventManagerDash.settingsPage.infoOrganization.name")}
                            </label>
                            <input
                              type="text"
                              id="org-name"
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5C3D8D] focus:border-transparent"
                              defaultValue="Eventos Madrid"
                            />
                          </div>

                          <div>
                            <label htmlFor="org-email" className="block text-sm font-medium text-gray-700 mb-1">
                              {t("eventManagerDash.settingsPage.infoOrganization.email")}
                            </label>
                            <input
                              type="email"
                              id="org-email"
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5C3D8D] focus:border-transparent"
                              defaultValue="contacto@eventosmadrid.com"
                            />
                          </div>

                          <div>
                            <label htmlFor="org-phone" className="block text-sm font-medium text-gray-700 mb-1">
                              {t("eventManagerDash.settingsPage.infoOrganization.phone")}
                            </label>
                            <input
                              type="tel"
                              id="org-phone"
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5C3D8D] focus:border-transparent"
                              defaultValue="+34 912 345 678"
                            />
                          </div>

                          <div>
                            <label htmlFor="org-website" className="block text-sm font-medium text-gray-700 mb-1">
                              {t("eventManagerDash.settingsPage.infoOrganization.web")}
                            </label>
                            <input
                              type="url"
                              id="org-website"
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5C3D8D] focus:border-transparent"
                              defaultValue="https://www.eventosmadrid.com"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-gray-200">
                        <h4 className="text-md font-medium text-[#2E1A47] mb-4">{t("eventManagerDash.settingsPage.notificationPreference.title")}</h4>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm text-gray-700">{t("eventManagerDash.settingsPage.notificationPreference.email")}</p>
                              <p className="text-xs text-gray-500">{t("eventManagerDash.settingsPage.notificationPreference.receiveEmail")}</p>
                            </div>
                            <div className="relative inline-block w-12 h-6 rounded-full bg-[#5C3D8D]">
                              <input type="checkbox" id="email-notifications" className="sr-only" checked readOnly />
                              <span className="absolute left-7 top-1 w-4 h-4 rounded-full bg-white transition-transform"></span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm text-gray-700">{t("eventManagerDash.settingsPage.notificationPreference.sells")}</p>
                              <p className="text-xs text-gray-500">{t("eventManagerDash.settingsPage.notificationPreference.receiveNewAlert")}</p>
                            </div>
                            <div className="relative inline-block w-12 h-6 rounded-full bg-[#5C3D8D]">
                              <input type="checkbox" id="sales-notifications" className="sr-only" checked readOnly />
                              <span className="absolute left-7 top-1 w-4 h-4 rounded-full bg-white transition-transform"></span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm text-gray-700">{t("eventManagerDash.settingsPage.notificationPreference.summary")}</p>
                              <p className="text-xs text-gray-500">{t("eventManagerDash.settingsPage.notificationPreference.receiveSummary")}</p>
                            </div>
                            <div className="relative inline-block w-12 h-6 rounded-full bg-gray-200">
                              <input type="checkbox" id="weekly-summary" className="sr-only" />
                              <span className="absolute left-1 top-1 w-4 h-4 rounded-full bg-white transition-transform"></span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-gray-200">
                        <button
                          className="px-4 py-2 bg-[#5C3D8D] text-white rounded-lg hover:bg-[#2E1A47] transition-colors"
                          onClick={() =>
                            showAlert({ type: "success", message: t("eventManagerDash.settingsPage.confirmation")})
                          }
                        >
                          {t("eventManagerDash.settingsPage.saveChanges")}
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

export default EventManagerDashboard