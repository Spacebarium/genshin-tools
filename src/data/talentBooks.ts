import type { Region } from "@/types/character";

export const TALENT_DOMAIN_DATA = {
    Mondstadt: {
        Freedom: { id: 104303 },
        Resistance: { id: 104306 },
        Ballad: { id: 104309 },
    },
    Liyue: {
        Prosperity: { id: 104312 },
        Diligence: { id: 104315 },
        Gold: { id: 104318 },
    },
    Inazuma: {
        Transience: { id: 104322 },
        Elegance: { id: 104325 },
        Light: { id: 104328 },
    },
    Sumeru: {
        Admonition: { id: 104331 },
        Ingenuity: { id: 104334 },
        Praxis: { id: 104337 },
    },
    Fontaine: {
        Equity: { id: 104340 },
        Justice: { id: 104343 },
        Order: { id: 104346 },
    },
    Natlan: {
        Contention: { id: 104349 },
        Kindling: { id: 104352 },
        Conflict: { id: 104355 },
    },
    "Nod-Krai": {
        Moonlight: { id: 104358 },
        Elysium: { id: 104361 },
        Vagrancy: { id: 104364 },
    },
} as const;

export type TalentBook = {
    [K in Region]: keyof (typeof TALENT_DOMAIN_DATA)[K];
}[Region];

export type TalentBookMeta = {
    region: Region;
    id: number;
};

export const talentBookLookupMap = Object.entries(TALENT_DOMAIN_DATA).reduce(
    (acc, [region, books]) => {
        for (const [bookName, data] of Object.entries(books)) {
            acc[bookName as TalentBook] = {
                region: region as Region,
                id: data.id,
            };
        }
        return acc;
    },
    {} as Record<TalentBook, TalentBookMeta>,
);
