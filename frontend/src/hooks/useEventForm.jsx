"use client"

import { useState } from "react"
import { useAlert } from "../context/AlertContext"

export const useEventForm = () => {
  const { error, success, info } = useAlert()

  // Estado para controlar qué secciones están abiertas
  const [openSection, setOpenSection] = useState("basic")
  const [completedSections, setCompletedSections] = useState({})

  // Estado para los datos del evento
  const [eventData, setEventData] = useState({
    title: "",
    category: "",
    description: "",
    longDescription: "",
    location: "",
    address: "",
    date: "",
    endDate: "",
    dateToBeConfirmed: false,
    endDateToBeConfirmed: false,
    image: null,
    organizer: "",
    website: "",
    minimumAge: "",
    capacity: "",
    highlights: [""],
    hasSeating: false,
    artists: [],
    previousEvents: [{ year: "", images: [] }],
    faqs: [{ question: "", answer: "" }],
    ticketTypes: [{ name: "", price: "", description: "", limit: "" }],
    seatingMap: {
      sections: [],
      rows: 0,
      columns: 0,
    },
  })

  // Validación de secciones - solo se usa al guardar el evento
  const validateSection = (section) => {
    let isValid = true

    switch (section) {
      case "basic":
        isValid = !!(
          eventData.title &&
          eventData.category &&
          eventData.description &&
          eventData.location &&
          (eventData.date || eventData.dateToBeConfirmed) &&
          eventData.image
        )
        break
      case "details":
        isValid = !!(eventData.longDescription && eventData.highlights.length > 0 && eventData.highlights[0] !== "")
        break
      case "artists":
        isValid = !!(eventData.artists.length > 0 && eventData.artists[0]?.name)
        break
      case "gallery":
        // Opcional, siempre válido
        isValid = true
        break
      case "faqs":
        // Opcional, siempre válido
        isValid = true
        break
      case "tickets":
        isValid = !!(
          eventData.ticketTypes.length > 0 &&
          eventData.ticketTypes[0]?.name &&
          eventData.ticketTypes[0]?.price
        )
        break
      case "seating":
        // Solo validar si hasSeating es true
        if (eventData.hasSeating) {
          isValid = eventData.seatingMap.sections.length > 0
        } else {
          // Si no tiene asientos asignados, esta sección siempre es válida
          isValid = true
        }
        break
      default:
        isValid = false
    }

    return isValid
  }

  // Marcar una sección como completada sin validación
  const markSectionAsCompleted = (section) => {
    setCompletedSections((prev) => ({ ...prev, [section]: true }))
    return true
  }

  // Simplemente cambiar entre secciones sin validación
  const toggleSection = (section) => {
    setOpenSection(section)
  }

  // Validar todas las secciones solo al guardar
  const validateAllSections = () => {
    let allSectionsValid = true
    let firstInvalidSection = null
    const sections = ["basic", "details", "artists", "gallery", "faqs", "tickets"]

    // Solo incluir "seating" si hasSeating es true
    if (eventData.hasSeating) {
      sections.push("seating")
    }

    // Validar cada sección
    for (const section of sections) {
      const isValid = validateSection(section)

      if (isValid) {
        setCompletedSections((prev) => ({ ...prev, [section]: true }))
      } else {
        allSectionsValid = false
        if (!firstInvalidSection) {
          firstInvalidSection = section
        }
      }
    }

    // Si hay secciones inválidas, mostrar mensaje y abrir la primera sección inválida
    if (!allSectionsValid) {
      let errorMessage = "Por favor, completa todas las secciones obligatorias"

      switch (firstInvalidSection) {
        case "basic":
          errorMessage =
            "Por favor, completa todos los campos básicos obligatorios (título, categoría, descripción, ubicación, fecha e imagen)"
          break
        case "details":
          errorMessage = "Por favor, añade una descripción detallada y al menos un destacado"
          break
        case "artists":
          errorMessage = "Por favor, añade al menos un artista"
          break
        case "tickets":
          errorMessage = "Por favor, añade al menos un tipo de entrada con nombre y precio"
          break
        case "seating":
          errorMessage = "Por favor, añade al menos una zona de asientos"
          break
      }

      error(errorMessage)
      setOpenSection(firstInvalidSection)
    }

    return allSectionsValid
  }

  const handleSubmit = (e) => {
    if (e) e.preventDefault()
    return validateAllSections()
  }

  return {
    eventData,
    setEventData,
    openSection,
    completedSections,
    toggleSection,
    markSectionAsCompleted,
    validateSection,
    handleSubmit,
  }
}
