"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
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
} from "lucide-react";
import Nav from "../components/Navbar";
import Footer from "../components/Footer";
import useAlert from "../hooks/useAlert";
import Alert from "../components/Alert";
import { useAuthStore } from "../store/authStore";
import { useTranslation } from "react-i18next";
import {
  deleteEvent,
  getEventsOrganizedByUser,
} from "../services/eventService";

const EventManagerDashboard = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { alert, showAlert, hideAlert } = useAlert();
  const [activeTab, setActiveTab] = useState("overview");
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const [events, setEvents] = useState([]);
  const [stats, setStats] = useState({
    totalEvents: events.length,
    activeEvents: 0,
    totalTicketsSold: 0,
    totalRevenue: 0,
  });

  const getEventStatus = (event) => {
    const now = new Date();
    const start = new Date(event.startDate);
    const end = event.endDate ? new Date(event.endDate) : null;

    if (now < start) return "Pendiente";
    if (end && now > end) return "Finalizado";
    return "Activo";
  };

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const userId = useAuthStore.getState().userId;

        if (!userId) {
          throw new Error("No se encontró el ID del organizador");
        }

        const data = await getEventsOrganizedByUser(userId);

        setEvents(data);

        const now = new Date();
        const total = data.length;

        const activos = data.filter((e) => new Date(e.startDate) > now).length;

        let ticketsVendidos = 0;
        let ingresos = 0;

        data.forEach((event) => {
          const eventTickets = event.tickets || [];

          ticketsVendidos += eventTickets.length;

          eventTickets.forEach((ticket) => {
            const precio = parseFloat(ticket.price);
            if (!isNaN(precio)) {
              ingresos += precio * 0.9;
            }
          });
        });

        setStats({
          totalEvents: total,
          activeEvents: activos,
          totalTicketsSold: ticketsVendidos,
          totalRevenue: ingresos,
        });
      } catch (error) {
        showAlert({
          type: "error",
          message: "No se pudieron cargar los eventos",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const now = new Date();

  const upcomingEvents = events
    .filter((event) => new Date(event.startDate) > now)
    .sort((a, b) => new Date(a.startDate) - new Date(b.startDate))
    .slice(0, 3);

  const handleDeleteEvent = async (id) => {
    try {
      await deleteEvent(id);
      setEvents((prev) => prev.filter((event) => event.id !== id));
      showAlert({
        type: "success",
        message: "Evento eliminado correctamente",
      });
    } catch (error) {
      showAlert({
        type: "error",
        message: "Error al eliminar el evento",
      });
      console.error(error);
    }
    // Logic to delete would go here
  };

  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.location.name.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter =
      filterStatus === "all" || event.status === filterStatus;

    return matchesSearch && matchesFilter;
  });

  const currentEvents = filteredEvents.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredEvents.length / itemsPerPage);

  return (
    <>
      <Nav isAuthenticated={true} />
      <Alert
        type={alert.type}
        message={alert.message}
        isVisible={alert.isVisible}
        onClose={hideAlert}
      />

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
              <h2 className="text-xl font-bold text-[#2E1A47] mb-6">
                {t("eventManagerDash.panel")}
              </h2>

              <nav className="space-y-2">
                <button
                  onClick={() => setActiveTab("overview")}
                  className={`w-full flex items-center p-3 rounded-lg text-left transition-colors ${
                    activeTab === "overview"
                      ? "bg-[#F3F0FA] text-[#5C3D8D]"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <BarChart3 className="h-5 w-5 mr-3" />
                  <span>{t("eventManagerDash.summary")}</span>
                </button>

                <button
                  onClick={() => setActiveTab("events")}
                  className={`w-full flex items-center p-3 rounded-lg text-left transition-colors ${
                    activeTab === "events"
                      ? "bg-[#F3F0FA] text-[#5C3D8D]"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <Calendar className="h-5 w-5 mr-3" />
                  <span>{t("eventManagerDash.myEvents")}</span>
                </button>

                <button
                  onClick={() => setActiveTab("tickets")}
                  className={`w-full flex items-center p-3 rounded-lg text-left transition-colors ${
                    activeTab === "tickets"
                      ? "bg-[#F3F0FA] text-[#5C3D8D]"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <Ticket className="h-5 w-5 mr-3" />
                  <span>{t("eventManagerDash.tickets")}</span>
                </button>

                <button
                  onClick={() => setActiveTab("attendees")}
                  className={`w-full flex items-center p-3 rounded-lg text-left transition-colors ${
                    activeTab === "attendees"
                      ? "bg-[#F3F0FA] text-[#5C3D8D]"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <Users className="h-5 w-5 mr-3" />
                  <span>{t("eventManagerDash.attendees")}</span>
                </button>

                <button
                  onClick={() => setActiveTab("settings")}
                  className={`w-full flex items-center p-3 rounded-lg text-left transition-colors ${
                    activeTab === "settings"
                      ? "bg-[#F3F0FA] text-[#5C3D8D]"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <Settings className="h-5 w-5 mr-3" />
                  <span>{t("eventManagerDash.configuration")}</span>
                </button>
              </nav>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <button
                  onClick={() => navigate("/eventCreation")}
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
                          <p className="text-sm text-gray-500">
                            {t("eventManagerDash.statsCards.totalEvents")}
                          </p>
                          <h3 className="text-2xl font-bold text-[#2E1A47]">
                            {stats.totalEvents}
                          </h3>
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
                          <p className="text-sm text-gray-500">
                            {t("eventManagerDash.statsCards.activatedEvents")}
                          </p>
                          <h3 className="text-2xl font-bold text-[#2E1A47]">
                            {stats.activeEvents}
                          </h3>
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
                          <p className="text-sm text-gray-500">
                            {t("eventManagerDash.statsCards.sellTickets")}
                          </p>
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
                          <p className="text-sm text-gray-500">
                            {t("eventManagerDash.statsCards.totalIncome")}
                          </p>
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
                      <h3 className="text-lg font-semibold text-[#2E1A47]">
                        {t("eventManagerDash.upcomingEvents.nextEvents")}
                      </h3>
                      <button
                        onClick={() => navigate("/eventCreation")}
                        className="text-sm text-[#5C3D8D] hover:text-[#2E1A47] flex items-center"
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        <span>
                          {t("eventManagerDash.upcomingEvents.createEvent")}
                        </span>
                      </button>
                    </div>
                    <div className="p-4">
                      <div className="space-y-4">
                        {isLoading ? (
                          <div className="animate-pulse space-y-3">
                            {[...Array(3)].map((_, i) => (
                              <div
                                key={i}
                                className="flex items-center space-x-4"
                              >
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
                                <div className="ml-4 text-sm text-gray-700 space-y-1">
                                  <h4 className="text-md font-medium text-[#2E1A47]">
                                    {event.name}
                                  </h4>
                                  <p className="text-sm text-gray-500">
                                    {event.startDate} – {event.endDate} |{" "}
                                    {event.location?.name}
                                  </p>
                                  <div className="flex items-center mt-1">
                                    <span
                                      className={`text-xs px-2 py-0.5 rounded-full ${
                                        new Date() < new Date(event.startDate)
                                          ? "bg-yellow-100 text-yellow-800" // Pendiente (aún no empieza)
                                          : new Date() >=
                                              new Date(event.startDate) &&
                                            new Date() <=
                                              new Date(event.endDate)
                                          ? "bg-green-100 text-green-800" // Activo (en curso)
                                          : "bg-red-100 text-red-800" // Finalizado o pasado
                                      }`}
                                    >
                                      {new Date() < new Date(event.startDate)
                                        ? "Pendiente"
                                        : new Date() >=
                                            new Date(event.startDate) &&
                                          new Date() <= new Date(event.endDate)
                                        ? "Activo"
                                        : "Finalizado"}
                                    </span>
                                  </div>

                                  <p>
                                    <strong>Categoría:</strong> {event.category}
                                  </p>
                                  <p>
                                    <strong>Capacidad:</strong> {event.capacity}
                                  </p>
                                  <p>
                                    <strong>Edad mínima:</strong> {event.minAge}
                                  </p>
                                  <p>
                                    <strong>Organizador:</strong>{" "}
                                    {event.organizer}
                                  </p>
                                  <p>
                                    <strong>Sitio web:</strong>{" "}
                                    <a
                                      href={event.website}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="text-blue-600 underline"
                                    >
                                      {event.website}
                                    </a>
                                  </p>
                                  <p>
                                    <strong>Descripción corta:</strong>{" "}
                                    {event.description}
                                  </p>
                                  <p>
                                    <strong>Descripción larga:</strong>{" "}
                                    {event.longDescription}
                                  </p>
                                </div>
                              </div>

                              <div className="flex flex-col md:items-end">
                                <div className="flex items-center mb-2">
                                  <Ticket className="h-4 w-4 text-gray-500 mr-1" />
                                  <span className="text-sm text-gray-700">
                                    {event.tickets.length} / {event.capacity}{" "}
                                    {t(
                                      "eventManagerDash.upcomingEvents.tickets"
                                    )}
                                  </span>
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
                    <h3 className="text-lg font-semibold text-[#2E1A47]">
                      {t("eventManagerDash.myEvents")}
                    </h3>
                    <div className="flex items-center space-x-2">
                      <div className="relative">
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
                        onClick={() => navigate("/eventCreation")}
                        className="flex items-center text-sm text-white bg-[#5C3D8D] hover:bg-[#2E1A47] p-2 rounded-lg"
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        <span>{t("eventManagerDash.myEventsPage.create")}</span>
                      </button>
                    </div>
                  </div>
                  <div className="space-y-4">
                    {currentEvents.length > 0 ? (
                      <>
                        {currentEvents.map((event) => (
                          <div
                            key={event.id}
                            className="flex flex-col md:flex-row md:items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50"
                          >
                            <div className="flex items-center mb-3 md:mb-0">
                              <div className="w-16 h-16 rounded-lg bg-[#F3F0FA] flex items-center justify-center text-[#5C3D8D]">
                                <Calendar className="h-8 w-8" />
                              </div>
                              <div className="ml-4">
                                <h4 className="text-md font-medium text-[#2E1A47]">
                                  {event.name}
                                </h4>
                                <p className="text-sm text-gray-500">
                                  {event.startDate} | {event.location.name}
                                </p>
                                <div className="flex items-center mt-1">
                                  <span
                                    className={`text-xs px-2 py-0.5 rounded-full ${
                                      new Date() < new Date(event.startDate)
                                        ? "bg-yellow-100 text-yellow-800" // Pendiente (aún no empieza)
                                        : new Date() >=
                                            new Date(event.startDate) &&
                                          new Date() <= new Date(event.endDate)
                                        ? "bg-green-100 text-green-800" // Activo (en curso)
                                        : "bg-red-100 text-red-800" // Finalizado o pasado
                                    }`}
                                  >
                                    {new Date() < new Date(event.startDate)
                                      ? "Pendiente"
                                      : new Date() >=
                                          new Date(event.startDate) &&
                                        new Date() <= new Date(event.endDate)
                                      ? "Activo"
                                      : "Finalizado"}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="flex flex-col md:items-end">
                              <div className="flex items-center mb-2">
                                <Ticket className="h-4 w-4 text-gray-500 mr-1" />
                                <span className="text-sm text-gray-700">
                                  {event.tickets.length} / {event.capacity}{" "}
                                  {t("eventManagerDash.upcomingEvents.tickets")}
                                </span>
                              </div>
                              <div className="flex items-center mb-2">
                                <DollarSign className="h-4 w-4 text-gray-500 mr-1" />
                                <span className="text-sm text-gray-700">
                                  {event.tickets.length > 0 ? (
                                    <>
                                      €
                                      {Math.min(
                                        ...event.tickets.map((t) => t.price)
                                      )}{" "}
                                      - €
                                      {Math.max(
                                        ...event.tickets.map((t) => t.price)
                                      )}
                                    </>
                                  ) : (
                                    "No tickets"
                                  )}
                                </span>
                              </div>

                              <div className="flex space-x-2">
                                <button
                                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                  onClick={() => handleDeleteEvent(event.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}

                        {/* ✅ Paginación */}
                        <div className="flex justify-center mt-6 space-x-2">
                          {Array.from({ length: totalPages }, (_, index) => (
                            <button
                              key={index}
                              onClick={() => setCurrentPage(index + 1)}
                              className={`px-3 py-1 rounded-md border ${
                                currentPage === index + 1
                                  ? "bg-[#5C3D8D] text-white border-[#5C3D8D]"
                                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                              }`}
                            >
                              {index + 1}
                            </button>
                          ))}
                        </div>
                      </>
                    ) : (
                      <div className="text-center py-8">
                        <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-[#2E1A47] mb-1">
                          {t("eventManagerDash.myEventsPage.noEvents")}
                        </h3>
                        <p className="text-gray-500 mb-4">
                          {t("eventManagerDash.myEventsPage.noFindEvents")}
                        </p>
                        <button
                          onClick={() => navigate("/eventCreation")}
                          className="inline-flex items-center px-4 py-2 bg-[#5C3D8D] text-white rounded-lg hover:bg-[#2E1A47] transition-colors"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          <span>
                            {t("eventManagerDash.myEventsPage.createEvent")}
                          </span>
                        </button>
                      </div>
                    )}
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
                    <h3 className="text-lg font-semibold text-[#2E1A47]">
                      {t("eventManagerDash.ticketManagement.title")}
                    </h3>
                  </div>
                  <div className="p-4 space-y-6">
                    {events.filter((event) => event.tickets?.length > 0)
                      .length > 0 ? (
                      events
                        .filter((event) => event.tickets?.length > 0)
                        .map((event) => {
                          // Agrupar entradas únicas por nombre
                          const uniqueTicketsMap = new Map();

                          event.tickets.forEach((ticket) => {
                            if (!uniqueTicketsMap.has(ticket.name)) {
                              uniqueTicketsMap.set(ticket.name, ticket);
                            } else {
                              const existing = uniqueTicketsMap.get(
                                ticket.name
                              );
                              if (ticket.price < existing.price) {
                                uniqueTicketsMap.set(ticket.name, ticket);
                              }
                            }
                          });

                          const uniqueTickets = Array.from(
                            uniqueTicketsMap.values()
                          );

                          return (
                            <div
                              key={event.id}
                              className="border rounded-lg p-4"
                            >
                              <h4 className="text-[#2E1A47] font-semibold text-md mb-2">
                                {event.name}
                              </h4>
                              <ul className="space-y-2">
                                {uniqueTickets.map((ticket) => (
                                  <li
                                    key={ticket.id}
                                    className="flex justify-between items-center"
                                  >
                                    <span className="text-gray-700">
                                      {ticket.name}
                                    </span>
                                    <span className="text-sm text-gray-500">
                                      €{ticket.price}
                                    </span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          );
                        })
                    ) : (
                      <div className="text-center py-8">
                        <Ticket className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-[#2E1A47] mb-1">
                          {t("eventManagerDash.ticketManagement.noTickets")}
                        </h3>
                        <p className="text-gray-500 mb-4">
                          {t("eventManagerDash.ticketManagement.selectEvent")}
                        </p>
                        <button
                          onClick={() => setActiveTab("events")}
                          className="inline-flex items-center px-4 py-2 bg-[#5C3D8D] text-white rounded-lg hover:bg-[#2E1A47] transition-colors"
                        >
                          <Calendar className="h-4 w-4 mr-2" />
                          <span>
                            {t("eventManagerDash.ticketManagement.seeEvent")}
                          </span>
                        </button>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {(activeTab === "attendees" || activeTab === "settings") && (
                <motion.div
                  className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col items-center justify-center py-20"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="text-center">
                    <h3 className="text-2xl font-semibold text-[#2E1A47] mb-2">
                      {activeTab === "attendees"
                        ? "Asistentes"
                        : "Configuración"}
                    </h3>
                    <p className="text-gray-500 mb-4">
                      ¡Esta sección estará disponible pronto!
                    </p>
                    <div className="text-5xl">🚧</div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default EventManagerDashboard;
