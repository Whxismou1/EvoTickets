"use client"

import { ChevronDown, ChevronUp, Check } from "lucide-react"

const AccordionSection = ({ title, icon, isOpen, toggleOpen, children, isCompleted = false }) => {
  return (
    <div className="mb-4 border border-[#A28CD4]/30 rounded-lg overflow-hidden bg-white">
      <button
        className="w-full flex items-center justify-between p-4 text-left bg-white hover:bg-[#F3F0FA] transition-colors"
        onClick={toggleOpen}
      >
        <div className="flex items-center">
          <div className={`p-2 rounded-full mr-3 ${isCompleted ? "bg-green-100" : "bg-[#5C3D8D]/10"}`}>
            {isCompleted ? <Check className="h-5 w-5 text-green-600" /> : icon}
          </div>
          <span className="font-semibold text-[#2E1A47]">{title}</span>
        </div>
        <div className="flex items-center">
          {isCompleted && <span className="text-green-600 text-sm mr-2">Completado</span>}
          {isOpen ? (
            <ChevronUp className="h-5 w-5 text-[#5C3D8D]" />
          ) : (
            <ChevronDown className="h-5 w-5 text-[#5C3D8D]" />
          )}
        </div>
      </button>
      {isOpen && <div className="p-4 border-t border-[#A28CD4]/30 bg-white">{children}</div>}
    </div>
  )
}

export default AccordionSection
