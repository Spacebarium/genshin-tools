import { useDraggable } from "@dnd-kit/react";
import type { CharacterId } from "@/types/character";
import "./style.css";

interface DraggableCharacterProps {
    id: CharacterId;
    name: string;
    iconId: string;
    isOwned: boolean;
    origin?: { teamId: string; slotIndex: number }; // optional: only if in a team
}

export const DraggableCharacter = ({
    id,
    name,
    iconId,
    isOwned,
    origin,
}: DraggableCharacterProps) => {
    // if from team slot, give scoped id; if from pool, use char id
    const uniqueId = origin ? `TEAM_${origin.teamId}-SLOT_${origin.slotIndex}-${id}` : `POOL_${id}`;

    const { ref, isDragging } = useDraggable({
        id: uniqueId,
        data: {
            type: "character",
            charId: id,
            name,
            iconId,
            origin,
        },
    });

    return (
        <div
            ref={ref}
            data-dragging={isDragging}
            data-owned={isOwned}
            data-origin={origin ? "team" : "pool"}
            className="draggable-character"
        >
            <img src={`icons/${iconId}.webp`} alt={name} title={name} />
            <span className="character-name">{name}</span>
        </div>
    );
};
