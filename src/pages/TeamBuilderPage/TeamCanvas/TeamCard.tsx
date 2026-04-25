import { useTeamStore, type Team } from "@/store/useTeamStore";
import { useSortable } from "@dnd-kit/react/sortable";
import { TeamSlot } from "./TeamSlot";
import "./style.css";

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
            <button ref={handleRef} className="drag-grip">
                ⋮⋮
            </button>
            <div className="team-content">
                <input
                    type="text"
                    value={team.name}
                    onChange={(e) => updateTeamName(team.id, e.target.value)}
                    className="team-name-input"
                    onPointerDown={(e) => e.stopPropagation()}
                />

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
            <button
                onClick={() => removeTeam(team.id)}
                className="delete-team-btn"
                title="Delete Team"
            >
                {/* Inline SVG for a clean red trash icon */}
                <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                >
                    <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                </svg>
            </button>
        </div>
    );
};
