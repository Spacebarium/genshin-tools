import { useTeamStore, type Team } from "@/store/useTeamStore";
import { useSortable } from "@dnd-kit/react/sortable";
import { TeamSlot } from "./TeamSlot";

interface TeamCardProps {
    team: Team;
    index: number;
}

export const TeamCard = ({ team, index }: TeamCardProps) => {
    const updateTeamName = useTeamStore((state) => state.updateTeamName);
    const removeTeam = useTeamStore((state) => state.removeTeam);
    // const setSlot = useTeamStore((state) => state.setSlot);

    const { ref, handleRef, isDragging } = useSortable({
        id: team.id,
        index,
        group: "teams",
        data: { type: "team" },
    });

    return (
        <div ref={ref} className="team-card" data-dragging={isDragging}>
            <header className="team-header">
                <div className="header-controls">
                    <button ref={handleRef} className="drag-grip" aria-label="Drag team">
                        ⋮⋮
                    </button>
                    <input
                        type="text"
                        value={team.name}
                        onChange={(e) => updateTeamName(team.id, e.target.value)}
                        className="team-name-input"
                        onPointerDown={(e) => e.stopPropagation()}
                    />
                </div>
                <button onClick={() => removeTeam(team.id)} className="delete-team-btn">
                    Delete
                </button>
            </header>

            <div className="team-slots-grid">
                {team.slots.map((charId, slotIndex) => (
                    <TeamSlot
                        key={`${team.id}-${slotIndex}`}
                        teamId={team.id}
                        slotIndex={slotIndex}
                        charId={charId}
                    />
                ))}
            </div>
        </div>
    );
};
