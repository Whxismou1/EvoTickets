import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HeroUIProvider } from "@heroui/system";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import "./i18n/config";
import { AlertProvider } from "./context/AlertContext";
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <HeroUIProvider>
      <BrowserRouter>
        <AlertProvider>
        
            <App />

          
        </AlertProvider>
      </BrowserRouter>
    </HeroUIProvider>
  </StrictMode>
);
