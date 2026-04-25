import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Element, WeaponType } from "@/types/character";
import { ELEMENTS } from "@/types/character";

interface CharacterFilterState {
    showOnlyOwned: boolean;
    elementFilter: Element[];
    weaponFilter: WeaponType[];
    setShowOnlyOwned: (val: boolean) => void;
    toggleElementFilter: (val: Element) => void;
    toggleWeaponFilter: (val: WeaponType) => void;
}

export const useCharacterFilterStore = create<CharacterFilterState>()(
    persist(
        (set) => ({
            showOnlyOwned: false,
            elementFilter: [],
            weaponFilter: [],

            setShowOnlyOwned: (val) => set({ showOnlyOwned: val }),

            toggleElementFilter: (element) =>
                set((state) => {
                    const { elementFilter } = state;

                    if (elementFilter.length === 0 || elementFilter.length === ELEMENTS.length) {
                        return { elementFilter: [element] };
                    }

                    const newFilter = elementFilter.includes(element)
                        ? elementFilter.filter((e) => e !== element)
                        : [...elementFilter, element];
                    return { elementFilter: newFilter };
                }),

            toggleWeaponFilter: (weapon) =>
                set((state) => ({
                    weaponFilter: state.weaponFilter.includes(weapon)
                        ? state.weaponFilter.filter((w) => w !== weapon)
                        : [...state.weaponFilter, weapon],
                })),
        }),
        { name: "character-filter-storage" },
    ),
);
