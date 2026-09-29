import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router";
import App from "@/app/App";
import "@/styles/index.css";
import "remixicon/fonts/remixicon.css";
import { Toaster } from "sonner";

const container = document.getElementById("root");
if (!container) throw new Error("Missing #root element in index.html");

const root = ReactDOM.createRoot(container);
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Toaster expand={false} closeButton richColors />
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);
