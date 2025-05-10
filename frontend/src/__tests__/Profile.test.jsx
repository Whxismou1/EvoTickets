import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import Profile from "../pages/Profile";
import { I18nextProvider } from "react-i18next";
import i18n from "../i18n/config";
import { describe, it, expect } from "vitest";

const mockIsAuthenticated = true;

vi.mock("../store/authStore", () => ({
  useAuthStore: () => ({ token: "fake-token" }),
}));

describe("Componente Profile", () => {
  const renderProfile = () =>
    render(
      <I18nextProvider i18n={i18n}>
        <Profile isAuthenticated={mockIsAuthenticated} />
      </I18nextProvider>
    );

  it("renderiza correctamente el nombre del usuario", () => {
    renderProfile();
    expect(screen.getByText("Juan Pérez")).toBeInTheDocument();
  });

  it("renderiza los tabs de navegación", () => {
    renderProfile();
    expect(screen.getByText("Información")).toBeInTheDocument();
    expect(screen.getByText("Mis Tickets")).toBeInTheDocument();
    expect(screen.getByText("Guardados")).toBeInTheDocument();
  });

  it("cambia a la pestaña 'Mis Tickets' correctamente", () => {
    renderProfile();
    const ticketsTab = screen.getByText("Mis Tickets");
    fireEvent.click(ticketsTab);
    expect(screen.getByText("Mis Tickets")).toBeInTheDocument();
    expect(screen.getByText("Concierto de Rock en Vivo")).toBeInTheDocument();
  });

  it("muestra botón de editar perfil", () => {
    renderProfile();
    expect(screen.getByRole("button", { name: /editar perfil/i })).toBeInTheDocument();
  });

  it("renderiza avatar del usuario", () => {
    renderProfile();
    const avatar = screen.getByAltText("Juan Pérez");
    expect(avatar).toBeInTheDocument();
    expect(avatar).toHaveAttribute("src", "/images/avatar.jpg");
  });
});