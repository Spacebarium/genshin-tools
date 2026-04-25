import { useTeamStore } from "@/store/useTeamStore";
import { TeamCard } from "./TeamCard";
import "./style.css";

export const TeamCanvas = () => {
    const teams = useTeamStore((state) => state.teams);
    const teamOrder = useTeamStore((state) => state.teamOrder);
    const addTeam = useTeamStore((state) => state.addTeam);

    return (
        <main className="team-canvas">
            {teamOrder.map((teamId, index) => (
                <TeamCard key={teamId} team={teams[teamId]} index={index} />
            ))}
            <button onClick={addTeam} className="add-team-btn">
                + Add Team
            </button>
        </main>
    );
};
