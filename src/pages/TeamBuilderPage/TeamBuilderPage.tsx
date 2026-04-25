import { useTeamStore } from "@/store/useTeamStore";
import type { CharacterId } from "@/types/character";
import { DragDropProvider, type DragEndEvent } from "@dnd-kit/react";
import { isSortable } from "@dnd-kit/react/sortable";
import { CharacterPool } from "./CharacterPool/CharacterPool";
import { TeamCanvas } from "./TeamCanvas/TeamCanvas";

export const TeamBuilderPage = () => {
    const setSlot = useTeamStore((state) => state.setSlot);
    const swapSlots = useTeamStore((state) => state.swapSlots);
    const isCharacterInTeam = useTeamStore((state) => state.isCharacterInTeam);
    const moveTeam = useTeamStore((state) => state.moveTeam);

    const handleDragEnd = (event: DragEndEvent) => {
        const { source, target } = event.operation;
        if (event.canceled || !source || !target) return;

        // team card reordering
        if (isSortable(source) && source.data?.type === "team") {
            const { initialIndex, index } = source.sortable;
            if (initialIndex !== index) {
                moveTeam(initialIndex, index);
            }
            return;
        }

        // character drag and drop
        if (source.data?.type === "character" && target.data?.type === "team-slot") {
            const draggedCharId = source.data.charId as CharacterId;
            const {
                teamId: toTeamId,
                slotIndex: toSlotIndex,
                charId: occupantCharId,
            } = target.data;
            const origin = source.data.origin;

            // dropped into own slot -> do nothing
            if (origin && origin.teamId === toTeamId && origin.slotIndex === toSlotIndex) return;

            // from character pool to empty/occupied slot
            if (!origin) {
                // if already in target team
                if (isCharacterInTeam(toTeamId, draggedCharId)) {
                    console.warn("Character already in this team!");
                    return;
                }

                // if dropping on occupied slot, the occupant gets displaced
                setSlot(toTeamId, toSlotIndex, draggedCharId);
                return;
            }

            // moving between slots for same/different teams
            if (origin) {
                // same team
                if (origin.teamId === toTeamId) {
                    if (!occupantCharId) {
                        // empty slot
                        setSlot(origin.teamId, origin.slotIndex, null);
                        setSlot(toTeamId, toSlotIndex, draggedCharId);
                    } else {
                        // swap
                        setSlot(origin.teamId, origin.slotIndex, occupantCharId);
                        setSlot(toTeamId, toSlotIndex, draggedCharId);
                    }
                    return;
                }

                // different team
                // duplicate check
                if (isCharacterInTeam(toTeamId, draggedCharId) && !occupantCharId) {
                    console.warn("Character already in target team!");
                    return;
                }

                // Use swap for better handling
                const success = swapSlots(origin.teamId, origin.slotIndex, toTeamId, toSlotIndex);

                if (!success) {
                    console.warn("Swap would create duplicate characters!");
                }
            }
        }
    };

    return (
        <DragDropProvider onDragEnd={handleDragEnd}>
            <div className="content-layout builder-layout">
                <CharacterPool />
                <TeamCanvas />
            </div>
        </DragDropProvider>
    );
};
