import { useDraggable } from "@dnd-kit/react";
import type { CharacterId } from "@/types/character";
import "./style.css"

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
    const { ref, isDragging } = useDraggable({
        id,
        data: {
            type: "character",
            origin,
        },
    });

    return (
        <div ref={ref} data-dragging={isDragging} data-owned={isOwned} className="draggable-character">
            <img src={`icons/${iconId}.webp`} alt={name} title={name} />
            <span className="character-name">{name}</span>
        </div>
    );
};
