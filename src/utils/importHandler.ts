import type {
    CharacterProgressMap,
    CharacterId,
    Constellation,
    AscensionPhase,
    TalentLevel,
} from "@/types/character";
import { TRAVELER_ELEMENTAL_VARIANTS } from "@/types/character";

interface GOODBase {
    format: "GOOD";
    source: string;
    characters: GOODCharacter[];
}

interface GOODCharacter {
    key: string;
    level: number;
    constellation: Constellation;
    ascension: AscensionPhase;
    talent: {
        auto: TalentLevel;
        skill: TalentLevel;
        burst: TalentLevel;
    };
}

export function mapJsonToCharacterProgress(
    json: GOODBase,
    currentProgress: CharacterProgressMap,
): CharacterProgressMap {
    const newProgress: CharacterProgressMap = {};

    for (const char of json.characters) {
        const key = char.key;
        // kebab case e.g.
        // YumemizukiMizuki -> yumemizuki-mizuki
        // TravelerPyro -> traveler-pyro
        const charId = key.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();

        // special handling for Irminsul
        // only has "Traveler" entry, so must split
        if (charId === "traveler") {
            for (const variant of TRAVELER_ELEMENTAL_VARIANTS) {
                const existingData = currentProgress[variant];

                newProgress[variant] = {
                    id: variant,
                    level: char.level, // shared, updates all variants
                    constellation: existingData ? existingData.constellation : 0,
                    ascension: char.ascension, // shared, updates all variants
                    talents: {
                        normal: existingData ? existingData.talents.normal : 1,
                        skill: existingData ? existingData.talents.skill : 1,
                        burst: existingData ? existingData.talents.burst : 1,
                    },
                };
            }
            continue;
        }

        newProgress[charId as CharacterId] = {
            id: charId as CharacterId,
            level: char.level,
            constellation: char.constellation,
            ascension: char.ascension,
            talents: {
                normal: char.talent.auto,
                skill: char.talent.skill,
                burst: char.talent.burst,
            },
        };
    }

    return newProgress;
}
