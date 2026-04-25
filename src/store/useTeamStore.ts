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
    swapSlots: (teamA: string, slotA: number, teamB: string, slotB: number) => boolean;
    isCharacterInTeam: (teamId: string, charId: CharacterId) => boolean;
    moveTeam: (oldIndex: number, newIndex: number) => void;
}

const createInitialTeams = () => {
    const team1Id = crypto.randomUUID();
    const team2Id = crypto.randomUUID();
    const team3Id = crypto.randomUUID();

    return {
        teams: {
            [team1Id]: {
                id: team1Id,
                name: "Team 1",
                slots: [null, null, null, null] as Team["slots"],
            },
            [team2Id]: {
                id: team2Id,
                name: "Team 2",
                slots: [null, null, null, null] as Team["slots"],
            },
            [team3Id]: {
                id: team3Id,
                name: "Team 3",
                slots: [null, null, null, null] as Team["slots"],
            },
        },
        teamOrder: [team1Id, team2Id, team3Id],
    };
};

const initial = createInitialTeams();

export const useTeamStore = create<TeamState>()(
    persist(
        (set, get) => ({
            teams: initial.teams,
            teamOrder: initial.teamOrder,

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

            setSlot: (teamId, slotIndex, charId) => {
                const state = get();
                const team = state.teams[teamId];
                if (!team) return null;

                const displacedCharId = team.slots[slotIndex];

                set((state) => {
                    const team = state.teams[teamId];
                    if (!team) return state;

                    const newSlots = [...team.slots] as Team["slots"];
                    newSlots[slotIndex] = charId;

                    return {
                        teams: { ...state.teams, [teamId]: { ...team, slots: newSlots } },
                    };
                });

                return displacedCharId;
            },

            swapSlots: (teamA, slotA, teamB, slotB) => {
                const state = get();
                const team1 = state.teams[teamA];
                const team2 = state.teams[teamB];

                if (!team1 || !team2) return false;

                const charA = team1.slots[slotA];
                const charB = team2.slots[slotB];

                // check for duplicates after swap
                if (charA && charB && teamA !== teamB) {
                    // if both slots have characters AND teams are different,
                    // need to ensure no duplicates after swap
                    const team1HasCharB = team1.slots.includes(charB);
                    const team2HasCharA = team2.slots.includes(charA);

                    if (team1HasCharB && team1.slots.indexOf(charB) !== slotA) {
                        return false; // B already exists in team1 (not in the slot being swapped)
                    }
                    if (team2HasCharA && team2.slots.indexOf(charA) !== slotB) {
                        return false; // A already exists in team2 (not in the slot being swapped)
                    }
                }

                set((state) => {
                    const t1 = state.teams[teamA];
                    const t2 = state.teams[teamB];

                    const newSlots1 = [...t1.slots] as Team["slots"];
                    const newSlots2 = [...t2.slots] as Team["slots"];

                    newSlots1[slotA] = charB;
                    newSlots2[slotB] = charA;

                    return {
                        teams: {
                            ...state.teams,
                            [teamA]: { ...t1, slots: newSlots1 },
                            [teamB]: { ...t2, slots: newSlots2 },
                        },
                    };
                });

                return true;
            },

            isCharacterInTeam: (teamId, charId) => {
                const state = get();
                const team = state.teams[teamId];
                return team ? team.slots.includes(charId) : false;
            },

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
