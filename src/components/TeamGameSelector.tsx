import TeamSelector from "./TeamSelector";
import GameSelector from "./GameSelector";
import { useState, useEffect } from "react";
import { api } from "~/utils/api";
import { getGameDataFromPlayData } from "~/utils/PlayUtil";

interface TeamGameSelectorProps {
    onSelectTeam: (team: string) => void;
    onSelectGame: (game: GameData) => void;
}

export default function TeamGameSelector(props: TeamGameSelectorProps) {
    const [teamSelected, setTeamSelected] = useState<string>()
    const [gamesAvailable, setGamesAvailable] = useState<GameData[]>([])

    const { data: teamNames } = api.plays.getTeams.useQuery();
    const { data: gameData, refetch: refetchGameData } = api.plays.getGamesByTeam.useQuery({team: teamSelected!}, { enabled: false })

    useEffect(() => {
        if (teamSelected) {
            refetchGameData().catch((err) => console.log(err)).then((res) => {
                if (res) {
                    const gameDataArr = [];
                    for (const game of res.data!) {
                        gameDataArr.push(getGameDataFromPlayData([game]));
                    }
                    setGamesAvailable(gameDataArr);
                }
            }).catch(() => 'obligatory catch');
        }
    }, [teamSelected, refetchGameData])

    const handleTeamChange = (team: string) => {
        // console.log('TeamGameSelector: handleTeamChange: ', team);
        setTeamSelected(team);
        props.onSelectTeam(team);
    }

    const handleGameChange = (game: GameData) => {
        // console.log('TeamGameSelector: handleGameChange: ', game);
        props.onSelectGame(game);
    }

    return (
        <>
            <div className="flex w-full justify-between">
                <div className="w-1/2">
                    {teamNames && <TeamSelector onChange={handleTeamChange} teams={teamNames}/>}
                </div>

                <div className="w-1/2">
                    <GameSelector onChange={handleGameChange} games={gamesAvailable}/>
                </div>
            </div>
        </>
    )
}