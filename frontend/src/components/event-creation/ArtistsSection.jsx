"use client"

import { useState, useRef } from "react"
import { Music, Plus, Trash2, Search, Users } from "lucide-react"
import { Button } from "@heroui/button"
import AccordionSection from "./AccordionSection"
import FormField from "./FormField"

// Datos de ejemplo para artistas
const mockArtists = [
  { id: 1, name: "Bad Bunny", genre: "Urbano", image: "/placeholder.svg" },
  { id: 2, name: "Rosalía", genre: "Flamenco/Pop", image: "/placeholder.svg" },
  { id: 3, name: "Coldplay", genre: "Rock/Pop", image: "/placeholder.svg" },
  { id: 4, name: "Dua Lipa", genre: "Pop", image: "/placeholder.svg" },
  { id: 5, name: "J Balvin", genre: "Reggaeton", image: "/placeholder.svg" },
  { id: 6, name: "Billie Eilish", genre: "Pop", image: "/placeholder.svg" },
]

const ArtistsSection = ({ isOpen, toggleOpen, isCompleted, onPrevious, onNext, eventData, setEventData }) => {
  const [artistSearchQuery, setArtistSearchQuery] = useState("")
  const artistImageRef = useRef(null)

  // Función para añadir un artista existente
  const addExistingArtist = (artist) => {
    const artistExists = eventData.artists.some((a) => a.id === artist.id)
    if (!artistExists) {
      setEventData({
        ...eventData,
        artists: [...eventData.artists, { ...artist, role: "", day: "", time: "", isNew: false }],
      })
    }
    setArtistSearchQuery("")
  }

  // Función para añadir un nuevo artista
  const addNewArtist = () => {
    if (artistSearchQuery.trim()) {
      setEventData({
        ...eventData,
        artists: [...eventData.artists, { name: artistSearchQuery, role: "", day: "", time: "", isNew: true }],
      })
      setArtistSearchQuery("")
    } else {
      setEventData({
        ...eventData,
        artists: [...eventData.artists, { name: "", role: "", day: "", time: "", isNew: true }],
      })
    }
  }

  // Función para eliminar un artista
  const removeArtist = (index) => {
    const newArtists = [...eventData.artists]
    newArtists.splice(index, 1)
    setEventData({ ...eventData, artists: newArtists })
  }

  const handleArtistChange = (index, field, value) => {
    const newArtists = [...eventData.artists]
    newArtists[index] = { ...newArtists[index], [field]: value }
    setEventData({ ...eventData, artists: newArtists })
  }

  const handleArtistImageUpload = (index, e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => {
        handleArtistChange(index, "image", reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <AccordionSection
      title="Artistas"
      icon={<Music className="h-5 w-5 text-[#5C3D8D]" />}
      isOpen={isOpen}
      toggleOpen={toggleOpen}
      isCompleted={isCompleted}
    >
      <div className="space-y-6">
        {/* Buscador de artistas existentes */}
        <div className="border border-[#A28CD4]/20 rounded-lg p-4">
          <h3 className="font-medium text-[#2E1A47] mb-4">Buscar artistas existentes</h3>
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#5C3D8D]/60 h-4 w-4" />
            <input
              type="text"
              placeholder="Buscar por nombre de artista..."
              className="w-full pl-10 px-3 py-2 border border-[#A28CD4]/30 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5C3D8D]/50"
              value={artistSearchQuery}
              onChange={(e) => setArtistSearchQuery(e.target.value)}
            />
          </div>

          {/* Lista de artistas sugeridos (simulados) */}
          {artistSearchQuery.length > 2 && (
            <div className="mb-4">
              <h4 className="text-sm font-medium text-[#5C3D8D] mb-2">Artistas encontrados:</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {mockArtists
                  .filter((artist) => artist.name.toLowerCase().includes(artistSearchQuery.toLowerCase()))
                  .slice(0, 4)
                  .map((artist, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => addExistingArtist(artist)}
                      className="flex items-center gap-2 p-2 border border-[#A28CD4]/30 rounded-md hover:bg-[#F3F0FA] transition-colors"
                    >
                      <div className="w-10 h-10 rounded-full bg-[#5C3D8D]/10 flex-shrink-0">
                        {artist.image ? (
                          <img
                            src={artist.image || "/placeholder.svg"}
                            alt={artist.name}
                            className="w-full h-full rounded-full object-cover"
                          />
                        ) : (
                          <Users className="w-6 h-6 m-2 text-[#5C3D8D]" />
                        )}
                      </div>
                      <div className="text-left">
                        <div className="font-medium text-[#2E1A47]">{artist.name}</div>
                        <div className="text-xs text-[#5C3D8D]">{artist.genre}</div>
                      </div>
                    </button>
                  ))}
              </div>
            </div>
          )}

          <div className="text-sm text-[#5C3D8D] mb-2">Si no encuentras el artista, puedes añadirlo manualmente:</div>
          <Button
            type="button"
            onClick={addNewArtist}
            className="w-full py-2 border border-[#A28CD4]/30 rounded-md flex items-center justify-center text-[#5C3D8D] hover:bg-[#F3F0FA] transition-colors"
          >
            <Plus className="h-4 w-4 mr-2" /> Añadir nuevo artista
          </Button>
        </div>

        {/* Lista de artistas seleccionados */}
        <h3 className="font-medium text-[#2E1A47] mb-2">Artistas seleccionados</h3>
        {eventData.artists.length === 0 ? (
          <div className="text-center py-8 border border-dashed border-[#A28CD4]/30 rounded-lg">
            <Music className="h-12 w-12 mx-auto text-[#A28CD4]/40 mb-2" />
            <p className="text-[#5C3D8D]">No hay artistas seleccionados</p>
            <p className="text-sm text-[#5C3D8D]/70">Busca o añade artistas para tu evento</p>
          </div>
        ) : (
          <div className="space-y-4">
            {eventData.artists.map((artist, index) => (
              <div key={index} className="border border-[#A28CD4]/20 rounded-lg p-4">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-[#5C3D8D]/10 flex-shrink-0 flex items-center justify-center">
                      {artist.image ? (
                        <img
                          src={artist.image || "/placeholder.svg"}
                          alt={artist.name}
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <Users className="w-6 h-6 text-[#5C3D8D]" />
                      )}
                    </div>
                    <h3 className="font-medium text-[#2E1A47]">{artist.name}</h3>
                    {artist.isNew && (
                      <span className="bg-[#5C3D8D]/10 text-[#5C3D8D] text-xs px-2 py-1 rounded-full">
                        Nuevo artista
                      </span>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => removeArtist(index)}
                    className="p-1 text-red-500 hover:bg-red-50 rounded-md"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField label="Rol" required>
                    <select
                      value={artist.role || ""}
                      onChange={(e) => handleArtistChange(index, "role", e.target.value)}
                      className="w-full px-3 py-2 border border-[#A28CD4]/30 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5C3D8D]/50"
                    >
                      <option value="">Selecciona un rol</option>
                      <option value="Headliner">Headliner</option>
                      <option value="Artista Principal">Artista Principal</option>
                      <option value="Artista Invitado">Artista Invitado</option>
                      <option value="Telonero">Telonero</option>
                      <option value="DJ">DJ</option>
                    </select>
                  </FormField>

                  <FormField label="Día de actuación" required={!eventData.dateToBeConfirmed}>
                    <input
                      type="text"
                      value={artist.day || ""}
                      onChange={(e) => handleArtistChange(index, "day", e.target.value)}
                      className="w-full px-3 py-2 border border-[#A28CD4]/30 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5C3D8D]/50"
                      placeholder="Ej. Sábado"
                      disabled={eventData.dateToBeConfirmed}
                    />
                  </FormField>

                  <FormField label="Horario" required={!eventData.dateToBeConfirmed}>
                    <input
                      type="text"
                      value={artist.time || ""}
                      onChange={(e) => handleArtistChange(index, "time", e.target.value)}
                      className="w-full px-3 py-2 border border-[#A28CD4]/30 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5C3D8D]/50"
                      placeholder="Ej. 22:30 - 00:00"
                      disabled={eventData.dateToBeConfirmed}
                    />
                  </FormField>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex justify-between mt-6">
        <Button type="button" variant="light" className="text-[#5C3D8D] hover:bg-[#5C3D8D]/10" onClick={onPrevious}>
          Volver a Detalles
        </Button>
        <Button type="button" className="bg-[#5C3D8D] hover:bg-[#2E1A47] text-white" onClick={onNext}>
          Siguiente: Galería
        </Button>
      </div>
    </AccordionSection>
  )
}

export default ArtistsSection
