import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@heroui/button";
import { Menu, Moon, Sun, Ticket, X, User, Bell, Settings, LogOut } from 'lucide-react';
import { useTheme } from "../context/ThemeContext";
import { useTranslation } from "react-i18next";
import { useAuthStore } from "../store/authStore"
const languages = [
  { code: "es", name: "Español", flag: "https://flagcdn.com/es.svg" },
  { code: "en", name: "English", flag: "https://flagcdn.com/gb.svg" },
];

export default function Navbar({ isAuthenticated = false }) {
  const navigate = useNavigate();
  const { logout } = useAuthStore();
  const { t, i18n } = useTranslation();
  const { theme, setTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const location = useLocation();
  const isEventsPage = location.pathname === '/events';

  const currentLangCode = i18n.language || "es";
  const currentLanguage = languages.find((l) => l.code === currentLangCode) || languages[0];

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleLanguageMenu = () => setIsLanguageMenuOpen(!isLanguageMenuOpen);
  const toggleUserMenu = () => setIsUserMenuOpen(!isUserMenuOpen);

  const changeLanguage = (language) => {
    i18n.changeLanguage(language.code);
    setIsLanguageMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#F3F0FA]/80 backdrop-blur-md border-b border-[#A28CD4]/20">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <Ticket className="h-8 w-8 text-[#5C3D8D]" />
          <span className="text-xl font-bold bg-gradient-to-r from-[#5C3D8D] to-[#A28CD4] text-transparent bg-clip-text">
            EvoTickets
          </span>
        </Link>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-4">
          {!isEventsPage && (
            <Link to="/events" className="text-[#2E1A47] hover:text-[#5C3D8D] transition-colors">
              {t("events")}
            </Link>
          )}

          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-2 rounded-full hover:bg-[#A28CD4]/10"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? (
              <Sun className="h-5 w-5 text-[#5C3D8D]" />
            ) : (
              <Moon className="h-5 w-5 text-[#5C3D8D]" />
            )}
          </button>

          {/* Language Dropdown */}
          <div className="relative">
            <button
              onClick={toggleLanguageMenu}
              className="flex items-center gap-2 p-2 rounded-full hover:bg-[#A28CD4]/10"
              aria-label="Select language"
            >
              <img
                src={currentLanguage.flag || "/placeholder.svg"}
                alt={currentLanguage.name}
                className="w-5 h-5 rounded-full object-cover"
              />
              <span className="text-sm text-[#2E1A47]">
                {currentLanguage.code.toUpperCase()}
              </span>
            </button>

            {isLanguageMenuOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg py-1 z-50 border border-[#A28CD4]/20">
                {languages.map((language) => (
                  <button
                    key={language.code}
                    onClick={() => changeLanguage(language)}
                    className="flex items-center gap-2 w-full px-4 py-2 text-left hover:bg-[#A28CD4]/10"
                  >
                    <img
                      src={language.flag || "/placeholder.svg"}
                      alt={language.name}
                      className="w-5 h-5 rounded-full object-cover"
                    />
                    <span className="text-sm text-[#2E1A47]">
                      {language.name}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={toggleUserMenu}
                className="flex items-center justify-center w-10 h-10 rounded-full bg-[#5C3D8D]/10 hover:bg-[#5C3D8D]/20 transition-colors"
                aria-label="User menu"
              >
                <User className="h-5 w-5 text-[#5C3D8D]" />
              </button>

              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-[#A28CD4]/20">
                  <Link
                    to="/profile?tab=info"
                    className="flex items-center gap-2 w-full px-4 py-2 text-left hover:bg-[#A28CD4]/10"
                    onClick={() => setIsUserMenuOpen(false)}
                  >
                    <User className="h-4 w-4 text-[#5C3D8D]" />
                    <span className="text-sm text-[#2E1A47]">
                      {t("navBar.my_profile")}
                    </span>
                  </Link>
                  <Link
                    to="/profile?tab=tickets"
                    className="flex items-center gap-2 w-full px-4 py-2 text-left hover:bg-[#A28CD4]/10"
                    onClick={() => setIsUserMenuOpen(false)}
                  >
                    <Ticket className="h-4 w-4 text-[#5C3D8D]" />
                    <span className="text-sm text-[#2E1A47]">{t("navBar.my_events")}</span>
                  </Link>
                  <Link
                    to="/profile?tab=settings"
                    className="flex items-center gap-2 w-full px-4 py-2 text-left hover:bg-[#A28CD4]/10"
                    onClick={() => setIsUserMenuOpen(false)}
                  >
                    <Settings className="h-4 w-4 text-[#5C3D8D]" />
                    <span className="text-sm text-[#2E1A47]">{t("navBar.settings")}</span>
                  </Link>
                  <Link
                    className="flex items-center gap-2 w-full px-4 py-2 text-left hover:bg-[#A28CD4]/10 border-t border-[#A28CD4]/20 mt-1 pt-1"
                    onClick={() => {
                      logout();
                      navigate("/login");
                    }}
                  >
                    <LogOut className="h-4 w-4 text-red-500" />
                    <span className="text-sm text-red-500">{t("navBar.close_session")}</span>
                  </Link>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/login">
                <Button
                  variant="outline"
                  className="border-[#A28CD4] text-[#5C3D8D] hover:bg-[#A28CD4]/10"
                >
                  {t("login")}
                </Button>
              </Link>
              <Link to="/register">
                <Button className="bg-[#5C3D8D] hover:bg-[#2E1A47] text-white">
                  {t("signup")}
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 rounded-md hover:bg-[#A28CD4]/10"
          onClick={toggleMenu}
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        >
          {isMenuOpen ? (
            <X className="h-6 w-6 text-[#5C3D8D]" />
          ) : (
            <Menu className="h-6 w-6 text-[#5C3D8D]" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-b border-[#A28CD4]/20">
          <nav className="container mx-auto px-4 py-4 flex flex-col gap-4">
            {!isEventsPage && (
              <Link
                to="/events"
                className="text-[#2E1A47] hover:text-[#5C3D8D] transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                {t("events")}
              </Link>
            )}
            <div className="flex items-center gap-4 py-2">
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="p-2 rounded-full hover:bg-[#A28CD4]/10"
                aria-label="Toggle theme"
              >
                {theme === "dark" ? (
                  <Sun className="h-5 w-5 text-[#5C3D8D]" />
                ) : (
                  <Moon className="h-5 w-5 text-[#5C3D8D]" />
                )}
              </button>

              <div className="flex items-center gap-2">
                {languages.map((language) => (
                  <button
                    key={language.code}
                    onClick={() => changeLanguage(language)}
                    className={`flex items-center gap-1 p-1 rounded ${currentLanguage.code === language.code
                      ? "bg-[#A28CD4]/20"
                      : "hover:bg-[#A28CD4]/10"
                      }`}
                  >
                    <img
                      src={language.flag || "/placeholder.svg"}
                      alt={language.name}
                      className="w-5 h-5 rounded-full object-cover"
                    />
                    <span className="text-xs text-[#2E1A47]">
                      {language.code.toUpperCase()}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {isAuthenticated ? (
              <div className="flex flex-col gap-2 py-2">
                <Link
                  to="/profile?tab=info"
                  className="flex items-center gap-2 py-2 text-[#2E1A47] hover:text-[#5C3D8D]"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <User className="h-5 w-5" />
                  Mi Perfil
                </Link>
                <Link
                  to="/profile?tab=tickets"
                  className="flex items-center gap-2 py-2 text-[#2E1A47] hover:text-[#5C3D8D]"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Ticket className="h-5 w-5" />
                  Mis Eventos
                </Link>
                <Link
                  to="/profile?tab=settings"
                  className="flex items-center gap-2 py-2 text-[#2E1A47] hover:text-[#5C3D8D]"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Settings className="h-5 w-5" />
                  Ajustes
                </Link>
                <Button

                  className="flex items-center gap-2 w-full px-4 py-2 text-left hover:bg-[#A28CD4]/10 border-t border-[#A28CD4]/20 mt-1 pt-1"
                  onClick={() => {
                    logout();
                    navigate("/login");
                  }}
                >

                  <LogOut className="h-5 w-5" />
                  Cerrar Sesión
                </Button>
              </div>
            ) : (
              <div className="flex gap-2 py-2">
                <Link
                  to="/login"
                  className="flex-1"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Button
                    variant="outline"
                    className="w-full border-[#A28CD4] text-[#5C3D8D] hover:bg-[#A28CD4]/10"
                  >
                    {t("login")}
                  </Button>
                </Link>
                <Link
                  to="/register"
                  className="flex-1"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Button className="w-full bg-[#5C3D8D] hover:bg-[#2E1A47] text-white">
                    {t("signup")}
                  </Button>
                </Link>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
