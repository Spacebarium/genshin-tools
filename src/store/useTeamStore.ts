import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CharacterId } from "@/types/character";

export interface Team {
    id: string;
    name: string;
    slots: [CharacterId | null, CharacterId | null, CharacterId | null, CharacterId | null];
}

interface TeamState {
    teams: Record<string, Team>;
    teamOrder: string[];
    addTeam: () => void;
    removeTeam: (id: string) => void;
    updateTeamName: (id: string, name: string) => void;
    setSlot: (teamId: string, slotIndex: number, charId: CharacterId | null) => void;
    moveTeam: (oldIndex: number, newIndex: number) => void;
}

const initialId = crypto.randomUUID();

export const useTeamStore = create<TeamState>()(
    persist(
        (set) => ({
            teams: {
                [initialId]: {
                    id: initialId,
                    name: "Team 1",
                    slots: [null, null, null, null],
                },
            },

            teamOrder: [initialId],

            addTeam: () => {
                set((state) => {
                    const newId = crypto.randomUUID();
                    return {
                        teams: {
                            ...state.teams,
                            [newId]: {
                                id: newId,
                                name: `Team ${state.teamOrder.length + 1}`,
                                slots: [null, null, null, null],
                            },
                        },
                        teamOrder: [...state.teamOrder, newId],
                    };
                });
            },

            removeTeam: (id) =>
                set((state) => {
                    const newOrder = state.teamOrder.filter((teamId) => teamId !== id);
                    const newTeams = { ...state.teams };
                    delete newTeams[id];

                    if (newOrder.length === 0) {
                        const nextId = crypto.randomUUID();
                        return {
                            teams: {
                                [nextId]: {
                                    id: nextId,
                                    name: "Team 1",
                                    slots: [null, null, null, null],
                                },
                            },
                            teamOrder: [nextId],
                        };
                    }

                    return {
                        teams: newTeams,
                        teamOrder: newOrder,
                    };
                }),

            updateTeamName: (id, name) =>
                set((state) => ({
                    teams: {
                        ...state.teams,
                        [id]: { ...state.teams[id], name },
                    },
                })),

            setSlot: (teamId, slotIndex, charId) =>
                set((state) => {
                    const team = state.teams[teamId];
                    if (!team) return state;

                    const newSlots = [...team.slots] as Team["slots"];
                    newSlots[slotIndex] = charId;

                    return {
                        teams: { ...state.teams, [teamId]: { ...team, slots: newSlots } },
                    };
                }),

            moveTeam: (oldIndex, newIndex) =>
                set((state) => {
                    const newOrder = [...state.teamOrder];
                    const [movedItem] = newOrder.splice(oldIndex, 1);
                    newOrder.splice(newIndex, 0, movedItem);

                    return { teamOrder: newOrder };
                }),
        }),
        { name: "team-builder-storage" },
    ),
);
