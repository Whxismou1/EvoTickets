"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Users,
  Calendar,
  BarChart3,
  Settings,
  Search,
  User,
  DollarSign,
} from "lucide-react";

import Nav from "../components/Navbar";
import Footer from "../components/Footer";
import { useAlert } from "../context/AlertContext";
import { deleteAccount, getAllUsers } from "../services/userService";
import { getAllEvents } from "../services/eventService";
import { useAuthStore } from "../store/authStore";
import { Button } from "@heroui/button";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const { userId } = useAuthStore();
  const { success, error, confirmDelete } = useAlert();
  const [activeTab, setActiveTab] = useState("overview");
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState([]);
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();

  const stats = {
    totalUsers: users.length,
    totalEvents: events.length,
    totalSales: 256789.5,
    pendingApprovals: 24,
  };

  function formatEventDateRange(start, end) {
    if (!start || !end) return "Fecha no disponible";

    const startDate = new Date(start);
    const endDate = new Date(end);

    const sameMonth = startDate.getMonth() === endDate.getMonth();
    const sameYear = startDate.getFullYear() === endDate.getFullYear();

    const optionsDay = { day: "2-digit" };
    const optionsMonthYear = { month: "short", year: "numeric" };

    if (sameMonth && sameYear) {
      return `${startDate.getDate()}–${endDate.getDate()} ${startDate.toLocaleDateString(
        "en-US",
        optionsMonthYear
      )}`;
    } else {
      return `${startDate.toLocaleDateString("en-US", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })} – ${endDate.toLocaleDateString("en-US", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })}`;
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      const users = await getAllUsers();
      setUsers(users);

      const events = await getAllEvents();
      setEvents(events);
      console.log(events);

      setIsLoading(false);
    };

    fetchData();
  }, []);

  const handleDelete = async (id, fullName) => {
    const confirmed = await confirmDelete(
      `¿Estás seguro de que quieres eliminar la cuenta de ${fullName}? Esta acción no se puede deshacer.`
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteAccount(id);
      success("Cuenta eliminada correctamente");
      setUsers((prev) => prev.filter((user) => user.id !== id));
    } catch (err) {
      error(err.message || "Error al eliminar la cuenta");
    }
  };

  const filteredUsers = users
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .filter(
      (user) =>
        user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .slice(0, 5);

  const today = new Date();

  const filteredEvents = events
    .filter(
      (event) =>
        event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.organizer.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .map((event) => {
      const startDate = event.startDate ? new Date(event.startDate) : null;
      const endDate = event.endDate ? new Date(event.endDate) : null;

      let status = "Pendiente";
      if (startDate && endDate) {
        status = endDate < today ? "Inactivo" : "Activo";
      }

      return { ...event, status };
    })
    .sort((a, b) => {
      const dateA = a.startDate
        ? new Date(a.startDate)
        : new Date(8640000000000000);
      const dateB = b.startDate
        ? new Date(b.startDate)
        : new Date(8640000000000000);
      return dateA - dateB;
    })
    .splice(0, 5);

  return (
    <>
      <Nav isAuthenticated={true} />

      <div className="min-h-screen bg-gray-50 mt-16 ">
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
                Panel de Administración
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
                  <span>Resumen</span>
                </button>

                <button
                  onClick={() => setActiveTab("users")}
                  className={`w-full flex items-center p-3 rounded-lg text-left transition-colors ${
                    activeTab === "users"
                      ? "bg-[#F3F0FA] text-[#5C3D8D]"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <Users className="h-5 w-5 mr-3" />
                  <span>Usuarios</span>
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
                  <span>Eventos</span>
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
              {/* Search Bar */}
              <div className="bg-white rounded-xl shadow-md p-4 mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Buscar usuarios, eventos, artistas..."
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
                            Total Usuarios
                          </p>
                          <h3 className="text-2xl font-bold text-[#2E1A47]">
                            {stats.totalUsers.toLocaleString()}
                          </h3>
                        </div>
                        <div className="p-3 bg-[#F3F0FA] rounded-full">
                          <User className="h-6 w-6 text-[#5C3D8D]" />
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
                          <p className="text-sm text-gray-500">Total Eventos</p>
                          <h3 className="text-2xl font-bold text-[#2E1A47]">
                            {stats.totalEvents.toLocaleString()}
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
                      transition={{ duration: 0.3, delay: 0.3 }}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-500">
                            Ventas Totales
                          </p>
                          <h3 className="text-2xl font-bold text-[#2E1A47]">
                            €
                            {stats.totalSales.toLocaleString(undefined, {
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

                  {/* Recent Activity */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <motion.div
                      className="bg-white rounded-xl shadow-md overflow-hidden"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.5 }}
                    >
                      <div className="p-4 border-b border-gray-100">
                        <h3 className="text-lg font-semibold text-[#2E1A47]">
                          Usuarios Recientes
                        </h3>
                      </div>
                      <div className="p-4">
                        <div className="space-y-4">
                          {isLoading ? (
                            <div className="animate-pulse space-y-3">
                              {[...Array(5)].map((_, i) => (
                                <div
                                  key={i}
                                  className="flex items-center space-x-4"
                                >
                                  <div className="rounded-full bg-gray-200 h-10 w-10"></div>
                                  <div className="flex-1 space-y-2">
                                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            filteredUsers.map((user) => (
                              <div
                                key={user.id}
                                className="flex items-center justify-between"
                              >
                                <div className="flex items-center">
                                  <div className="w-10 h-10 rounded-full bg-[#F3F0FA] flex items-center justify-center text-[#5C3D8D] font-medium">
                                    {user.pfp ? (
                                      <img
                                        src={user.pfp || "/placeholder.svg"}
                                        alt="Profile"
                                        className="w-full h-full object-cover rounded-full"
                                      />
                                    ) : (
                                      <User className="w-5 h-5 text-[#5C3D8D]" />
                                    )}
                                  </div>
                                  <div className="ml-3">
                                    <p className="text-sm font-medium text-[#2E1A47]">
                                      {user.fullName}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                      {user.email}
                                    </p>
                                  </div>
                                </div>
                                <div>
                                  <span
                                    className={`text-xs px-2 py-1 rounded-full ${
                                      user.role === "CLIENT"
                                        ? "bg-blue-100 text-blue-800"
                                        : user.role === "EVENT_MANAGER"
                                        ? "bg-purple-100 text-purple-800"
                                        : user.role === "ADMIN"
                                        ? "bg-red-100 text-red-800"
                                        : user.role === "ARTIST"
                                        ? "bg-yellow-100 text-yellow-800"
                                        : "bg-gray-200 text-gray-700"
                                    }`}
                                  >
                                    {user.role}
                                  </span>
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    </motion.div>

                    <motion.div
                      className="bg-white rounded-xl shadow-md overflow-hidden"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.6 }}
                    >
                      <div className="p-4 border-b border-gray-100">
                        <h3 className="text-lg font-semibold text-[#2E1A47]">
                          Próximos Eventos
                        </h3>
                      </div>
                      <div className="p-4">
                        <div className="space-y-4">
                          {isLoading ? (
                            <div className="animate-pulse space-y-3">
                              {[...Array(5)].map((_, i) => (
                                <div
                                  key={i}
                                  className="flex items-center space-x-4"
                                >
                                  <div className="rounded-lg bg-gray-200 h-10 w-10"></div>
                                  <div className="flex-1 space-y-2">
                                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            filteredEvents.map((event) => (
                              <div
                                key={event.id}
                                className="flex items-center justify-between"
                              >
                                <div className="flex items-center">
                                  <div className="w-10 h-10 rounded-lg bg-[#F3F0FA] flex items-center justify-center text-[#5C3D8D]">
                                    <Calendar className="h-5 w-5" />
                                  </div>
                                  <div className="ml-3">
                                    <p className="text-sm font-medium text-[#2E1A47]">
                                      {event.name}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                      {event.organizer}
                                    </p>
                                  </div>
                                </div>
                                <div>
                                  <span
                                    className={`text-xs px-2 py-1 rounded-full ${
                                      event.status === "Activo"
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
                            ))
                          )}
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </div>
              )}

              {activeTab === "users" && (
                <motion.div
                  className="bg-white rounded-xl shadow-md overflow-hidden"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="p-4 border-b border-gray-100">
                    <h3 className="text-lg font-semibold text-[#2E1A47]">
                      Gestión de Usuarios
                    </h3>
                  </div>
                  <div className="p-4">
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Nombre
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Email
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Tipo
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Fecha de Registro
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Acciones
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {users.map((user) => (
                            <tr key={user.id}>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  {user.pfp ? (
                                    <img
                                      className="h-10 w-10 rounded-full object-cover"
                                      src={user.pfp || "/placeholder.svg"}
                                      alt={user.fullName || "Usuario"}
                                    />
                                  ) : (
                                    <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                                      <User className="h-5 w-5 text-gray-500" />
                                    </div>
                                  )}

                                  <div className="ml-4">
                                    <div className="text-sm font-medium text-gray-900">
                                      {user.fullName}
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-500">
                                  {user.email}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span
                                  className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                    user.role === "CLIENT"
                                      ? "bg-blue-100 text-blue-800"
                                      : user.role === "EVENT_MANAGER"
                                      ? "bg-purple-100 text-purple-800"
                                      : user.role === "ADMIN"
                                      ? "bg-red-100 text-red-800"
                                      : user.role === "ARTIST"
                                      ? "bg-yellow-100 text-yellow-800"
                                      : "bg-gray-200 text-gray-700"
                                  }`}
                                >
                                  {user.role}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {new Date(user.createdAt).toLocaleDateString(
                                  "en-CA"
                                )}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                {user.role === "CLIENT" &&
                                user.id !== userId ? (
                                  <button
                                    className="text-red-600 hover:text-red-900"
                                    onClick={() =>
                                      handleDelete(user.id, user.fullName)
                                    }
                                  >
                                    Eliminar
                                  </button>
                                ) : (
                                  <span className="text-gray-400 cursor-not-allowed">
                                    No permitido
                                  </span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === "events" && (
                <motion.div
                  className="bg-white rounded-xl shadow-md overflow-hidden"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="p-4 border-b border-gray-100">
                    <h3 className="text-lg font-semibold text-[#2E1A47]">
                      Gestión de Eventos
                    </h3>
                  </div>
                  <div className="p-4">
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Evento
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Organizador
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Estado
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Fecha
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Acciones
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {filteredEvents.map((event) => (
                            <tr key={event.id}>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <div className="flex-shrink-0 h-10 w-10 rounded-lg bg-[#F3F0FA] flex items-center justify-center text-[#5C3D8D]">
                                    <Calendar className="h-5 w-5" />
                                  </div>
                                  <div className="ml-4">
                                    <div className="text-sm font-medium text-gray-900">
                                      {event.name}
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-500">
                                  {event.organizer}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span
                                  className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                    event.status === "Activo"
                                      ? "bg-green-100 text-green-800"
                                      : event.status === "Pendiente"
                                      ? "bg-yellow-100 text-yellow-800"
                                      : "bg-red-100 text-red-800"
                                  }`}
                                >
                                  {event.status}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {formatEventDateRange(
                                  event.startDate,
                                  event.endDate
                                )}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <Button onPress={() => navigate(`/events/${event.id}`)} className="text-[#5C3D8D] hover:text-[#2E1A47] mr-3">
                                  Ver
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === "settings" && (
                <motion.div
                  className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col items-center justify-center py-20"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="text-center">
                    <h3 className="text-2xl font-semibold text-[#2E1A47] mb-2">
                      Configuración
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

export default AdminDashboard;
