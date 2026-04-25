import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HashRouter } from "react-router-dom";
import App from "@/App.tsx";

import "@/styles/fonts.css";
import "@/styles/reset.css";
import "@/styles/index.css";
import "@/styles/style.css";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <HashRouter>
            <App />
        </HashRouter>
    </StrictMode>,
);
