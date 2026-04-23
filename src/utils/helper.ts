import type { CharacterId } from "@/types/character";
import { useTrackerStore } from "@/store/useTrackerStore";

export const getMaterialIconUrl = (id: string): string =>
    `https://gi.yatta.moe/assets/UI/UI_ItemIcon_${id}.png`;

export const isPreNatlan = (releasePatch: string): boolean =>
    releasePatch.split(".").map(Number)[0] < 5;

export const isTraveler = (id: CharacterId): boolean => id.startsWith("traveler-");

export const resolveIconId = (id: CharacterId): string => {
    const playerTwin = useTrackerStore.getState().playerTwin;
    return isTraveler(id) ? playerTwin.toLowerCase() : id;
};
