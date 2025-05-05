import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import IconMapper from "../components/IconMapper";
import '@testing-library/jest-dom';

describe("IconMapper", () => {
    it("renderiza el icono correcto", () => {
      const { container } = render(<IconMapper name="Calendar" />);
      const svg = container.querySelector("svg");
      expect(svg).toBeInTheDocument();
    });
  
    it("no renderiza nada si el icono no existe", () => {
      const { container } = render(<IconMapper name="Inexistente" />);
      expect(container.firstChild).toBeNull();
    });
  });