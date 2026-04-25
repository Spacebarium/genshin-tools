import { CHARACTER_DATABASE } from "@/data/characters";
import { useTrackerStore } from "@/store/useTrackerStore";
import type { CharacterId } from "@/types/character";
import { resolveIconId } from "@/utils/helper";
import { useDroppable } from "@dnd-kit/react";
import { DraggableCharacter } from "../components/DraggableCharacter";
import "./style.css";

interface TeamSlotProps {
    teamId: string;
    slotIndex: number;
    charId: CharacterId | null;
}

export const TeamSlot = ({ teamId, slotIndex, charId }: TeamSlotProps) => {
    const { ref, isDropTarget } = useDroppable({
        id: `TEAM_${teamId}-SLOT_${slotIndex}`,
        data: {
            type: "team-slot",
            teamId,
            slotIndex,
            charId,
        },
    });

    const isOwned = useTrackerStore((state) => (charId ? !!state.progress[charId] : false));
    const char = charId ? CHARACTER_DATABASE[charId] : null;

    return (
        <div ref={ref} data-drop-target={isDropTarget} data-empty={!charId} className="team-slot">
            {char && (
                <DraggableCharacter
                    id={charId as CharacterId}
                    iconId={resolveIconId(char.id)}
                    name={char.name}
                    isOwned={isOwned}
                    origin={{ teamId, slotIndex }}
                />
            )}
        </div>
    );
};
