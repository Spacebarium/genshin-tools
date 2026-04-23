import type { AscensionBossKey } from "@/data/ascensionBosses";
import type { WeeklyBossMaterial } from "@/data/weeklyBosses";
import type { TalentBook } from "@/data/talentBooks";
import { CHARACTER_DATABASE } from "@/data/characters";

export type CharacterId = keyof typeof CHARACTER_DATABASE;
export type TravelerTwin = "Aether" | "Lumine";

export const TRAVELER_ELEMENTAL_VARIANTS = [
    // TODO: yea you better not forget once we get to snez
    "traveler-anemo",
    "traveler-geo",
    "traveler-electro",
    "traveler-dendro",
    "traveler-hydro",
    "traveler-pyro",
] as const satisfies readonly CharacterId[];
export type TravelerVariantId = (typeof TRAVELER_ELEMENTAL_VARIANTS)[number];

export const ELEMENTS = ["Pyro", "Hydro", "Anemo", "Electro", "Dendro", "Cryo", "Geo"] as const;
export type Element = (typeof ELEMENTS)[number];
export const WEAPON_TYPES = ["Bow", "Catalyst", "Claymore", "Polearm", "Sword"] as const;
export type WeaponType = (typeof WEAPON_TYPES)[number];
export type Rarity = 4 | 5;
export type Region =
    | "Mondstadt"
    | "Liyue"
    | "Inazuma"
    | "Sumeru"
    | "Fontaine"
    | "Natlan"
    | "Nod-Krai";

export interface CharacterMaterials {
    ascensionBoss: AscensionBossKey | null; // traveler moment
    weeklyBossMaterial: WeeklyBossMaterial | null; // pyro traveler moment
    talentBook: TalentBook | Region; // traveler moment
}

export interface CharacterData {
    id: CharacterId;
    gameId: number | { Aether: number; Lumine: number };
    name: string;
    shortName?: string;
    element: Element;
    weaponType: WeaponType;
    rarity: Rarity;
    releasePatch: string;
    materials: CharacterMaterials;
}

export type AscensionPhase = 0 | 1 | 2 | 3 | 4 | 5 | 6;
export type Constellation = 0 | 1 | 2 | 3 | 4 | 5 | 6;
export type TalentLevel = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
export const TALENT_KEYS = ["normal", "skill", "burst"] as const;
export type TalentKey = (typeof TALENT_KEYS)[number];

export interface CharacterTalents {
    normal: TalentLevel;
    skill: TalentLevel;
    burst: TalentLevel;
}

export interface CharacterProgress {
    id: CharacterId;
    level: number;
    ascension: AscensionPhase;
    constellation: Constellation;
    talents: CharacterTalents;
}

export type CharacterProgressMap = Partial<Record<CharacterId, CharacterProgress>>;
