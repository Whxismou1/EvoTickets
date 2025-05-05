import { render, screen, fireEvent } from "@testing-library/react";
import Navbar from "../components/Navbar";
import { describe, it, expect, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { ThemeContext } from "../context/ThemeContext";
import { I18nextProvider } from "react-i18next";
import i18n from "../i18n/config";
import "@testing-library/jest-dom";

const renderNavbar = (isAuthenticated = false) => {
  const themeMock = {
    theme: "light",
    setTheme: vi.fn(),
  };

  return render(
    <MemoryRouter>
      <I18nextProvider i18n={i18n}>
        <Navbar isAuthenticated={isAuthenticated} />
      </I18nextProvider>
    </MemoryRouter>
  );
};

describe("Navbar", () => {
  it("muestra los botones de login y signup si NO está autenticado", () => {
    renderNavbar(false);
    expect(screen.getByText(/Log In/i)).toBeInTheDocument();
    expect(screen.getByText(/Sign Up/i)).toBeInTheDocument();
  });

  it("muestra el icono de usuario si está autenticado", () => {
    renderNavbar(true);
    expect(screen.getAllByLabelText(/user menu/i).length).toBeGreaterThan(0);
  });

  it("cambia de tema al hacer click en el botón de tema", () => {
    renderNavbar();
    const button = screen.getByLabelText(/toggle theme/i);
    fireEvent.click(button);
  });

  it("muestra el dropdown de idiomas al hacer click", () => {
    renderNavbar();
    const button = screen.getByLabelText(/select language/i);
    fireEvent.click(button);
    expect(screen.getByText(/english/i)).toBeInTheDocument();
  });
});
