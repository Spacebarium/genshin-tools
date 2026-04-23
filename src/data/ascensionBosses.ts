export const ASCENSION_BOSS_DATA = {
    "Anemo Hypostasis": { material: { name: "Hurricane Seed", id: 113001 } },
    "Electro Hypostasis": { material: { name: "Lightning Prism", id: 113002 } },
    "Geo Hypostasis": { material: { name: "Basalt Pillar", id: 113009 } },
    "Cryo Regisvine": { material: { name: "Hoarfrost Core", id: 113010 } },
    "Pyro Regisvine": { material: { name: "Everflame Seed", id: 113011 } },
    "Oceanid": { material: { name: "Cleansing Heart", id: 113012 } },
    "Primo Geovishap": { material: { name: "Juvenile Jade", id: 113016 } },
    "Cryo Hypostasis": { material: { name: "Crystalline Bloom", id: 113020 } },
    "Maguu Kenki": { material: { name: "Marionette Core", id: 113022 } },
    "Perpetual Mechanical Array": { material: { name: "Perpetual Heart", id: 113023 } },
    "Pyro Hypostasis": { material: { name: "Smoldering Pearl", id: 113024 } },
    "Hydro Hypostasis": { material: { name: "Dew of Repudiation", id: 113028 } },
    "Thunder Manifestation": { material: { name: "Storm Beads", id: 113029 } },
    "Golden Wolflord": { material: { name: "Riftborn Regalia", id: 113030 } },
    "Coral Defenders": { material: { name: "Dragonheir's False Fin", id: 113031 } },
    "Ruin Serpent": { material: { name: "Runic Fang", id: 113035 } },
    "Jadeplume Terrorshroom": { material: { name: "Majestic Hooked Beak", id: 113036 } },
    "Electro Regisvine": { material: { name: "Thunderclap Fruitcore", id: 113037 } },
    "Aeonblight Drake": { material: { name: "Perpetual Caliber", id: 113038 } },
    "Algorithm of Semi-Intransient Matrix of Overseer Network": { material: { name: "Light Guiding Tetrahedron", id: 113039 } },
    "Dendro Hypostasis": { material: { name: "Quelled Creeper", id: 113040 } },
    "Setekh Wenut": { material: { name: "Pseudo-Stamens", id: 113044 } },
    "Iniquitous Baptist": { material: { name: "Evergloom Ring", id: 113045 } },
    "Icewind Suite: Dirge of Coppelia": { material: { name: "Artificed Spare Clockwork Component \u2014 Coppelia", id: 113049 } },
    "Icewind Suite: Nemesis of Coppelius": { material: { name: "Artificed Spare Clockwork Component \u2014 Coppelius", id: 113050 } },
    "Emperor of Fire and Iron": { material: { name: "Emperor's Resolution", id: 113051 } },
    "Experimental Field Generator": { material: { name: "\"Tourbillon Device\"", id: 113052 } },
    "Millennial Pearl Seahorse": { material: { name: "Fontemer Unihorn", id: 113053 } },
    "Hydro Tulpa": { material: { name: "Water That Failed To Transcend", id: 113057 } },
    "Solitary Suanni": { material: { name: "Cloudseam Scale", id: 113058 } },
    "Legatus Golem": { material: { name: "Fragment of a Golden Melody", id: 113059 } },
    "Goldflame Qucusaur Tyrant": { material: { name: "Mark of the Binding Blessing", id: 113064 } },
    "Gluttonous Yumkasaur Mountain King": { material: { name: "Overripe Flamegranate", id: 113065 } },
    "Secret Source Automaton: Configuration Device": { material: { name: "Gold-Inscribed Secret Source Core", id: 113066 } },
    "Tenebrous Papilla: Type I": { material: { name: "Ensnaring Gaze", id: 113067 } },
    "Wayward Hermetic Spiritspeaker": { material: { name: "Talisman of the Enigmatic Land", id: 113071 } },
    "Lava Dragon Statue": { material: { name: "Sparkless Statue Core", id: 113072 } },
    "Secret Source Automaton: Overseer Device": { material: { name: "Secret Source Airflow Accumulator", id: 113076 } },
    "Knuckle Duckle": { material: { name: "Precision Kuuvahki Stamping Die", id: 113077 } },
    "Radiant Moonfly": { material: { name: "Lightbearing Scale-Feather", id: 113078 } },
    "Frostnight Herra": { material: { name: "Radiant Antler", id: 113079 } },
    "Super-Heavy Landrover: Mechanized Fortress": { material: { name: "Cyclic Military Kuuvahki Core", id: 113080 } },
    "Lord of the Hidden Depths: Whisperer of Nightmares": { material: { name: "Remnant of the Dreadwing", id: 113084 } },
    "Radiant Moongecko": { material: { name: "Prismatic Severed Tail", id: 113085 } },
    "Watcher: Fallen Vigil": { material: { name: "Plume of the Fallen Watcher", id: 113086 } },
} as const;

export type AscensionBossKey = keyof typeof ASCENSION_BOSS_DATA;

export type AscensionBossMaterial =
    (typeof ASCENSION_BOSS_DATA)[AscensionBossKey]["material"]["name"];

export type AscensionBossMaterialMeta = {
    bossKey: AscensionBossKey;
    id: number;
};

export const ascensionBossLookupMap = Object.entries(ASCENSION_BOSS_DATA).reduce(
    (acc, [bossKey, bossData]) => {
        acc[bossData.material.name as AscensionBossMaterial] = {
            bossKey: bossKey as AscensionBossKey,
            id: bossData.material.id,
        };
        return acc;
    },
    {} as Record<AscensionBossMaterial, AscensionBossMaterialMeta>,
);