"use client"

// Modificar el componente AccordionSection para que no valide al abrir/cerrar
import { ChevronDown, ChevronUp } from "lucide-react"

const AccordionSection = ({ title, icon, isOpen, toggleOpen, isCompleted, children }) => {
  return (
    <div className={`border rounded-lg mb-4 ${isCompleted ? "border-green-200" : "border-[#A28CD4]/20"}`}>
      <div
        className={`flex items-center justify-between p-4 cursor-pointer ${isOpen ? "bg-[#F3F0FA]" : "bg-white"}`}
        onClick={() => toggleOpen()}
      >
        <div className="flex items-center">
          {icon}
          <h2 className="ml-2 font-medium text-[#2E1A47]">{title}</h2>
          {isCompleted && (
            <span className="ml-2 bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
              Completado
            </span>
          )}
        </div>
        <div className="text-[#5C3D8D]">
          {isOpen ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
        </div>
      </div>
      {isOpen && <div className="p-4 border-t border-[#A28CD4]/20">{children}</div>}
    </div>
  )
}

export default AccordionSection
