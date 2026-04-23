import { useMemo } from "react";
import { CharacterTable } from "./CharacterTable/CharacterTable";
import { Sidebar } from "./Sidebar/Sidebar";
import { CHARACTER_DATABASE } from "@/data/characters";
import "./style.css";

export const TrackerPage = () => {
    const characterList = useMemo(() => Object.values(CHARACTER_DATABASE), []);

    return (
        <div className="content-layout">
            <main className="table-container">
                <CharacterTable characters={characterList} />
            </main>
            <Sidebar />
        </div>
    );
};
