import { QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router";
import App from "@/app/App";
import { queryClient } from "@/app/queryClient";
import "@/styles/index.css";
import "remixicon/fonts/remixicon.css";
import { Toaster } from "sonner";

const container = document.getElementById("root");
if (!container) throw new Error("Missing #root element in index.html");

const root = ReactDOM.createRoot(container);
root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Toaster expand={false} closeButton richColors />
        <App />
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>,
);
