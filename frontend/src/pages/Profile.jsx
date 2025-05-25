"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { Button } from "@heroui/button"
import { User, Ticket, Settings, Bell, CreditCard, Calendar, Heart, Edit, Camera, LogOut, Users } from "lucide-react"
import Nav from "../components/Navbar"
import Footer from "../components/Footer"
import EventCard from "../components/EventCard"
import { useTranslation } from "react-i18next"
import { getUserById, updateUserProfile, uploadProfilePicture, changeUserPassword, deleteAccount } from "../services/userService"
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore"

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    location: '',
    dateOfBirth: '',
    gender: '',
  });
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const { logout } = useAuthStore()
  const navigate = useNavigate()
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState("info")
  const [user, setUser] = useState(null)
  const fileInputRef = useRef()
  const userId = 50
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await getUserById(userId);
        console.log(user);
        setUser(user);
      } catch (error) {
        showAlert("Error al obtener el usuario:", error);
      }
    };

    fetchUser();
  }, []);
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

  if (!user) return <div className="text-center py-12">Cargando perfil...</div>


  //   const user = {
  //   name: "Juan Pérez",
  //   email: "juan.perez@example.com",
  //   avatar: "/images/avatar.jpg",
  //   joinDate: "Enero 2023",
  //   location: "Madrid, España",
  //   phone: "+34 612 345 678",
  //   artistsFollow:{},
  //   purchasedEvents:{
  //     [
  //   {
  //     id: 1,
  //     title: "Concierto de Rock en Vivo",
  //     date: "2023-06-15T20:00:00",
  //     location: "Wizink Center, Madrid",
  //     image: "/images/event1.jpg",
  //     price: "45",
  //     category: "concerts",
  //   },
  //   {
  //     id: 2,
  //     title: "Festival de Verano",
  //     date: "2023-07-22T18:00:00",
  //     location: "Parque Tierno Galván, Madrid",
  //     image: "/images/event2.jpg",
  //     price: "60",
  //     category: "festivals",
  //   },
  // ],
  //   }
  // }



  const purchasedEvents = [
    {
      id: 1,
      title: "Concierto de Rock en Vivo",
      date: "2023-06-15T20:00:00",
      location: "Wizink Center, Madrid",
      image: "/images/event1.jpg",
      price: "45",
      category: "concerts",
    },
    {
      id: 2,
      title: "Festival de Verano",
      date: "2023-07-22T18:00:00",
      location: "Parque Tierno Galván, Madrid",
      image: "/images/event2.jpg",
      price: "60",
      category: "festivals",
    },
  ]

  const savedEvents = [
    {
      id: 3,
      title: "Teatro: Romeo y Julieta",
      date: "2023-08-05T19:30:00",
      location: "Teatro Real, Madrid",
      image: "/images/event3.jpg",
      price: "35",
      category: "theater",
      isLiked: true,
    },
    {
      id: 4,
      title: "Partido de Fútbol: Liga Nacional",
      date: "2023-06-30T21:00:00",
      location: "Estadio Santiago Bernabéu, Madrid",
      image: "/images/event4.jpg",
      price: "50",
      category: "sports",
      isLiked: true,
    },
    {
      id: 5,
      title: "Monólogo de Comedia",
      date: "2023-07-10T22:00:00",
      location: "Teatro Cofidis Alcázar, Madrid",
      image: "/images/event5.jpg",
      price: "25",
      category: "comedy",
      isLiked: true,
    },
  ]

  const handleTabChange = (tab) => {
    setActiveTab(tab)
  }
  const handleImageUpload = async (event) => {
    const file = event.target.files[0]
    if (!file) return
    const res = await uploadProfilePicture(userId, file);
    setUser((prev) => ({ ...prev, profilePicture: res.imageUrl }));

  }

  const handleChangePassword = async () => {
    try {
      await changeUserPassword(userId, passwordData);
      alert("Contraseña actualizada con éxito.");
      setShowPasswordModal(false);
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (error) {
      alert("Error al cambiar la contraseña: " + error.message);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      const result = await deleteAccount(userId);
      if (result) {
        alert("Cuenta eliminada con éxito.");
        logout();         
        navigate("/");    
      }
    } catch (error) {
      alert("Error al eliminar la cuenta: " + error.message);
    }
  };




  const handleEdit = async () => {
    const updated = {
      firstName: "NuevoNombre",
      lastName: "NuevoApellido",
      email: "NuevoEmail",
      phone: "NuevoTeléfono",
      location: "NuevaUbicación",
      dateOfBirth: user.dateOfBirth,

      notificationsEnabled: user.notificationsEnabled,
    }
    const updatedUser = await updateUserProfile(userId, updated)
    setUser(updatedUser)
  }





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
                      {user.firstName[0]}
                      {user.lastName[0]}
                    </div>
                  )}
                </div>
              </div>

              <Button
                size="sm"
                isIconOnly
                className="absolute bottom-0 right-0 h-8 w-8 min-w-0 rounded-full bg-[#5C3D8D] hover:bg-[#2E1A47] text-white"
                onPress={() => fileInputRef.current.click()}
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


              <div className="flex-grow text-center md:text-left">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-[#2E1A47]">{user.name}</h1>
                    <p className="text-[#5C3D8D]">{user.email}</p>
                  </div>
                  <div className="mt-4 md:mt-0 flex justify-center md:justify-end gap-3">
                    {isEditing ? (
                      <Button
                        onPress={async () => {
                          const updatedUser = await updateUserProfile(userId, formData);
                          setUser(updatedUser);
                          setIsEditing(false);
                        }}
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
                        logout();         // Limpia el estado
                        navigate("/login"); // Redirige al login
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
                    <p className="font-medium text-[#2E1A47]">{user.location}</p>
                  </div>
                  <div className="bg-[#F3F0FA] p-3 rounded-lg">
                    <p className="text-sm text-[#5C3D8D]">Teléfono</p>
                    <p className="text-[#2E1A47]">{user.phone}</p>
                  </div>
                  <div className="bg-[#F3F0FA] p-3 rounded-lg">
                    <p className="text-sm text-[#5C3D8D]">Eventos asistidos</p>
                    <p className="font-medium text-[#2E1A47]">12</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Tabs - Implementación personalizada en lugar de usar @heroui/tabs */}
          <div className="w-full">
            {/* Tabs Navigation */}
            <div className="mb-8 flex flex-wrap gap-2 bg-transparent">
              {[
                { id: "info", icon: <User size={16} />, label: "Información" },
                { id: "tickets", icon: <Ticket size={16} />, label: "Mis Tickets" },
                { id: "saved", icon: <Heart size={16} />, label: "Guardados" },
                { id: "artists", icon: <Users size={16} />, label: "Artistas Seguidos" },
                { id: "notifications", icon: <Bell size={16} />, label: "Notificaciones" },
                { id: "settings", icon: <Settings size={16} />, label: "Ajustes" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`rounded-md px-4 py-2 transition-colors flex items-center ${activeTab === tab.id ? "bg-[#5C3D8D] text-white" : "bg-white text-[#5C3D8D] hover:bg-[#A28CD4]/20"
                    }`}
                >
                  <span className="mr-2">{tab.icon}</span> {tab.label}
                </button>
              ))}
            </div>

            {/* Tabs Content */}
            {activeTab === "info" && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-bold text-[#2E1A47] mb-6">Información Personal</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-sm font-medium text-[#5C3D8D] mb-1">Nombre Completo</h3>
                    {isEditing ? (
                      <div className="flex gap-2">
                        <input
                          type="text"
                          className="form-input border border-gray-200 rounded-md px-3 py-1 w-full"
                          value={formData.firstName}
                          onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                          placeholder="Nombre"
                        />
                        <input
                          type="text"
                          className="form-input border border-gray-200 rounded-md px-3 py-1 w-full"
                          value={formData.lastName}
                          onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                          placeholder="Apellidos"
                        />
                      </div>
                    ) : (
                      <p className="text-[#2E1A47]">{`${user?.firstName || ''} ${user?.lastName || ''}`}</p>
                    )}
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-[#5C3D8D] mb-1">Email</h3>
                    {isEditing ? (
                      <input
                        type="text"
                        className="form-input border border-gray-200 rounded-md px-3 py-1 w-full"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                    ) : (
                      <p className="text-[#2E1A47]">{user.email}</p>
                    )}                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-[#5C3D8D] mb-1">Teléfono</h3>
                    {isEditing ? (
                      <input
                        type="text"
                        className="form-input border border-gray-200 rounded-md px-3 py-1 w-full"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      />
                    ) : (
                      <p className="text-[#2E1A47]">{user.phone}</p>
                    )}
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-[#5C3D8D] mb-1">Ubicación</h3>
                    {isEditing ? (
                      <input
                        type="text"
                        className="form-input border border-gray-200 rounded-md px-3 py-1 w-full"
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      />
                    ) : (
                      <p className="text-[#2E1A47]">{user.location}</p>
                    )}
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-[#5C3D8D] mb-1">Fecha de Nacimiento</h3>
                    <p className="text-[#2E1A47]">{user.dateOfBirth}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-[#5C3D8D] mb-1">Género</h3>
                    <p className="text-[#2E1A47]">Masculino</p>
                  </div>
                </div>

                {/* <div className="mt-8">
                  <h2 className="text-xl font-bold text-[#2E1A47] mb-6">Preferencias</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-sm font-medium text-[#5C3D8D] mb-1">Categorías Favoritas</h3>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <span className="bg-[#5C3D8D]/10 text-[#5C3D8D] px-3 py-1 rounded-full text-sm">
                          Conciertos
                        </span>
                        <span className="bg-[#5C3D8D]/10 text-[#5C3D8D] px-3 py-1 rounded-full text-sm">
                          Festivales
                        </span>
                        <span className="bg-[#5C3D8D]/10 text-[#5C3D8D] px-3 py-1 rounded-full text-sm">Teatro</span>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-[#5C3D8D] mb-1">Artistas Favoritos</h3>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <span className="bg-[#5C3D8D]/10 text-[#5C3D8D] px-3 py-1 rounded-full text-sm">Coldplay</span>
                        <span className="bg-[#5C3D8D]/10 text-[#5C3D8D] px-3 py-1 rounded-full text-sm">
                          Ed Sheeran
                        </span>
                        <span className="bg-[#5C3D8D]/10 text-[#5C3D8D] px-3 py-1 rounded-full text-sm">Rosalía</span>
                      </div>
                    </div>
                  </div>
                </div> */}
              </div>
            )}

            {activeTab === "tickets" && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-bold text-[#2E1A47] mb-6">Mis Tickets</h2>

                {purchasedEvents.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {purchasedEvents.map((event) => (
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
                    <h3 className="text-lg font-medium text-[#2E1A47] mb-2">No tienes tickets</h3>
                    <p className="text-[#5C3D8D] mb-6">Explora eventos y compra tickets para verlos aquí</p>
                    <Button className="bg-[#5C3D8D] hover:bg-[#2E1A47] text-white">Explorar Eventos</Button>
                  </div>
                )}
              </div>
            )}

            {activeTab === "saved" && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-bold text-[#2E1A47] mb-6">Eventos Guardados</h2>

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
                    <h3 className="text-lg font-medium text-[#2E1A47] mb-2">No tienes eventos guardados</h3>
                    <p className="text-[#5C3D8D] mb-6">Guarda eventos para verlos aquí</p>
                    <Button className="bg-[#5C3D8D] hover:bg-[#2E1A47] text-white">Explorar Eventos</Button>
                  </div>
                )}
              </div>
            )}

            {activeTab === "artists" && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-bold text-[#2E1A47] mb-6">Artistas Seguidos</h2>

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
                    <h3 className="text-lg font-medium text-[#2E1A47] mb-2">No tienes ningún artista en favorito</h3>
                    <p className="text-[#5C3D8D] mb-6">Sigue a tus artistas para no perdértelos en tu ciudad</p>
                    <Button className="bg-[#5C3D8D] hover:bg-[#2E1A47] text-white">Explorar Artistas</Button>
                  </div>
                )}
              </div>
            )}


            {activeTab === "notifications" && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-bold text-[#2E1A47] mb-6">Preferencias de Notificaciones</h2>

                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 border border-gray-100 rounded-lg">
                    <div>
                      <h3 className="font-medium text-[#2E1A47]">Notificaciones por Email</h3>
                      <p className="text-sm text-[#5C3D8D]">Recibe actualizaciones sobre tus eventos</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={user.notificationsEnabled}
                        onChange={async (e) => {
                          const newValue = e.target.checked;

                          try {
                            const updatedUser = await updateUserProfile(user.id, {
                              notificationsEnabled: newValue,
                            });
                            setUser(updatedUser);
                          } catch (error) {
                            throw new Error("Error actualizando notificaciones:", error);
                          }
                        }}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#5C3D8D]"></div>
                    </label>
                  </div>

                </div>
              </div>
            )}

            {activeTab === "calendar" && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-bold text-[#2E1A47] mb-6">Calendario de Eventos</h2>
                <div className="text-center py-12">
                  <Calendar className="h-16 w-16 mx-auto text-[#A28CD4] mb-4" />
                  <h3 className="text-lg font-medium text-[#2E1A47] mb-2">Calendario en desarrollo</h3>
                  <p className="text-[#5C3D8D] mb-6">Esta función estará disponible próximamente</p>
                </div>
              </div>
            )}

            {activeTab === "payment" && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-bold text-[#2E1A47] mb-6">Métodos de Pago</h2>
                <div className="text-center py-12">
                  <CreditCard className="h-16 w-16 mx-auto text-[#A28CD4] mb-4" />
                  <h3 className="text-lg font-medium text-[#2E1A47] mb-2">No hay métodos de pago guardados</h3>
                  <p className="text-[#5C3D8D] mb-6">Añade un método de pago para agilizar tus compras</p>
                  <Button className="bg-[#5C3D8D] hover:bg-[#2E1A47] text-white">Añadir método de pago</Button>
                </div>
              </div>
            )}

            {activeTab === "settings" && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-bold text-[#2E1A47] mb-6">Ajustes de la Cuenta</h2>
                <div className="space-y-6">
                  <div className="p-4 border border-gray-100 rounded-lg">
                    <h3 className="font-medium text-[#2E1A47] mb-2">Cambiar Contraseña</h3>
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

                  <div className="p-4 border border-gray-100 rounded-lg">
                    <h3 className="font-medium text-red-500 mb-2">Eliminar Cuenta</h3>
                    <p className="text-sm text-[#5C3D8D] mb-4">Esta acción no se puede deshacer</p>
                    <Button
                      color="danger"
                      variant="flat"
                      onPress={handleDeleteAccount}
                    >
                      Eliminar mi cuenta
                    </Button>

                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-md">
            <h2 className="text-lg font-bold mb-4 text-[#2E1A47]">Cambiar Contraseña</h2>
            <div className="space-y-4">
              <input
                type="password"
                placeholder="Contraseña actual"
                className="w-full border rounded px-3 py-2"
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
              />
              <input
                type="password"
                placeholder="Nueva contraseña"
                className="w-full border rounded px-3 py-2"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
              />
              <input
                type="password"
                placeholder="Confirmar nueva contraseña"
                className="w-full border rounded px-3 py-2"
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
              />
              <div className="flex justify-end gap-2">
                <Button onPress={() => setShowPasswordModal(false)} variant="light">
                  Cancelar
                </Button>
                <Button onPress={handleChangePassword} className="bg-[#5C3D8D] text-white">
                  Guardar
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />

    </>
  )
}
