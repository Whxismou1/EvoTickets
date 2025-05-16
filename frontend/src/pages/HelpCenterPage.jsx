"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from "@heroui/button";
import Nav from "../components/Navbar";
import Footer from "../components/Footer";
import useAlert from "../hooks/useAlert";
import Alert from "../components/Alert";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function HelpCenterPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { alert, showAlert, hideAlert } = useAlert();
  const [expandedCategories, setExpandedCategories] = useState({
    general: true,
    tickets: false,
    account: false
  });
  const [expandedQuestions, setExpandedQuestions] = useState({});

  const toggleCategory = (categoryId) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  };

  const toggleQuestion = (questionId) => {
    setExpandedQuestions(prev => ({
      ...prev,
      [questionId]: !prev[questionId]
    }));
  };

  const handleContactSupport = () => {
    showAlert({ 
      type: 'success', 
      message: t("helpCenter.contactRedirectMessage") 
    });
    navigate("/support");
  };

  // Obtener categorías de las traducciones
  const faqCategories = [
    {
      id: "general",
      title: t("helpCenter.categories.general.title"),
      faqs: t("helpCenter.categories.general.questions", { returnObjects: true })
    },
    {
      id: "tickets",
      title: t("helpCenter.categories.tickets.title"),
      faqs: t("helpCenter.categories.tickets.questions", { returnObjects: true })
    },
    {
      id: "account",
      title: t("helpCenter.categories.account.title"),
      faqs: t("helpCenter.categories.account.questions", { returnObjects: true })
    }
  ];

  return (
    <>
      <Nav />
      <Alert
        type={alert.type}
        message={alert.message}
        isVisible={alert.isVisible}
        onClose={hideAlert}
      />
      
      <div className="min-h-screen bg-[#F9F7FD] pt-24 pb-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-[#2E1A47] mb-4">
              {t("helpCenter.pageTitle")}
            </h1>
            <p className="text-[#5C3D8D] max-w-2xl mx-auto">
              {t("helpCenter.pageDescription")}
            </p>
          </div>

          {/* FAQs por categoría */}
          <div className="bg-white rounded-xl shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold text-[#2E1A47] mb-6">
              {t("helpCenter.faqTitle")}
            </h2>
            
            {faqCategories.map((category) => (
              <div key={category.id} className="mb-4 border border-[#A28CD4]/20 rounded-lg overflow-hidden">
                <button
                  className="w-full flex items-center justify-between p-4 text-left bg-[#F3F0FA]"
                  onClick={() => toggleCategory(category.id)}
                >
                  <span className="font-medium text-[#2E1A47]">{category.title}</span>
                  {expandedCategories[category.id] ? (
                    <ChevronUp className="h-5 w-5 text-[#5C3D8D]" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-[#5C3D8D]" />
                  )}
                </button>
                
                {expandedCategories[category.id] && (
                  <div className="p-4">
                    {category.faqs.map((faq, index) => (
                      <div key={index} className="mb-3 last:mb-0">
                        <button
                          className="w-full flex items-center justify-between p-3 text-left border border-[#A28CD4]/20 rounded-lg hover:bg-[#F9F7FD]"
                          onClick={() => toggleQuestion(`${category.id}-${index}`)}
                        >
                          <span className="font-medium text-[#2E1A47]">{faq.question}</span>
                          {expandedQuestions[`${category.id}-${index}`] ? (
                            <ChevronUp className="h-4 w-4 text-[#5C3D8D]" />
                          ) : (
                            <ChevronDown className="h-4 w-4 text-[#5C3D8D]" />
                          )}
                        </button>
                        
                        {expandedQuestions[`${category.id}-${index}`] && (
                          <div className="mt-2 p-3 bg-[#F9F7FD] rounded-lg text-[#5C3D8D]">
                            {faq.answer}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Contacto */}
          <div className="bg-white rounded-xl shadow-md p-6 text-center">
            <h2 className="text-xl font-semibold text-[#2E1A47] mb-2">
              {t("helpCenter.contactTitle")}
            </h2>
            <p className="text-[#5C3D8D] mb-4">
              {t("helpCenter.contactDescription")}
            </p>
            <Button 
              onClick={handleContactSupport}
              className="bg-[#5C3D8D] hover:bg-[#2E1A47] text-white"
            >
              {t("helpCenter.contactButton")}
            </Button>
          </div>
        </div>
      </div>
      
      <Footer />
    </>
  );
}