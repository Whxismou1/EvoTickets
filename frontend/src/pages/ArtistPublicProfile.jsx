"use client";

import { motion } from "framer-motion";
import { Calendar, ChevronDown, ChevronUp, MapPin, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Alert from "../components/Alert";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { useAuthStore } from "../store/authStore";
import useAlert from "../hooks/useAlert";
import { getArtistById, getEventsByArtist } from "../services/artistService";
import { Button } from "@heroui/button";
import { followArtist, unfollowArtist } from "../services/userService";

const ArtistPublicProfile = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { alert, showAlert, hideAlert } = useAlert();
  const [isLoading, setIsLoading] = useState(true);
  const [showFullBio, setShowFullBio] = useState(false);
  const [artistData, setArtistData] = useState(null);
  const [eventData, setEventData] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    const fetchArtistData = async () => {
      try {
        setIsLoading(true);
        const data = await getArtistById(id);
        setArtistData(data);

        const dataEvents = await getEventsByArtist(id);
        console.log("Eventos del artista:", dataEvents);
        setEventData(dataEvents);
      } catch (error) {
        showAlert({
          type: "error",
          message: "Error al cargar los datos del artista.",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchArtistData();
  }, [id]);

  const handleFollow = async () => {
    const userId = useAuthStore.getState().userId;
    if (!userId) {
      showAlert({
        type: "error",
        message: "Debes iniciar sesión para seguir a un artista.",
      });
      return;
    }


    try {
      if (isFollowing) {
        await unfollowArtist(userId, id);
        setArtistData((prev) => ({
          ...prev,
          followers: prev.followers - 1,
        }));
        showAlert({
          type: "info",
          message: "Dejaste de seguir a este artista.",
        });
      } else {
        await followArtist(userId, id);
        setArtistData((prev) => ({
          ...prev,
          followers: prev.followers + 1,
        }));
        showAlert({
          type: "success",
          message: "Ahora sigues a este artista 🎉",
        });
      }
      setIsFollowing((prev) => !prev);
    } catch (error) {
      console.error("Error al seguir/dejar de seguir:", error);
      showAlert({ type: "error", message: "Algo salió mal" });
    }
  };

  return (
    <>
      <Navbar />
      <Alert
        type={alert.type}
        message={alert.message}
        isVisible={alert.isVisible}
        onClose={hideAlert}
      />

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
              style={{
                backgroundImage: `url(${
                  artistData?.profileBanner || "/placeholder.svg"
                })`,
              }}
            >
              <div className="h-full w-full bg-black bg-opacity-30 flex items-end">
                <div className="container mx-auto px-4 pb-20">
                  <h1 className="text-white text-3xl font-bold drop-shadow-lg">
                    {artistData.artisticName}
                  </h1>
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
                        src={artistData?.profileImage || "/placeholder.svg"}
                        alt={artistData?.artisticName}
                        className="w-32 h-32 rounded-full border-4 border-white object-cover"
                      />
                    </div>
                  </div>

                  {/* Artist Details */}
                  <div className="md:ml-6 flex-1 text-center md:text-left">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                      <div>
                        <h1 className="text-2xl font-bold text-[#2E1A47] flex items-center justify-center md:justify-start">
                          {artistData?.artisticName}
                        </h1>
                      </div>
                      <button
                        className={`mt-4 md:mt-0 px-6 py-2 rounded-lg transition-colors ${
                          isFollowing
                            ? "bg-gray-300 text-black hover:bg-gray-400"
                            : "bg-[#5C3D8D] text-white hover:bg-[#2E1A47]"
                        }`}
                        onClick={handleFollow}
                      >
                        {isFollowing ? "Siguiendo" : "Seguir"}
                      </button>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4 mt-3">
                      <div className="flex items-center">
                        <Users className="h-4 w-4 text-gray-500 mr-1" />
                        <span className="text-sm text-gray-500">
                          {artistData?.followers} seguidores
                        </span>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 text-gray-500 mr-1" />
                        <span className="text-sm text-gray-500">
                          {eventData.length} próximos eventos
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bio */}
                <div className="mt-6 border-t border-gray-100 pt-6">
                  <h3 className="text-lg font-semibold text-[#2E1A47] mb-2">
                    Biografía
                  </h3>
                  <p className="text-gray-700">
                    {showFullBio
                      ? artistData.artistDescription
                      : `${artistData.artistDescription.substring(0, 250)}...`}
                  </p>
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
              <div className="bg-white rounded-xl shadow-md overflow-hidden p-4">
                {/* Próximos Eventos */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-[#2E1A47] mb-4">
                    Próximos Eventos
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {eventData.map((event) => (
                      <motion.div
                        key={event.eventId}
                        className="border border-gray-100 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                      >
                        <img
                          src={event.eventCoverImage || "/placeholder.svg"}
                          alt={event.eventName}
                          className="w-full h-32 object-cover"
                        />
                        <div className="p-3">
                          <h4 className="font-medium text-[#2E1A47]">
                            {event.eventName}
                          </h4>
                          <div className="flex items-center text-sm text-gray-500 mt-1">
                            <Calendar className="h-4 w-4 mr-1" />
                            {new Date(event.startDate).toLocaleString()}
                          </div>
                          <div className="flex items-center text-sm text-gray-500 mt-1">
                            <MapPin className="h-4 w-4 mr-1" />
                            {event.locationName}
                          </div>
                          <Button
                            onPress={() => navigate(`/events/${event.eventId}`)}
                            className="mt-3 w-full py-1.5 bg-[#5C3D8D] text-white text-sm rounded-lg hover:bg-[#2E1A47] transition-colors"
                          >
                            Ver detalles
                          </Button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      <Footer />
    </>
  );
};

export default ArtistPublicProfile;
