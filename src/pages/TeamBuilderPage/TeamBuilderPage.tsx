import { useTeamStore } from "@/store/useTeamStore";
import type { CharacterId } from "@/types/character";
import { DragDropProvider } from "@dnd-kit/react";
import { isSortable } from "@dnd-kit/react/sortable";
import { CharacterPool } from "./CharacterPool/CharacterPool";
import { TeamCanvas } from "./TeamCanvas/TeamCanvas";

export const TeamBuilderPage = () => {
    const setSlot = useTeamStore((state) => state.setSlot);
    const moveTeam = useTeamStore((state) => state.moveTeam);

    return (
        <DragDropProvider
            onDragEnd={(event) => {
                const { source, target } = event.operation;
                if (event.canceled || !source || !target) return;

                // character dropped into a team slot
                if (target.data?.type === "team-slot" && source.data?.type === "character") {
                    const charId = source.id as CharacterId;
                    const { teamId: toTeamId, slotIndex: toSlotIndex } = target.data;
                    const origin = source.data.origin;

                    setSlot(toTeamId, toSlotIndex, charId);

                    if (origin) {
                        setSlot(origin.teamId, origin.slotIndex, null);
                    }
                }

                // team card reordering
                if (isSortable(source) && source.data?.type === "team") {
                    const { initialIndex, index } = source.sortable;

                    if (initialIndex !== index) {
                        moveTeam(initialIndex, index);
                    }
                }
            }}
        >
            <div className="content-layout builder-layout">
                <CharacterPool />
                <TeamCanvas />
            </div>
        </DragDropProvider>
    );
};
