"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { getAllEvents } from "../services/eventService";

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [eventsPerPage] = useState(6); // Número de eventos por página
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setIsLoading(true);
        const data = await getAllEvents();
        console.log(data);
        setEvents(data);
        setFilteredEvents(data);
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Filtrar eventos por nombre
  const handleSearch = (e) => {
    e.preventDefault();
    const filtered = events.filter((event) =>
      event.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredEvents(filtered);
    setCurrentPage(1); // Reiniciar a la primera página
  };

  // Paginación
  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents = filteredEvents.slice(indexOfFirstEvent, indexOfLastEvent);

  const totalPages = Math.ceil(filteredEvents.length / eventsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  return (
    <>
      <Navbar isAuthenticated={true} />
      <main className="min-h-screen bg-[#F3F0FA] pt-16">
        <section className="container mx-auto max-w-6xl px-4 py-8">
          <h1 className="text-3xl font-bold text-[#2E1A47] mb-6">Eventos</h1>

          {/* Barra de búsqueda */}
          <form onSubmit={handleSearch} className="flex items-center gap-4 mb-8">
            <Input
              placeholder="Buscar eventos por nombre..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-grow"
            />
            <Button
              type="submit"
              className="bg-[#5C3D8D] hover:bg-[#2E1A47] text-white"
              startContent={<Search size={18} />}
            >
              Buscar
            </Button>
          </form>

          {/* Lista de eventos */}
          {isLoading ? (
            <p className="text-center text-[#5C3D8D]">Cargando eventos...</p>
          ) : currentEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentEvents.map((event) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow"
                >
                  <div
                    className="h-40 bg-cover bg-center rounded-t-lg"
                    style={{
                      backgroundImage: `url(${event.image || "/placeholder.svg"})`,
                    }}
                  ></div>
                  <div className="p-4">
                    <h2 className="text-lg font-bold text-[#2E1A47] mb-2">{event.name}</h2>
                    <p className="text-sm text-[#5C3D8D] mb-4">{event.description.slice(0, 100)}...</p>
                    <Button
                      as="a"
                      href={`/events/${event.id}`}
                      className="bg-[#5C3D8D] hover:bg-[#2E1A47] text-white w-full"
                    >
                      Ver detalles
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <p className="text-center text-[#5C3D8D]">No se encontraron eventos.</p>
          )}

          {/* Controles de paginación */}
          {filteredEvents.length > eventsPerPage && (
            <div className="flex items-center justify-center gap-4 mt-8">
              <Button
                variant="light"
                className="text-[#5C3D8D] hover:bg-[#5C3D8D]/10"
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
              >
                <ChevronLeft size={18} />
              </Button>
              <span className="text-[#5C3D8D]">
                Página {currentPage} de {totalPages}
              </span>
              <Button
                variant="light"
                className="text-[#5C3D8D] hover:bg-[#5C3D8D]/10"
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
              >
                <ChevronRight size={18} />
              </Button>
            </div>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}