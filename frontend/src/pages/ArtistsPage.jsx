"use client";

import { motion } from "framer-motion";
import { Music, Search, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Alert from "../components/Alert";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import useAlert from "../hooks/useAlert";
import { getAllArtists } from "../services/artistService";
import { useAuthStore } from "../store/authStore";
import {
  followArtist,
  unfollowArtist,
  getUserById,
} from "../services/userService";

const ArtistsPage = () => {
  const { alert, showAlert, hideAlert } = useAlert();
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [artists, setArtists] = useState([]);
  const [followStates, setFollowStates] = useState({});

  // useEffect(() => {
  //   const fetchArtists = async () => {
  //     try {
  //       const data = await getAllArtists();

  //       const transformed = data.map((artist) => ({
  //         id: artist.id,
  //         name: artist.artisticName,
  //         followers: Math.floor(Math.random() * 10000 + 1000),
  //         image: artist.profileImage || "/placeholder.svg?height=300&width=300",
  //       }));

  //       setArtists(transformed);
  //     } catch (err) {
  //       console.error("Error cargando artistas:", err);
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };

  //   fetchArtists();
  // }, []);

  // useEffect(() => {
  //   const fetchUserFollowed = async () => {
  //     const currentUser = useAuthStore.getState().userId;
  //     try {
  //       const user = await getUserById(currentUser);
  //       setFollowedArtistIds(user.followedArtistIds || []);
  //     } catch (err) {
  //       console.error("Error cargando usuario:", err);
  //     }
  //   };

  //   fetchUserFollowed();
  // }, [currentUser.id]);

  useEffect(() => {
    const fetchArtistsAndFollows = async () => {
      try {
        const userId = useAuthStore.getState().userId;
        const [user, artistData] = await Promise.all([
          getUserById(userId),
          getAllArtists(),
        ]);

        const transformed = artistData.map((artist) => ({
          id: artist.id,
          name: artist.artisticName,
          followers: artist.followers,
          image: artist.profileImage || "/placeholder.svg?height=300&width=300",
        }));

        setArtists(transformed);

        const initialFollowStates = {};
        transformed.forEach((artist) => {
          initialFollowStates[artist.id] = user.followedArtistIds.includes(
            artist.id
          );
        });
        setFollowStates(initialFollowStates);
      } catch (err) {
        console.error("Error cargando datos:", err);
        showAlert({
          type: "error",
          message: "No se pudieron cargar los artistas",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchArtistsAndFollows();
  }, []);

  const handleFollow = async (artistId, isFollowing, setFollowStates) => {
    const userId = useAuthStore.getState().userId;
    console.log("User ID:", userId);
    try {
      if (isFollowing) {
        await unfollowArtist(userId, artistId);

        setArtists((prev) =>
          prev.map((artist) =>
            artist.id === artistId
              ? { ...artist, followers: artist.followers - 1 }
              : artist
          )
        );

        showAlert({
          type: "info",
          message: "Dejaste de seguir a este artista.",
        });
      } else {
        await followArtist(userId, artistId);
        setArtists((prev) =>
          prev.map((artist) =>
            artist.id === artistId
              ? { ...artist, followers: artist.followers + 1 }
              : artist
          )
        );
        showAlert({
          type: "success",
          message: "Ahora sigues a este artista 🎉",
        });
      }
      //Actualizar artistas

      setFollowStates((prev) => ({
        ...prev,
        [artistId]: !isFollowing,
      }));
    } catch (error) {
      console.error("Error al seguir/dejar de seguir:", error);
      showAlert({ type: "error", message: "Algo salió mal" });
    }
  };

  const filteredArtists = artists.filter((artist) => {
    const matchesSearch = artist.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  return (
    <>
      <Navbar />
      <Alert
        type={alert.type}
        message={alert.message}
        isVisible={alert.isVisible}
        onClose={hideAlert}
      />

      <div className="min-h-screen bg-gray-50 mt-16">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-[#2E1A47] mb-2">
              Descubre Artistas
            </h1>
            <p className="text-gray-600">
              Explora y conecta con tus artistas favoritos
            </p>
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
            </div>
          </div>

          {/* Artists Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="animate-pulse bg-white rounded-xl shadow-md overflow-hidden"
                >
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
                  </Link>

                  <div className="p-4">
                    <Link to={`/artists/${artist.id}`}>
                      <div className="flex items-center mb-2">
                        <h3 className="text-lg font-semibold text-[#2E1A47]">
                          {artist.name}
                        </h3>
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
                    </Link>
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex items-center text-sm text-gray-500">
                        <Users className="h-4 w-4 mr-1" />
                        {artist.followers.toLocaleString()} seguidores
                      </div>
                    </div>

                    <button
                      className={`w-full py-2 mt-2 rounded-lg transition-colors ${
                        followStates[artist.id]
                          ? "bg-gray-300 text-black"
                          : "bg-[#5C3D8D] text-white hover:bg-[#2E1A47]"
                      }`}
                      onClick={() =>
                        handleFollow(
                          artist.id,
                          followStates[artist.id],
                          setFollowStates
                        )
                      }
                    >
                      {followStates[artist.id] ? "Siguiendo" : "Seguir"}
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <Music className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-[#2E1A47] mb-2">
                No se encontraron artistas
              </h3>
              <p className="text-gray-500 max-w-md mx-auto">
                No hay artistas que coincidan con tu búsqueda. Intenta con otros
                términos o filtros.
              </p>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
};

export default ArtistsPage;
