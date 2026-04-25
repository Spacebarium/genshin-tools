import { Routes, Route, NavLink } from "react-router-dom";
import { TrackerPage } from "@/pages/TrackerPage/TrackerPage";
import { TeamBuilderPage } from "@/pages/TeamBuilderPage/TeamBuilderPage";

export default function App() {
    return (
        <div className="app-layout">
            <header className="app-header">
                <h1>Genshin Tools</h1>
                <nav className="top-nav">
                    <NavLink to="/" className="nav-item">
                        <span>Tracker</span>
                    </NavLink>
                    <NavLink to="/teams" className="nav-item">
                        <span>Team Builder</span>
                    </NavLink>
                </nav>
            </header>
            <Routes>
                <Route path="/" element={<TrackerPage />} />
                <Route path="/teams" element={<TeamBuilderPage />} />
            </Routes>
        </div>
    );
}
