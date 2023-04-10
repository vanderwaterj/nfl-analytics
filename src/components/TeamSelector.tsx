import { forwardRef, useEffect, useState } from "react";
import { Select } from '@mantine/core'
import { api } from "~/utils/api";
import TeamIcon from "./TeamIcon";

interface TeamSelectorProps {
    onSelect: (gameId: string) => void;
}

interface TeamItemProps extends React.ComponentPropsWithoutRef<'div'> {
    image: string;
    label: string;
    description: string;
}

const SelectTeamItem = forwardRef<HTMLDivElement, TeamItemProps>(
    ({label, description, ...others}, ref) => (
        <div ref={ref} {...others}>
            <div className="flex items-center">
                <TeamIcon team={label} sizePx={20} />
                <span className="ml-2">{label}</span>
            </div>
            <div className="text-sm text-gray-600">{description}</div>
        </div>
    )
);

export default function TeamSelector(props: TeamSelectorProps) {
    const teamNames = api.plays.getTeams.useQuery().data!;
    const [teamSelected, setTeamSelected] = useState<string>()

    // make a query to get the games for the selected team that is disabled by default, and then refetch it teamSelected changes
    const { data: gameData, refetch } = api.plays.getGamesByTeam.useQuery({team: teamSelected!}, { enabled: false })
    useEffect(() => {
        if (teamSelected) {
            refetch()
        }
    }, [teamSelected, refetch])

    const gameDataArr = []

    if (gameData) {
        for (const game of gameData) {
            gameDataArr.push({
                homeTeam: game.home_team,
                awayTeam: game.away_team,
                gameId: game.game_id,
            })
        }
    }

    console.log(gameDataArr);

    return (
        <>
            <div className="flex w-full justify-between">
                {teamNames && <Select 
                    data={teamNames}
                    placeholder="Select a team"
                    searchable
                    itemComponent={SelectTeamItem}
                    onChange={(value) => {
                        console.log('ONCHANGE', value)
                        setTeamSelected(value!)
                    }}
                    className="w-1/2"
                    icon={teamSelected && <TeamIcon team={teamSelected} sizePx={20}/>}
                />}
                {teamSelected && <Select 
                data={gameDataArr.map((item) => {
                    return item.gameId
                })}
                placeholder="Select a game"
                searchable
                onChange={(value) => {
                    props.onSelect(value!)
                }}
                />
                }
            </div>
        </>
    )
}