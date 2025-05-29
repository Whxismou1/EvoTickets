"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Button } from "@heroui/button";
import {
  User,
  Ticket,
  Settings,
  Bell,
  Heart,
  Camera,
  LogOut,
  Users,
} from "lucide-react";
import Nav from "../components/Navbar";
import Footer from "../components/Footer";
import EventCard from "../components/EventCard";
import { useTranslation } from "react-i18next";
import {
  getUserById,
  updateUserProfile,
  uploadProfilePicture,
  changeUserPassword,
  deleteAccount,
  getUserTickets,
} from "../services/userService";

import { getEventById } from "../services/eventService";
import { getAllArtists } from "../services/artistService";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { useAlert } from "../context/AlertContext";

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    location: "",
    dateOfBirth: "",
    gender: "",
  });
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const { logout, userId, role } = useAuthStore();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("info");
  const [user, setUser] = useState(null);
  const [savedEvents, setSavedEvents] = useState([]);
  const [isLoadingEvents, setIsLoadingEvents] = useState(true);
  const [favoriteArtists, setFavoriteArtists] = useState([]);
  const [isLoadingArtists, setIsLoadingArtists] = useState(true);
  const [isLoadingTickets, setIsLoadingTickets] = useState(true);
  const [tickets, setTickets] = useState([]);
  const location = useLocation();
  const fileInputRef = useRef();

  const { success, error, warning, confirmDelete } = useAlert();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tabFromUrl = params.get("tab");
    if (tabFromUrl) {
      setActiveTab(tabFromUrl);
    }
  }, [location.search]);


  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await getUserById(userId);
        console.log(user);
        setUser(user);
      } catch (err) {
        error(
          "Error al obtener el usuario: " + (err.message || "Error desconocido")
        );
      }
    };

    fetchUser();
  }, [userId, error]);

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        phone: user.phone || "",
        location: user.location || "",
        dateOfBirth: user.dateOfBirth || "",
        gender: user.gender || "",
      });
    }
  }, [user]);

  useEffect(() => {
    const fetchTickets = async () => {
      if (!userId) return;
      setIsLoadingTickets(true);
      try {
        const userTickets = await getUserTickets(userId);
        const formattedTickets = userTickets.map((ticket) => ({
          id: ticket.ticketId,
          title: ticket.eventName,
          date: ticket.eventDate,
          location: ticket.eventLocation,
          image: ticket.image || "/placeholder.svg?height=300&width=300",
          price: ticket.price,
        }));

        setTickets(formattedTickets);
      } catch (err) {
        error(
          "Error al obtener los tickets: " +
            (err.message || "Error desconocido")
        );
      } finally {
        setIsLoadingTickets(false);
      }
    };

    fetchTickets();
  }, [userId, error]);

  useEffect(() => {
    const fetchFavoriteEvents = async () => {
      if (!user?.favoriteEventIds?.length) {
        setSavedEvents([]);
        setIsLoadingEvents(false);
        return;
      }

      try {
        const promises = user.favoriteEventIds.map((eventId) =>
          getEventById(eventId)
        );
        const events = await Promise.all(promises);
        const formatted = events.map((event) => ({
          id: event.id,
          title: event.name,
          date: event.startDate,
          location: event.location?.name || "Ubicación no disponible",
          image:
            event.coverImage || event.photos?.[0]?.url || "/images/default.jpg",
          price: event.tickets?.[0]?.price || "-",
          category: event.category?.toLowerCase() || "otro",
          isLiked: true,
        }));
        setSavedEvents(formatted);
      } catch (err) {
        console.error("Error al cargar eventos favoritos:", err);
      } finally {
        setIsLoadingEvents(false);
      }
    };

    fetchFavoriteEvents();
  }, [user]);

  useEffect(() => {
    const fetchFavoriteArtists = async () => {
      if (!user?.followedArtistIds?.length) {
        setFavoriteArtists([]);
        setIsLoadingArtists(false);
        return;
      }

      try {
        const allArtists = await getAllArtists();

        const filtered = allArtists
          .filter((artist) => user.followedArtistIds.includes(artist.id))
          .map((artist) => ({
            id: artist.id,
            name: artist.artisticName,
            image:
              artist.profileImage || "/placeholder.svg?height=300&width=300",
          }));

        setFavoriteArtists(filtered);
        console.log("Artistas favoritos:", filtered);
      } catch (err) {
        console.error("Error al cargar artistas favoritos:", err);
      } finally {
        setIsLoadingArtists(false);
      }
    };

    fetchFavoriteArtists();
  }, [user]);

  if (!user) return <div className="text-center py-12">Cargando perfil...</div>;

  const allTabs = [
    {
      id: "info",
      icon: <User size={16} />,
      label: "Información",
      roles: ["CLIENT", "ADMIN", "EVENT_MANAGER", "ARTIST"],
    },
    {
      id: "tickets",
      icon: <Ticket size={16} />,
      label: "Mis Tickets",
      roles: ["CLIENT"],
    },
    {
      id: "saved",
      icon: <Heart size={16} />,
      label: "Eventos Guardados",
      roles: ["CLIENT"],
    },
    {
      id: "artists",
      icon: <Users size={16} />,
      label: "Artistas Seguidos",
      roles: ["CLIENT"],
    },
    {
      id: "notifications",
      icon: <Bell size={16} />,
      label: "Notificaciones",
      roles: ["CLIENT"],
    },
    {
      id: "settings",
      icon: <Settings size={16} />,
      label: "Ajustes",
      roles: ["CLIENT", "ADMIN", "EVENT_MANAGER", "ARTIST"],
    },
  ];

  // Filtrar pestañas según el rol del usuario
  const availableTabs = allTabs.filter((tab) => tab.roles.includes(role));

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      const res = await uploadProfilePicture(userId, file);
      setUser((prev) => ({ ...prev, profilePicture: res.imageURL  }));
      success("Imagen de perfil actualizada correctamente");
      setFormData((prev) => ({
        profilePicture: res.imageURL ,
        ...prev,
      }));
    } catch (err) {
      error(
        "Error al subir la imagen: " + (err.message || "Error desconocido")
      );
    }
  };

  const handleChangePassword = async () => {
    // Validaciones
    if (
      !passwordData.currentPassword ||
      !passwordData.newPassword ||
      !passwordData.confirmPassword
    ) {
      warning("Por favor, completa todos los campos");
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      error("Las contraseñas no coinciden");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      warning("La nueva contraseña debe tener al menos 6 caracteres");
      return;
    }

    try {
      await changeUserPassword(userId, passwordData);
      success("Contraseña actualizada con éxito");
      setShowPasswordModal(false);
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      error(
        "Error al cambiar la contraseña: " +
          (err.message || "Error desconocido")
      );
    }
  };

  const handleDeleteAccount = async () => {
    const confirmed = await confirmDelete(
      "¿Estás seguro de que quieres eliminar tu cuenta? Esta acción no se puede deshacer y perderás todos tus datos."
    );

    if (!confirmed) return;

    try {
      const result = await deleteAccount(userId);
      if (result) {
        success("Cuenta eliminada con éxito");
        logout();
        navigate("/");
      }
    } catch (err) {
      error(
        "Error al eliminar la cuenta: " + (err.message || "Error desconocido")
      );
    }
  };

  const handleSaveProfile = async () => {
    try {
      const updatedUser = await updateUserProfile(userId, formData);
      setUser(updatedUser);
      setIsEditing(false);
      success("Perfil actualizado correctamente");
    } catch (err) {
      error(
        "Error al actualizar el perfil: " + (err.message || "Error desconocido")
      );
    }
  };

  const handleUpdateNotifications = async (newValue) => {
    try {
      const updatedUser = await updateUserProfile(user.id, {
        notificationsEnabled: newValue,
      });
      setUser(updatedUser);
      success(
        newValue ? "Notificaciones activadas" : "Notificaciones desactivadas"
      );
    } catch (err) {
      error(
        "Error actualizando notificaciones: " +
          (err.message || "Error desconocido")
      );
    }
  };

  return (
    <>
      <Nav isAuthenticated={true} />
      <main className="min-h-screen bg-[#F3F0FA] py-12 px-4 mt-8 ">
        <div className="container mx-auto max-w-6xl">
          {/* Profile Header */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              <div className="relative">
                <div className="h-24 w-24 md:h-32 md:w-32 rounded-full overflow-hidden bg-[#5C3D8D]">
                  {user.profilePicture ? (
                    <img
                      src={user.profilePicture || "/placeholder.svg"}
                      alt={`${user.firstName} ${user.lastName}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white text-2xl">
                      {user.firstName?.[0] || "U"}
                      {user.lastName?.[0] || ""}
                    </div>
                  )}
                </div>

                <Button
                  size="sm"
                  isIconOnly
                  className="absolute bottom-0 right-0 h-8 w-8 min-w-0 rounded-full bg-[#5C3D8D] hover:bg-[#2E1A47] text-white"
                  onPress={() => fileInputRef.current?.click()}
                >
                  <Camera size={14} />
                </Button>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={handleImageUpload}
                />
              </div>

              <div className="flex-grow text-center md:text-left">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-[#2E1A47]">
                      {user.name}
                    </h1>
                    <p className="text-[#5C3D8D]">{user.email}</p>
                  </div>
                  <div className="mt-4 md:mt-0 flex justify-center md:justify-end gap-3">
                    {isEditing ? (
                      <Button
                        onPress={handleSaveProfile}
                        variant="solid"
                        className="bg-[#5C3D8D] text-white hover:bg-[#2E1A47]"
                        size="sm"
                      >
                        Guardar Cambios
                      </Button>
                    ) : (
                      <Button
                        variant="bordered"
                        className="border-[#5C3D8D] text-[#5C3D8D] hover:bg-[#5C3D8D]/10"
                        size="sm"
                        onPress={() => setIsEditing(true)}
                      >
                        Editar Perfil
                      </Button>
                    )}

                    <Button
                      onPress={() => {
                        logout();
                        navigate("/login");
                      }}
                      variant="light"
                      className="text-red-500 hover:bg-red-50 hover:text-red-600"
                      size="sm"
                      startContent={<LogOut size={16} />}
                    >
                      Cerrar Sesión
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                  <div className="bg-[#F3F0FA] p-3 rounded-lg">
                    <p className="text-sm text-[#5C3D8D]">Miembro desde</p>
                    <p className="font-medium text-[#2E1A47]">
                      {new Date(user.createdAt).toLocaleDateString("es-ES", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                  <div className="bg-[#F3F0FA] p-3 rounded-lg">
                    <p className="text-sm text-[#5C3D8D]">Ubicación</p>
                    <p className="font-medium text-[#2E1A47]">
                      {user.location || "No especificada"}
                    </p>
                  </div>
                  <div className="bg-[#F3F0FA] p-3 rounded-lg">
                    <p className="text-sm text-[#5C3D8D]">Teléfono</p>
                    <p className="text-[#2E1A47]">
                      {user.phone || "No especificado"}
                    </p>
                  </div>
                  {role === "CLIENT" && (
                    <div className="bg-[#F3F0FA] p-3 rounded-lg">
                      <p className="text-sm text-[#5C3D8D]">
                        Eventos asistidos
                      </p>
                      <p className="font-medium text-[#2E1A47]">{tickets.length}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Profile Tabs - Filtradas por rol */}
          <div className="w-full">
            {/* Tabs Navigation */}
            <div className="mb-8 flex flex-wrap gap-2 bg-transparent">
              {availableTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`rounded-md px-4 py-2 transition-colors flex items-center ${
                    activeTab === tab.id
                      ? "bg-[#5C3D8D] text-white"
                      : "bg-white text-[#5C3D8D] hover:bg-[#A28CD4]/20"
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span> {tab.label}
                </button>
              ))}
            </div>

            {/* Tabs Content */}
            {activeTab === "info" && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-bold text-[#2E1A47] mb-6">
                  Información Personal
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-sm font-medium text-[#5C3D8D] mb-1">
                      Nombre Completo
                    </h3>
                    {isEditing ? (
                      <div className="flex gap-2">
                        <input
                          type="text"
                          className="form-input border border-gray-200 rounded-md px-3 py-1 w-full"
                          value={formData.firstName}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              firstName: e.target.value,
                            })
                          }
                          placeholder="Nombre"
                        />
                        <input
                          type="text"
                          className="form-input border border-gray-200 rounded-md px-3 py-1 w-full"
                          value={formData.lastName}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              lastName: e.target.value,
                            })
                          }
                          placeholder="Apellidos"
                        />
                      </div>
                    ) : (
                      <p className="text-[#2E1A47]">{`${
                        user?.firstName || ""
                      } ${user?.lastName || ""}`}</p>
                    )}
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-[#5C3D8D] mb-1">
                      Email
                    </h3>
                    {isEditing ? (
                      <input
                        type="email"
                        className="form-input border border-gray-200 rounded-md px-3 py-1 w-full"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                      />
                    ) : (
                      <p className="text-[#2E1A47]">{user.email}</p>
                    )}
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-[#5C3D8D] mb-1">
                      Teléfono
                    </h3>
                    {isEditing ? (
                      <input
                        type="tel"
                        className="form-input border border-gray-200 rounded-md px-3 py-1 w-full"
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                      />
                    ) : (
                      <p className="text-[#2E1A47]">
                        {user.phone || "No especificado"}
                      </p>
                    )}
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-[#5C3D8D] mb-1">
                      Ubicación
                    </h3>
                    {isEditing ? (
                      <input
                        type="text"
                        className="form-input border border-gray-200 rounded-md px-3 py-1 w-full"
                        value={formData.location}
                        onChange={(e) =>
                          setFormData({ ...formData, location: e.target.value })
                        }
                      />
                    ) : (
                      <p className="text-[#2E1A47]">
                        {user.location || "No especificada"}
                      </p>
                    )}
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-[#5C3D8D] mb-1">
                      Fecha de Nacimiento
                    </h3>
                    <p className="text-[#2E1A47]">
                      {user.dateOfBirth || "No especificada"}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-[#5C3D8D] mb-1">
                      Género
                    </h3>
                    <p className="text-[#2E1A47]">
                      {user.gender || "No especificado"}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "tickets" && role === "CLIENT" && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-bold text-[#2E1A47] mb-6">
                  Mis Tickets
                </h2>

                {tickets.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {tickets.map((event) => (
                      <motion.div
                        key={event.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                      >
                        <EventCard event={event} />
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Ticket className="h-16 w-16 mx-auto text-[#A28CD4] mb-4" />
                    <h3 className="text-lg font-medium text-[#2E1A47] mb-2">
                      No tienes tickets
                    </h3>
                    <p className="text-[#5C3D8D] mb-6">
                      Explora eventos y compra tickets para verlos aquí
                    </p>
                    <Button className="bg-[#5C3D8D] hover:bg-[#2E1A47] text-white">
                      Explorar Eventos
                    </Button>
                  </div>
                )}
              </div>
            )}

            {activeTab === "saved" && role === "CLIENT" && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-bold text-[#2E1A47] mb-6">
                  Eventos Guardados
                </h2>

                {savedEvents.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {savedEvents.map((event) => (
                      <motion.div
                        key={event.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                      >
                        <EventCard event={event} />
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Heart className="h-16 w-16 mx-auto text-[#A28CD4] mb-4" />
                    <h3 className="text-lg font-medium text-[#2E1A47] mb-2">
                      No tienes eventos guardados
                    </h3>
                    <p className="text-[#5C3D8D] mb-6">
                      Guarda eventos para verlos aquí
                    </p>
                    <Button className="bg-[#5C3D8D] hover:bg-[#2E1A47] text-white">
                      Explorar Eventos
                    </Button>
                  </div>
                )}
              </div>
            )}

            {activeTab === "artists" && role === "CLIENT" && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-bold text-[#2E1A47] mb-6">
                  Artistas Seguidos
                </h2>

                {favoriteArtists.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {favoriteArtists.map((artist) => (
                      <motion.div
                        key={artist.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="bg-gray-50 rounded-xl shadow-md p-4 hover:shadow-lg transition-shadow"
                      >
                        <div className="flex flex-col items-center text-center">
                          <img
                            src={artist.image}
                            alt={artist.name}
                            className="w-24 h-24 rounded-full object-cover mb-4"
                          />
                          <h3 className="text-lg font-semibold text-[#2E1A47]">
                            {artist.name}
                          </h3>
                          <p className="text-sm text-gray-500 mt-1 text-center">
                            {artist.description || "Artista seguido"}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Heart className="h-16 w-16 mx-auto text-[#A28CD4] mb-4" />
                    <h3 className="text-lg font-medium text-[#2E1A47] mb-2">
                      No tienes ningún artista en favorito
                    </h3>
                    <p className="text-[#5C3D8D] mb-6">
                      Sigue a tus artistas para no perdértelos en tu ciudad
                    </p>
                    <Button
                      className="bg-[#5C3D8D] hover:bg-[#2E1A47] text-white"
                      onClick={() => navigate("/artists")}
                    >
                      Explorar Artistas
                    </Button>
                  </div>
                )}
              </div>
            )}

            {activeTab === "notifications" && role === "CLIENT" && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-bold text-[#2E1A47] mb-6">
                  Preferencias de Notificaciones
                </h2>

                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 border border-gray-100 rounded-lg">
                    <div>
                      <h3 className="font-medium text-[#2E1A47]">
                        Notificaciones por Email
                      </h3>
                      <p className="text-sm text-[#5C3D8D]">
                        Recibe actualizaciones sobre tus eventos
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={user.notificationsEnabled || false}
                        onChange={(e) =>
                          handleUpdateNotifications(e.target.checked)
                        }
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#5C3D8D]"></div>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "settings" && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-bold text-[#2E1A47] mb-6">
                  Ajustes de la Cuenta
                </h2>
                <div className="space-y-6">
                  <div className="p-4 border border-gray-100 rounded-lg">
                    <h3 className="font-medium text-[#2E1A47] mb-2">
                      Cambiar Contraseña
                    </h3>
                    <p className="text-sm text-[#5C3D8D] mb-4">
                      Actualiza tu contraseña regularmente para mayor seguridad
                    </p>
                    <Button
                      variant="bordered"
                      className="border-[#5C3D8D] text-[#5C3D8D] hover:bg-[#5C3D8D]/10"
                      onPress={() => setShowPasswordModal(true)}
                    >
                      Cambiar Contraseña
                    </Button>
                  </div>

                  {role === "CLIENT" && (
                    <div className="p-4 border border-gray-100 rounded-lg">
                      <h3 className="font-medium text-red-500 mb-2">
                        Eliminar Cuenta
                      </h3>
                      <p className="text-sm text-[#5C3D8D] mb-4">
                        Esta acción no se puede deshacer
                      </p>
                      <Button
                        color="danger"
                        variant="flat"
                        onPress={handleDeleteAccount}
                      >
                        Eliminar mi cuenta
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-md">
            <h2 className="text-lg font-bold mb-4 text-[#2E1A47]">
              Cambiar Contraseña
            </h2>
            <div className="space-y-4">
              <input
                type="password"
                placeholder="Contraseña actual"
                className="w-full border rounded px-3 py-2"
                value={passwordData.currentPassword}
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    currentPassword: e.target.value,
                  })
                }
              />
              <input
                type="password"
                placeholder="Nueva contraseña"
                className="w-full border rounded px-3 py-2"
                value={passwordData.newPassword}
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    newPassword: e.target.value,
                  })
                }
              />
              <input
                type="password"
                placeholder="Confirmar nueva contraseña"
                className="w-full border rounded px-3 py-2"
                value={passwordData.confirmPassword}
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    confirmPassword: e.target.value,
                  })
                }
              />
              <div className="flex justify-end gap-2">
                <Button
                  onPress={() => setShowPasswordModal(false)}
                  variant="light"
                >
                  Cancelar
                </Button>
                <Button
                  onPress={handleChangePassword}
                  className="bg-[#5C3D8D] text-white"
                >
                  Guardar
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}
