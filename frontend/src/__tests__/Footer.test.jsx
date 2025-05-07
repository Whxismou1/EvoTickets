import "@testing-library/jest-dom";

import { render, screen } from "@testing-library/react";
import Footer from "../components/Footer";
import { I18nextProvider } from "react-i18next";
import i18n from "../i18n/config";
import { describe, it, expect } from "vitest";

describe("Footer", () => {
  it("renderiza correctamente los títulos de secciones", () => {
    render(
      <I18nextProvider i18n={i18n}>
        <Footer />
      </I18nextProvider>
    );

    const evoTickets = screen.getAllByText(/EvoTickets/i);
    expect(evoTickets).toHaveLength(2);

    expect(screen.getAllByText(/Events/i)[0]).toBeInTheDocument();
    expect(screen.getAllByText(/Company/i)[0]).toBeInTheDocument();
    expect(screen.getAllByText(/Support/i)[0]).toBeInTheDocument();
  });
});
