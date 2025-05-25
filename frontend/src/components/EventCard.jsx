"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import { Calendar, MapPin, Heart } from "lucide-react"
import { formatDate } from "../utils/dateUtils"

export default function EventCard({ event, compact = false }) {
  const [isLiked, setIsLiked] = useState(event.isLiked || false)

  const toggleLike = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsLiked(!isLiked)
  }

  if (compact) {
    return (
      <Link to={`/events/${event.id}`} className="block h-full">
        <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow h-full overflow-hidden">
          <div className="relative h-40">
            <img src={event.image || "/placeholder.svg"} alt={event.name} className="w-full h-full object-cover" />
            <button
              onClick={toggleLike}
              className="absolute top-2 right-2 p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors"
            >
              <Heart className={`h-4 w-4 ${isLiked ? "fill-red-500 text-red-500" : "text-gray-600"}`} />
            </button>
          </div>
          <div className="p-3">
            <h3 className="font-semibold text-[#2E1A47] text-sm line-clamp-1">{event.name}</h3>
            <div className="flex items-center text-xs text-[#5C3D8D] mt-1">
              <Calendar className="h-3 w-3 mr-1" /> {formatDate(event.date)}
            </div>
          </div>
        </div>
      </Link>
    )
  }

  return (
    <Link to={`/events/${event.id}`} className="block h-full">
      <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow h-full overflow-hidden">
        <div className="relative h-48">
          <img src={event.image || "/placeholder.svg"} alt={event.name} className="w-full h-full object-cover" />
          <button
            onClick={toggleLike}
            className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors"
          >
            <Heart className={`h-4 w-4 ${isLiked ? "fill-red-500 text-red-500" : "text-gray-600"}`} />
          </button>
          {event.featured && (
            <div className="absolute top-3 left-3 bg-[#D7A6F3] text-[#2E1A47] text-xs font-medium px-2 py-1 rounded-md">
              Destacado
            </div>
          )}
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-[#2E1A47] mb-2">{event.name}</h3>
          <div className="flex items-center text-sm text-[#5C3D8D] mb-2">
            <Calendar className="h-4 w-4 mr-1" /> {formatDate(event.date)}
          </div>
          <div className="flex items-center text-sm text-[#5C3D8D]">
            <MapPin className="h-4 w-4 mr-1" /> {event.location}
          </div>
          <div className="mt-3 flex justify-between items-center">
            <span className="font-bold text-[#2E1A47]">{event.price ? `${event.price}€` : "Gratis"}</span>
            <span className="text-xs bg-[#5C3D8D]/10 text-[#5C3D8D] px-2 py-1 rounded">{event.category}</span>
          </div>
        </div>
      </div>
    </Link>
  )
}
