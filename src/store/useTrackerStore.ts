import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
    type CharacterId,
    type CharacterProgress,
    type CharacterProgressMap,
    type AscensionPhase,
    type Constellation,
    type TalentLevel,
    type TalentKey,
    type TravelerTwin,
    TRAVELER_ELEMENTAL_VARIANTS,
} from "@/types/character";
import { ASCENSION_LEVEL_CAPS, getAscensionForLevel } from "@/data/ascension";
import type { ServerRegion } from "@/data/servers";
import { isTraveler } from "@/utils/helper";

interface TrackerState {
    progress: CharacterProgressMap;
    playerTwin: TravelerTwin;
    serverRegion: ServerRegion;
    setPlayerTwin: (twin: TravelerTwin) => void;
    setServerRegion: (serverRegion: ServerRegion) => void;
    initializeCharacter: (id: CharacterId) => void;
    removeCharacter: (id: CharacterId) => void;
    updateLevel: (id: CharacterId, level: number) => void;
    stepLevel: (id: CharacterId, level: number) => void;
    updateConstellation: (id: CharacterId, constellation: Constellation) => void;
    updateTalent: (id: CharacterId, type: TalentKey, level: TalentLevel) => void;
    setProgress: (newProgress: CharacterProgressMap) => void;
    clearProgress: () => void;
}

function syncTravelerProgress(
    currentProgress: CharacterProgressMap,
    charId: string,
    patch: Partial<CharacterProgress>,
): CharacterProgressMap {
    if (!isTraveler(charId as CharacterId)) return currentProgress;

    const syncPatch: Partial<CharacterProgress> = {
        ...(patch.level !== undefined && { level: patch.level }),
        ...(patch.ascension !== undefined && { ascension: patch.ascension }),
    };

    if (Object.keys(syncPatch).length === 0) return currentProgress;

    const syncedProgress = { ...currentProgress };

    for (const variant of TRAVELER_ELEMENTAL_VARIANTS) {
        if (variant !== charId && syncedProgress[variant]) {
            syncedProgress[variant] = {
                ...syncedProgress[variant],
                ...syncPatch,
            };
        }
    }

    return syncedProgress;
}

const updateChar = (state: TrackerState, id: CharacterId, patch: Partial<CharacterProgress>) => {
    const char = state.progress[id];
    if (!char) return state;

    let newProgress: CharacterProgressMap = {
        ...state.progress,
        [id]: { ...char, ...patch },
    };

    newProgress = syncTravelerProgress(newProgress, id, patch);

    return { progress: newProgress };
};

export const useTrackerStore = create<TrackerState>()(
    persist(
        (set) => ({
            progress: {},
            setProgress: (newProgress) => set({ progress: newProgress }),
            clearProgress: () => set({ progress: {} }),

            playerTwin: "Aether",
            setPlayerTwin: (twin) => set({ playerTwin: twin }),

            serverRegion: "Asia",
            setServerRegion: (serverRegion) => set({ serverRegion: serverRegion }),

            initializeCharacter: (id) =>
                set((state) => {
                    if (state.progress[id]) return state;
                    return {
                        progress: {
                            ...state.progress,
                            [id]: {
                                id: id,
                                level: 1,
                                ascension: 0,
                                constellation: 0,
                                talents: { normal: 1, skill: 1, burst: 1 },
                            },
                        },
                    };
                }),

            removeCharacter: (id) =>
                set((state) => {
                    const newProgress = { ...state.progress };
                    delete newProgress[id];
                    return { progress: newProgress };
                }),

            updateLevel: (id, level) =>
                set((state) =>
                    updateChar(state, id, {
                        level,
                        ascension: getAscensionForLevel(level),
                    }),
                ),

            stepLevel: (id, targetLvl) =>
                set((state) => {
                    const char = state.progress[id];
                    if (!char) return state;

                    const { level, ascension } = char;
                    const [min, max] = ASCENSION_LEVEL_CAPS[ascension];
                    const goingUp = targetLvl > level;

                    if (goingUp && level === max && ascension < 6)
                        return updateChar(state, id, {
                            ascension: (ascension + 1) as AscensionPhase,
                        });

                    if (!goingUp && level === min && ascension > 0)
                        return updateChar(state, id, {
                            ascension: (ascension - 1) as AscensionPhase,
                        });

                    return updateChar(state, id, { level: targetLvl });
                }),

            updateConstellation: (id, constellation) =>
                set((state) => updateChar(state, id, { constellation })),

            updateTalent: (id, type, level) =>
                set((state) => {
                    const char = state.progress[id];
                    if (!char) return state;
                    return updateChar(state, id, { talents: { ...char.talents, [type]: level } });
                }),
        }),
        { name: "genshin-tracker-storage" },
    ),
);
