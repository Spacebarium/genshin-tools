import type { Region, Element } from "@/types/character";

export const REGION_ELEMENT: Record<Region, Element> = {
    Mondstadt: "Anemo",
    Liyue: "Geo",
    Inazuma: "Electro",
    Sumeru: "Dendro",
    Fontaine: "Hydro",
    Natlan: "Pyro",
    "Nod-Krai": "Hydro", // hydro for bina?
};
