export const WEEKLY_BOSS_DATA = {
    dvalin: {
        displayName: "Stormterror",
        materials: {
            "Dvalin's Plume": {
                id: 113003,
            },
            "Dvalin's Claw": {
                id: 113004,
            },
            "Dvalin's Sigh": {
                id: 113005,
            },
        },
    },
    andrius: {
        displayName: "Lupus Boreas, Dominator of Wolves",
        materials: {
            "Tail of Boreas": {
                id: 113006,
            },
            "Ring of Boreas": {
                id: 113007,
            },
            "Spirit Locket of Boreas": {
                id: 113008,
            },
        },
    },
    childe: {
        displayName: "Childe",
        materials: {
            "Tusk of Monoceros Caeli": {
                id: 113013,
            },
            "Shard of a Foul Legacy": {
                id: 113014,
            },
            "Shadow of the Warrior": {
                id: 113015,
            },
        },
    },
    azhdaha: {
        displayName: "Azhdaha",
        materials: {
            "Dragon Lord's Crown": {
                id: 113017,
            },
            "Bloodjade Branch": {
                id: 113018,
            },
            "Gilded Scale": {
                id: 113019,
            },
        },
    },
    signora: {
        displayName: "La Signora",
        materials: {
            "Molten Moment": {
                id: 113025,
            },
            "Hellfire Butterfly": {
                id: 113026,
            },
            "Ashen Heart": {
                id: 113027,
            },
        },
    },
    raiden: {
        displayName: "Magatsu Mitake Narukami no Mikoto",
        materials: {
            "Mudra of the Malefic General": {
                id: 113032,
            },
            "Tears of the Calamitous God": {
                id: 113033,
            },
            "The Meaning of Aeons": {
                id: 113034,
            },
        },
    },
    scaramouche: {
        displayName: "Shouki no Kami, the Prodigal",
        materials: {
            "Puppet Strings": {
                id: 113041,
            },
            "Mirror of Mushin": {
                id: 113042,
            },
            "Daka's Bell": {
                id: 113043,
            },
        },
    },
    apep: {
        displayName: "Guardian of Apep's Oasis",
        materials: {
            "Worldspan Fern": {
                id: 113046,
            },
            "Primordial Greenbloom": {
                id: 113047,
            },
            Everamber: {
                id: 113048,
            },
        },
    },
    narwhal: {
        displayName: "All-Devouring Narwhal",
        materials: {
            "Lightless Silk String": {
                id: 113054,
            },
            "Lightless Eye of the Maelstrom": {
                id: 113055,
            },
            "Lightless Mass": {
                id: 113056,
            },
        },
    },
    knave: {
        displayName: "The Knave",
        materials: {
            "Fading Candle": {
                id: 113060,
            },
            "Silken Feather": {
                id: 113061,
            },
            "Denial and Judgment": {
                id: 113062,
            },
        },
    },
    gosoytoth: {
        displayName: "Lord of Eroded Primal Fire",
        materials: {
            "Eroded Horn": {
                id: 113068,
            },
            "Eroded Sunfire": {
                id: 113069,
            },
            "Eroded Scale-Feather": {
                id: 113070,
            },
        },
    },
    chess: {
        displayName: "The Game Before the Gate",
        materials: {
            "Ascended Sample: Knight": {
                id: 113073,
            },
            "Ascended Sample: Rook": {
                id: 113074,
            },
            "Ascended Sample: Queen": {
                id: 113075,
            },
        },
    },
    dottore: {
        displayName: "The Doctor",
        materials: {
            "Mask of the Virtuous Doctor": {
                id: 113081,
            },
            "Madman's Restraint": {
                id: 113082,
            },
            "Elixir of the Heretic": {
                id: 113083,
            },
        },
    },
    "dottore-2": {
        displayName: "Mr. Data",
        materials: {
            "Dottore2-1": {
                id: 113087,
            },
            "Dottore2-2": {
                id: 113088,
            },
            "Dottore2-3": {
                id: 113089,
            },
        },
    },
} as const;

export type WeeklyBossKey = keyof typeof WEEKLY_BOSS_DATA;

export type WeeklyBossMaterial = {
    [K in WeeklyBossKey]: keyof (typeof WEEKLY_BOSS_DATA)[K]["materials"];
}[WeeklyBossKey];

export type WeeklyBossMaterialMeta = {
    bossKey: WeeklyBossKey;
    displayName: string;
    id: number;
};

export const weeklyBossLookupMap = Object.entries(WEEKLY_BOSS_DATA).reduce(
    (acc, [bossKey, bossData]) => {
        Object.entries(bossData.materials).forEach(([materialName, materialMeta]) => {
            acc[materialName as WeeklyBossMaterial] = {
                bossKey: bossKey as WeeklyBossKey,
                displayName: bossData.displayName,
                id: materialMeta.id,
            };
        });
        return acc;
    },
    {} as Record<WeeklyBossMaterial, WeeklyBossMaterialMeta>,
);
