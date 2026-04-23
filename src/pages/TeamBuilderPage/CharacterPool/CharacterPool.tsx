import { CHARACTER_DATABASE } from "@/data/characters";
import { useCharacterFilterStore } from "@/store/useCharacterFilterStore";
import { useTrackerStore } from "@/store/useTrackerStore";
import { ELEMENTS, WEAPON_TYPES } from "@/types/character";
import { resolveIconId } from "@/utils/helper";
import { useMemo } from "react";
import { DraggableCharacter } from "../components/DraggableCharacter";
import "./style.css";

export const CharacterPool = () => {
    const {
        showOnlyOwned,
        elementFilter,
        weaponFilter,
        sortBy,
        setShowOnlyOwned,
        toggleElementFilter,
        toggleWeaponFilter,
        // setSortBy,
        // clearFilters,
    } = useCharacterFilterStore();

    const progress = useTrackerStore((state) => state.progress);

    const filteredCharacters = useMemo(() => {
        let characters = Object.values(CHARACTER_DATABASE);

        if (showOnlyOwned) {
            characters = characters.filter((char) => !!progress[char.id]);
        }

        if (elementFilter.length > 0) {
            characters = characters.filter((char) => elementFilter.includes(char.element));
        }

        if (weaponFilter.length > 0) {
            characters = characters.filter((char) => weaponFilter.includes(char.weaponType));
        }

        return [...characters].sort((a, b) => {
            switch (sortBy) {
                case "name-asc":
                    return a.name.localeCompare(b.name);
                case "name-desc":
                    return b.name.localeCompare(a.name);
                case "release-new":
                    return b.releasePatch.localeCompare(a.releasePatch);
                case "release-old":
                    return a.releasePatch.localeCompare(b.releasePatch);
                default:
                    return 0;
            }
        });
    }, [progress, showOnlyOwned, elementFilter, weaponFilter, sortBy]);

    return (
        <aside className="character-pool">
            <header className="toolbar">
                <div className="toolbar-row">
                    <label className="toggle-label">
                        <input
                            type="checkbox"
                            checked={showOnlyOwned}
                            onChange={(e) => setShowOnlyOwned(e.target.checked)}
                        />
                        Show Owned Only
                    </label>
                    <span className="pool-counter">
                        {filteredCharacters.length} / {Object.keys(CHARACTER_DATABASE).length}
                    </span>
                </div>
                <div className="toolbar-row">
                    <div className="filter-group">
                        {ELEMENTS.map((element) => (
                            <button
                                key={element}
                                className="filter-pill"
                                data-active={elementFilter.includes(element)}
                                data-element={element.toLowerCase()}
                                onClick={() => toggleElementFilter(element)}
                                title={element}
                                style={
                                    {
                                        "--pill-color": `var(--colour-${element.toLowerCase()})`,
                                    } as React.CSSProperties
                                }
                            >
                                {/* <img src={`icons/elements/${element.toLowerCase()}.webp`} alt={element} /> */}
                                <span>{element}</span>
                            </button>
                        ))}
                    </div>
                </div>
                <div className="toolbar-row">
                    <div className="filter-group">
                        {WEAPON_TYPES.map((weapon) => (
                            <button
                                key={weapon}
                                className="filter-pill"
                                data-active={weaponFilter.includes(weapon)}
                                data-weapon
                                onClick={() => toggleWeaponFilter(weapon)}
                                title={weapon}
                            >
                                {/* <img src={`icons/weapons/${weapon.toLowerCase()}.webp`} alt={weapon} /> */}
                                <span>{weapon}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </header>
            <div className="pool-grid">
                {filteredCharacters.map((char) => (
                    <DraggableCharacter
                        key={char.id}
                        id={char.id}
                        name={char.name}
                        iconId={resolveIconId(char.id)}
                        isOwned={!!progress[char.id]}
                    />
                ))}
            </div>
        </aside>
    );
};
