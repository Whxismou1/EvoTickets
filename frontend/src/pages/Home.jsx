"use client";

import { motion } from "framer-motion";
import { Calendar, ChevronRight, Clock, MapPin, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, Link } from "react-router-dom";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { getAllEvents } from "../services/eventService";
import { useAuthStore } from "../store/authStore";
import { getUserById } from "../services/userService";
import { getArtistById } from "../services/artistService";

export default function HomePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [followedArtists, setFollowedArtists] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setIsLoading(true);

        const rawEvents = await getAllEvents();
        const mappedEvents = rawEvents.map((event) => ({
          id: event.id,
          title: event.name,
          location: event.location?.name || "Ubicación no disponible",
          date: event.startDate,
          image:
            event.coverImage || event.photos?.[0]?.url || "/placeholder.svg",
          category: event.category?.toLowerCase() || "otros",
        }));

        setEvents(mappedEvents);
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, []);

  useEffect(() => {
    const fetchFollowedArtists = async () => {
      const userId = useAuthStore.getState().userId;

      try {
        const user = await getUserById(userId);
        console.log("User data:", user);
        const artistIds = user.followedArtistIds || [];

        const artists = await Promise.all(
          artistIds.map(async (id) => {
            try {
              const artist = await getArtistById(id);
              return artist;
            } catch (e) {
              console.error(`Error fetching artist ${id}`, e);
              return null;
            }
          })
        );

        setFollowedArtists(artists.filter(Boolean));
      } catch (error) {
        console.error("Error fetching followed artists", error);
      }
    };

    fetchFollowedArtists();
  }, []);

  return (
    <>
      <Navbar isAuthenticated={true} />
      <main className="min-h-screen bg-[#F3F0FA] pt-16">
        {/* Welcome Banner */}
        <section className="bg-gradient-to-r from-[#5C3D8D] to-[#2E1A47] py-8 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="mb-4 md:mb-0">
                <h1 className="text-2xl md:text-3xl font-bold text-white">
                  {t("home.welcome")}
                </h1>
                <p className="text-[#D7A6F3]">{t("home.discover")}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Upcoming Events */}
        <section className="py-6 px-4 bg-white">
          <div className="container mx-auto max-w-6xl">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-[#5C3D8D]" />
                <h2 className="text-xl font-bold text-[#2E1A47]">
                  {t("home.next_events")}
                </h2>
              </div>
              <button
                onClick={() => navigate("/events")}
                className="text-[#5C3D8D] hover:text-[#2E1A47] text-sm flex items-center"
              >
                {"Ver todos"} <ChevronRight size={16} />
              </button>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="bg-[#F3F0FA]/50 animate-pulse rounded-lg h-32"
                  ></div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {events.slice(0, 4).map((event) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 * event.id }}
                    className="bg-[#F3F0FA] rounded-lg hover:shadow-md transition-shadow p-4 flex"
                  >
                    <div className="w-16 h-16 bg-[#5C3D8D]/10 rounded-lg flex flex-col items-center justify-center text-[#5C3D8D] mr-4 flex-shrink-0">
                      <span className="text-lg font-bold">
                        {new Date(event.date).getDate()}
                      </span>
                      <span className="text-xs">
                        {new Date(event.date).toLocaleString("default", {
                          month: "short",
                        })}
                      </span>
                    </div>
                    <div className="flex-grow">
                      <h3 className="font-semibold text-[#2E1A47] mb-1">
                        {event.title}
                      </h3>
                      <div className="flex items-center text-sm text-[#5C3D8D] mb-1">
                        <MapPin className="h-3 w-3 mr-1" /> {event.location}
                      </div>
                      <div className="flex items-center text-sm text-[#5C3D8D]">
                        <Clock className="h-3 w-3 mr-1" />{" "}
                        {new Date(event.date).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </div>
                    <Link
                      to={`/events/${event.id}`}
                      className="self-center ml-2 px-3 py-1 bg-[#5C3D8D]/10 text-[#5C3D8D] rounded-md hover:bg-[#5C3D8D]/20 transition-colors text-sm"
                    >
                      {t("home.see")}
                    </Link>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Artistas que sigues */}
        <section className="py-6 px-4 bg-white">
          <div className="container mx-auto max-w-6xl">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-[#5C3D8D]" />
                <h2 className="text-xl font-bold text-[#2E1A47]">
                  {t("home.followed_artist")}
                </h2>
              </div>
              <button
                onClick={() => navigate("/artists")}
                className="text-[#5C3D8D] hover:text-[#2E1A47] text-sm flex items-center"
              >
                {t("home.see_all")} <ChevronRight size={16} />
              </button>
            </div>

            <div className="space-y-4">
              {isLoading ? (
                [1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="bg-[#F3F0FA]/50 animate-pulse rounded-lg h-16"
                  ></div>
                ))
              ) : followedArtists.length === 0 ? (
                <div className="text-[#5C3D8D] text-sm">
                  {t("home.no_followed_artists")}
                </div>
              ) : (
                followedArtists.map((artist, index) => (
                  <motion.div
                    key={artist.id}
                    className="bg-[#F3F0FA] rounded-lg p-4 flex items-center"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <div className="w-10 h-10 rounded-full bg-[#A28CD4] mr-3 flex-shrink-0 overflow-hidden">
                      <img
                        src={artist.profileImage || "/placeholder.svg"}
                        alt={artist.artisticName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-grow">
                      <p className="text-[#2E1A47] font-medium">
                        {artist.artisticName}
                      </p>
                      <p className="text-xs text-[#5C3D8D] line-clamp-2">
                        {artist.artistDescription}
                      </p>
                    </div>
                    <Link
                      to={`/artists/${artist.id}`}
                      className="px-3 py-1 bg-[#5C3D8D] text-white rounded-md hover:bg-[#2E1A47] transition-colors text-sm"
                    >
                      {t("home.visit_artist")}
                    </Link>
                  </motion.div>
                ))
              )}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
