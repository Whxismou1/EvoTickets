import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import HomePage from "../pages/Home";
import { describe, it, expect, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { I18nextProvider } from "react-i18next";
import i18n from "../i18n/config";
import "@testing-library/jest-dom";

// Componente wrapper para los tests
const renderHome = () => {
  return render(
    <MemoryRouter>
      <I18nextProvider i18n={i18n}>
        <HomePage />
      </I18nextProvider>
    </MemoryRouter>
  );
};

describe("HomePage", () => {
  it("renderiza correctamente el mensaje de bienvenida", () => {
    renderHome();
    expect(screen.getByText(/¡Bienvenido de nuevo!/i)).toBeInTheDocument();
  });

  it("muestra los skeletons de carga inicialmente", () => {
    renderHome();
    // Espera al menos un skeleton con aria-label="loading"
    const skeletons = screen.getAllByRole("status");
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it("renderiza eventos después del retardo simulado", async () => {
    renderHome();

    await waitFor(() => {
      expect(screen.getByText(/Festival de Música Urbana/i)).toBeInTheDocument();
      expect(screen.getByText(/Concierto de Rock Alternativo/i)).toBeInTheDocument();
    });
  });

  it("filtra eventos según la búsqueda del usuario", async () => {
    renderHome();

    const input = screen.getByPlaceholderText(/búsqueda rápida de eventos/i);
    fireEvent.change(input, { target: { value: "rock" } });

    await waitFor(() => {
      expect(screen.getByText(/Concierto de Rock Alternativo/i)).toBeInTheDocument();
    });

    // No debe aparecer el otro evento
    expect(screen.queryByText(/Festival de Música Urbana/i)).not.toBeInTheDocument();
  });

  it("envía el formulario de búsqueda correctamente", async () => {
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});

    renderHome();
    const input = screen.getByPlaceholderText(/búsqueda rápida de eventos/i);
    fireEvent.change(input, { target: { value: "urbana" } });

    const form = input.closest("form");
    fireEvent.submit(form);

    expect(consoleSpy).toHaveBeenCalledWith("Searching for:", "urbana");

    consoleSpy.mockRestore();
  });
});
