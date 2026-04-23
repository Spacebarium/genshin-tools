import { useTeamStore } from "@/store/useTeamStore";
import { TeamCard } from "./TeamCard";

export const TeamCanvas = () => {
    const teams = useTeamStore((state) => state.teams);
    const teamOrder = useTeamStore((state) => state.teamOrder);

    return (
        <main className="team-canvas">
            <TeamCard team={teams[teamOrder[0]]} index={0} />
        </main>
    );
};
