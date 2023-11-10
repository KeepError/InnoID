import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import { MantineProvider } from "@mantine/core";
import "./index.css";
import UserProvider from "./components/providers/UserProvider.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <MantineProvider
        withGlobalStyles
        withNormalizeCSS
        theme={{
          colorScheme: "dark",
          colors: {
            brand: [
              "#87F76F",
              "#78F772",
              "#6AF775",
              "#5CF778",
              "#4EF87B",
              "#3FED7F",
              "#30E384",
              "#22D88A",
              "#14CB90",
              "#06BE96",
            ],
          },
          primaryColor: "brand",
        }}
      >
        <UserProvider>
          <App />
        </UserProvider>
      </MantineProvider>
    </BrowserRouter>
  </React.StrictMode>
);
