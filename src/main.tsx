import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "@/App.tsx";

import "@/styles/fonts.css";
import "@/styles/reset.css";
import "@/styles/index.css";
import "@/styles/style.css";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <BrowserRouter basename="/genshin-tools">
            <App />
        </BrowserRouter>
    </StrictMode>,
);
