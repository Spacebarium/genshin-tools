import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Element, WeaponType } from "@/types/character";

type SortOption = "name-asc" | "name-desc" | "release-new" | "release-old";

interface CharacterFilterState {
    showOnlyOwned: boolean;
    elementFilter: Element[];
    weaponFilter: WeaponType[];
    sortBy: SortOption;
    setShowOnlyOwned: (val: boolean) => void;
    toggleElementFilter: (val: Element) => void;
    toggleWeaponFilter: (val: WeaponType) => void;
    setSortBy: (val: SortOption) => void;
    clearFilters: () => void;
}

export const useCharacterFilterStore = create<CharacterFilterState>()(
    persist(
        (set) => ({
            showOnlyOwned: false,
            elementFilter: [],
            weaponFilter: [],
            sortBy: "name-asc",

            setShowOnlyOwned: (val) => set({ showOnlyOwned: val }),

            toggleElementFilter: (val) =>
                set((state) => ({
                    elementFilter: state.elementFilter.includes(val)
                        ? state.elementFilter.filter((e) => e !== val)
                        : [...state.elementFilter, val],
                })),

            toggleWeaponFilter: (val) =>
                set((state) => ({
                    weaponFilter: state.weaponFilter.includes(val)
                        ? state.weaponFilter.filter((w) => w !== val)
                        : [...state.weaponFilter, val],
                })),

            setSortBy: (val) => set({ sortBy: val }),
            clearFilters: () => set({ elementFilter: [], weaponFilter: [] }),
        }),
        { name: "character-filter-storage" },
    ),
);
