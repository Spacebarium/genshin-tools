import { CHARACTER_DATABASE } from "@/data/characters";
import { useTrackerStore } from "@/store/useTrackerStore";
import type { CharacterId } from "@/types/character";
import { resolveIconId } from "@/utils/helper";
import { useDroppable } from "@dnd-kit/react";
import { DraggableCharacter } from "../components/DraggableCharacter";

interface TeamSlotProps {
    teamId: string;
    slotIndex: number;
    charId: CharacterId | null;
}

export const TeamSlot = ({ teamId, slotIndex, charId }: TeamSlotProps) => {
    const { ref, isDropTarget } = useDroppable({
        id: `${teamId}-slot-${slotIndex}`,
        data: {
            type: "team-slot",
            teamId,
            slotIndex,
        },
    });

    const isOwned = useTrackerStore((state) => (charId ? !!state.progress[charId] : false));
    const char = charId ? CHARACTER_DATABASE[charId] : null;

    return (
        <div ref={ref} data-drop-target={isDropTarget} data-empty={!charId}>
            {char ? (
                <DraggableCharacter
                    id={charId as CharacterId}
                    iconId={resolveIconId(char.id)}
                    name={char.name}
                    isOwned={isOwned}
                    origin={{ teamId, slotIndex }}
                />
            ) : (
                <span className="empty-placeholder">+</span>
            )}
        </div>
    );
};
