import { type AscensionPhase } from "@/types/character";

export const ASCENSION_LEVEL_CAPS: Record<AscensionPhase, [min: number, max: number]> = {
    0: [1, 20],
    1: [20, 40],
    2: [40, 50],
    3: [50, 60],
    4: [60, 70],
    5: [70, 80],
    6: [80, 90],
};

export const getAscensionForLevel = (level: number): AscensionPhase => {
    for (const [phase, [, max]] of Object.entries(ASCENSION_LEVEL_CAPS)) {
        if (level <= max) return Number(phase) as AscensionPhase;
    }
    return 6;
};