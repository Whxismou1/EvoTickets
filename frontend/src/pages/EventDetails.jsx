"use client";

import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@heroui/button";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import {
  Calendar,
  Clock,
  MapPin,
  Share2,
  Heart,
  Ticket,
  Info,
  ChevronRight,
  ChevronDown,
  ChevronLeft,
  Star,
  Users,
  User,
  ImageIcon,
  ExternalLink,
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useTranslation } from "react-i18next";
import { getEventById } from "../services/eventService";
import { useAuthStore } from "../store/authStore";
import {
  removeFavorite,
  addFavorite,
  getUserById,
} from "../services/userService";
import useAlert from "../hooks/useAlert";
import Alert from "../components/Alert";

export default function EventDetail() {
  const { alert, showAlert, hideAlert } = useAlert();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { id } = useParams();
  const [eventData, setEventData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [activeGalleryIndex, setActiveGalleryIndex] = useState(0);
  const [showAllArtists, setShowAllArtists] = useState(false);
  useEffect(() => {
    const fetchEventAndCheckFavorite = async () => {
      if (!id) return;

      const userId = useAuthStore.getState().userId;

      try {
        const event = await getEventById(id);
        setEventData(event);
        console.log("Event data fetched successfully:", event);

        const userData = await getUserById(userId);

        const favoritos = userData.favoriteEventIds || [];
        setIsLiked(favoritos.includes(parseInt(id)));
      } catch (error) {
        console.error("Error al cargar evento o favoritos:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEventAndCheckFavorite();
  }, [id]);

  const FAQItem = ({ faq, index }) => {
    const [open, setOpen] = useState(false);

    return (
      <motion.div
        key={index}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: index * 0.1 }}
        className="bg-[#F3F0FA] rounded-lg p-4 cursor-pointer"
        onClick={() => setOpen(!open)}
      >
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-[#2E1A47]">{faq.question}</h3>
          <motion.div
            animate={{ rotate: open ? 180 : 0 }}
            transition={{ duration: 0.3 }}
            className="ml-2"
          >
            <ChevronDown className="h-4 w-4 text-[#5C3D8D]" />
          </motion.div>
        </div>
        {open && <p className="text-sm text-[#5C3D8D] mt-2">{faq.answer}</p>}
      </motion.div>
    );
  };
  if (isLoading) {
    return (
      <>
        <Navbar isAuthenticated={true} />
        <main className="min-h-screen bg-[#F3F0FA] pt-16 flex items-center justify-center">
          <p className="text-center text-[#5C3D8D]">
            Cargando detalles del evento...
          </p>
        </main>
        <Footer />
      </>
    );
  }

  if (!eventData) {
    return (
      <>
        <Navbar isAuthenticated={true} />
        <main className="min-h-screen bg-[#F3F0FA] pt-16 flex items-center justify-center">
          <div className="text-center">
            <p className="text-[#5C3D8D] mb-4">
              No se ha encontrado el evento que buscas.
            </p>
            <Button
              as={Link}
              onPress={() => navigate("/events")}
              className="bg-[#5C3D8D] text-white hover:bg-[#2E1A47]"
            >
              Volver a la lista de eventos
            </Button>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const relatedGroups = [];
  if (eventData.relatedEvents && eventData.relatedEvents.length > 0) {
    const groupsMap = new Map();
    eventData.relatedEvents.forEach((ev) => {
      const year = new Date(ev.startDate).getFullYear();
      if (!groupsMap.has(year)) {
        groupsMap.set(year, []);
      }
      groupsMap.get(year).push(ev);
    });
    relatedGroups.push(
      ...Array.from(groupsMap, ([year, events]) => ({ year, events }))
    );
    relatedGroups.sort((a, b) => a.year - b.year);
  }

  const toggleLike = async () => {
    const userId = useAuthStore.getState().userId;
    if (!userId) {
      showAlert({
        type: "error",
        message: t("alert.notAuthenticated"),
      });
      return;
    }

    try {
      if (isLiked) {
        await removeFavorite(userId, eventData.id);
      } else {
        await addFavorite(userId, eventData.id);
      }
    } catch (error) {
      console.error("Error al guardar el evento:", error);
    }

    setIsLiked(!isLiked);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatYear = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      year: "numeric",
    });
  };

  const displayedArtists = showAllArtists
    ? eventData.artists
    : eventData.artists?.slice(0, 4) || [];

  return (
    <>
      <Navbar isAuthenticated={true} />
      <main className="min-h-screen bg-[#F3F0FA] pt-16">
        {/* Hero Section */}
        <section className="relative">
          <div className="relative h-[50vh] md:h-[60vh] overflow-hidden">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${eventData.coverImage})` }}
            ></div>
            <div className="absolute inset-0 bg-gradient-to-t from-[#2E1A47] to-transparent"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-[#2E1A47]/50 to-transparent"></div>
          </div>

          <div className="container mx-auto max-w-6xl px-4">
            <div className="relative -mt-32 md:-mt-40 z-10 pb-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white rounded-xl shadow-lg overflow-hidden"
              >
                <div className="p-6 md:p-8">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="bg-[#5C3D8D]/10 text-[#5C3D8D] text-xs font-medium px-2.5 py-0.5 rounded-full">
                          {eventData.category === "festivals"
                            ? "Festival"
                            : eventData.category}
                        </span>
                        <span className="bg-[#D7A6F3]/20 text-[#5C3D8D] text-xs font-medium px-2.5 py-0.5 rounded-full flex items-center">
                          <Star className="h-3 w-3 mr-1" />
                          {eventData.rating} ({eventData.reviews} reviews)
                        </span>
                      </div>
                      <h1 className="text-2xl md:text-4xl font-bold text-[#2E1A47] mb-2">
                        {eventData.name}
                      </h1>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[#5C3D8D]">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1.5" />
                          <span className="text-sm">
                            {formatDate(eventData.startDate)}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1.5" />
                          <span className="text-sm">
                            {formatTime(eventData.startDate)}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-1.5" />
                          <span className="text-sm">
                            {typeof eventData.location === "object"
                              ? eventData.location.name
                              : "Aun sin determinar"}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 mt-4 md:mt-0">
                      <Button
                        variant="light"
                        className={
                          isLiked
                            ? "text-red-500 hover:bg-red-50"
                            : "text-[#5C3D8D] hover:bg-[#5C3D8D]/10"
                        }
                        startContent={
                          <Heart
                            size={18}
                            className={isLiked ? "fill-red-500" : ""}
                          />
                        }
                        onPress={toggleLike}
                      >
                        {isLiked ? "Guardado" : "Guardar"}
                      </Button>
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row gap-6 mt-6">
                    <div className="md:w-2/3">
                      <div className="prose max-w-none text-[#2E1A47]/80">
                        <p className="text-base">{eventData.description}</p>
                      </div>
                      <div className="mt-6">
                        <Button
                          onPress={() => {navigate(`/ticket-selection/${eventData.id}`, { state: { eventData } })}}
                          className="bg-[#5C3D8D] hover:bg-[#2E1A47] text-white w-full md:w-auto"
                          size="lg"
                          startContent={<Ticket size={18} />}
                        >
                          Conseguir Entradas
                        </Button>
                      </div>
                    </div>
                    <div className="md:w-1/3 bg-[#F3F0FA] rounded-lg p-4">
                      <h3 className="font-semibold text-[#2E1A47] mb-3">
                        Precios
                      </h3>
                      <ul className="space-y-2">
                        {/*//TODO: Modificar el rango de precios cuando se implemente en el backend */}
                        {eventData.priceRanges &&
                          eventData.priceRanges.length > 0 && (
                            <ul className="space-y-2">
                              {eventData.priceRanges.map((range, index) => (
                                <li
                                  key={index}
                                  className="flex justify-between items-center text-sm"
                                >
                                  <span className="text-[#5C3D8D]">
                                    {range.type}
                                  </span>
                                  <span className="font-medium text-[#2E1A47]">
                                    {range.price}
                                  </span>
                                </li>
                              ))}
                            </ul>
                          )}
                      </ul>
                      <div className="border-t border-[#5C3D8D]/20 my-3"></div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-[#5C3D8D]">Organizador</span>
                          <span className="font-medium text-[#2E1A47]">{`${eventData.organizer} `}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[#5C3D8D]">Capacidad</span>
                          {eventData.capacity ? (
                            <span className="font-medium text-[#2E1A47]">
                              {eventData.capacity.toLocaleString()} personas
                            </span>
                          ) : (
                            <span className="font-medium text-[#2E1A47]">
                              No definida
                            </span>
                          )}
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[#5C3D8D]">Edad mínima</span>
                          <span className="font-medium text-[#2E1A47]">
                            +{eventData.minAge} años
                          </span>
                        </div>
                      </div>
                      <div className="mt-4">
                        {eventData?.website && (
                          <a
                            href={
                              eventData.website.startsWith("http")
                                ? eventData.website
                                : `https://${eventData.website}`
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#5C3D8D] hover:text-[#2E1A47] text-sm flex items-center"
                          >
                            Visitar sitio web oficial
                            <ExternalLink className="h-3 w-3 ml-1" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Artists Section */}
        {eventData.artists && eventData.artists.length > 0 && (
          <section className="py-8 px-4">
            <div className="container mx-auto max-w-6xl">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <User className="h-5 w-5 text-[#5C3D8D]" />
                  <h2 className="text-xl font-bold text-[#2E1A47]">
                    Invitados
                  </h2>
                </div>
                {eventData.artists && eventData.artists.length > 4 && (
                  <Button
                    variant="light"
                    className="text-[#5C3D8D] hover:text-[#2E1A47]"
                    onPress={() => setShowAllArtists(!showAllArtists)}
                  >
                    {showAllArtists ? "Ver menos" : "Ver todos"}
                  </Button>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {displayedArtists.map((artist) => (
                  <motion.div
                    key={artist.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white rounded-lg p-4 flex items-center hover:shadow-md transition-shadow"
                  >
                    <Link
                      to={`/artists/${artist.id}`}
                      className="w-12 h-12 rounded-full overflow-hidden mr-3 flex-shrink-0 border-2 border-[#5C3D8D]"
                    >
                      <img
                        src={artist.profileImage || "/placeholder.svg"}
                        alt={artist.artisticName}
                        className="w-full h-full object-cover"
                      />
                    </Link>
                    <div className="flex-grow">
                      <Link
                        to={`/artists/${artist.id}`}
                        className="font-medium text-[#2E1A47] hover:text-[#5C3D8D] transition-colors"
                      >
                        {artist.artisticName}
                      </Link>
                      <div className="text-xs text-[#5C3D8D]">
                        <div>{artist.role}</div>
                        <div>
                          {formatDate(artist.showsUpAt)} •{" "}
                          {formatTime(artist.showsUpAt)}
                        </div>
                      </div>
                    </div>
                    <Link
                      to={`/artists/${artist.id}`}
                      className="ml-2 p-1.5 rounded-full bg-[#5C3D8D]/10 text-[#5C3D8D] hover:bg-[#5C3D8D]/20 transition-colors"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Event Details Section */}
        <section className="py-8 px-4 bg-white">
          <div className="container mx-auto max-w-6xl">
            <div className="flex items-center gap-2 mb-6">
              <Info className="h-5 w-5 text-[#5C3D8D]" />
              <h2 className="text-xl font-bold text-[#2E1A47]">
                Detalles del evento
              </h2>
            </div>

            <div className="prose max-w-none text-[#2E1A47]/80">
              {eventData.longDescription && eventData.longDescription.trim() ? (
                eventData.longDescription.split("\n\n").map((paragraph, i) => (
                  <p key={i} className="mb-4">
                    {paragraph}
                  </p>
                ))
              ) : (
                <p className="mb-4">No hay detalles disponibles.</p>
              )}
            </div>

            <div className="mt-8">
              <h3 className="font-semibold text-[#2E1A47] mb-4">Ubicación</h3>
              <div className="bg-[#F3F0FA] rounded-lg p-4 mb-4">
                <div className="flex items-start">
                  <MapPin className="h-5 w-5 text-[#5C3D8D] mt-0.5 mr-2" />
                  <div>
                    <div className="font-medium text-[#2E1A47]">
                      {typeof eventData.location === "object"
                        ? eventData.location.name
                        : eventData.location}
                    </div>
                  </div>
                </div>
              </div>
              <div className="rounded-lg overflow-hidden h-64 bg-[#F3F0FA]">
                <MapContainer
                  center={[
                    eventData.location.latitude,
                    eventData.location.longitude,
                  ]}
                  zoom={15}
                  className="w-full h-full"
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution="&copy; OpenStreetMap contributors"
                  />
                  <Marker
                    position={[
                      eventData.location.latitude,
                      eventData.location.longitude,
                    ]}
                  >
                    <Popup>Ubicación del evento</Popup>
                  </Marker>
                </MapContainer>
              </div>
            </div>
          </div>
        </section>

        {/* Previous Events Gallery */}
        {relatedGroups.length > 0 && (
          <section className="py-8 px-4">
            <div className="container mx-auto max-w-6xl">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <ImageIcon className="h-5 w-5 text-[#5C3D8D]" />
                  <h2 className="text-xl font-bold text-[#2E1A47]">
                    Ediciones anteriores
                  </h2>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="light"
                    isIconOnly
                    className="text-[#5C3D8D] hover:bg-[#5C3D8D]/10 p-2"
                    onPress={() =>
                      setActiveGalleryIndex(
                        (prev) =>
                          (prev - 1 + relatedGroups.length) %
                          relatedGroups.length
                      )
                    }
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </Button>
                  {/* Se muestra el año del grupo activo */}
                  <span className="text-[#5C3D8D]">
                    {relatedGroups[activeGalleryIndex].year}
                  </span>
                  <Button
                    variant="light"
                    isIconOnly
                    className="text-[#5C3D8D] hover:bg-[#5C3D8D]/10 p-2"
                    onPress={() =>
                      setActiveGalleryIndex(
                        (prev) => (prev + 1) % relatedGroups.length
                      )
                    }
                  >
                    <ChevronRight className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {relatedGroups[activeGalleryIndex].events.map((ev) =>
                  ev.photos.map((image, index) => (
                    <motion.div
                      key={`${ev.id}-${index}`}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="aspect-square rounded-lg overflow-hidden"
                    >
                      <img
                        src={image.url || "/placeholder.svg"}
                        alt={`${ev.name} - ${formatYear(ev.startDate)}`}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </motion.div>
                  ))
                )}
              </div>
            </div>
          </section>
        )}
        {/* FAQs Section */}
        <section className="py-8 px-4 bg-white">
          <div className="container mx-auto max-w-6xl">
            <div className="flex items-center gap-2 mb-6">
              <Users className="h-5 w-5 text-[#5C3D8D]" />
              <h2 className="text-xl font-bold text-[#2E1A47]">
                Preguntas frecuentes
              </h2>
            </div>
            <div className="space-y-4">
              {(eventData.faqs || []).map((faq, index) => (
                <FAQItem key={index} faq={faq} index={index} />
              ))}
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
