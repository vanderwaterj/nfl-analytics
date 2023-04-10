import { forwardRef, useEffect, useState } from "react";
import { Select } from '@mantine/core'
import { api } from "~/utils/api";
import type { Play } from "@prisma/client";
import TeamIcon from "./TeamIcon";
import { getGameDataFromPlayData } from '../utils/PlayUtil'
import TeamGameSelector from './TeamGameSelector'

interface TeamSelectorProps {
    onSelect: (gameId: string) => void;
}

interface TeamItemProps extends React.ComponentPropsWithoutRef<'div'> {
    image: string;
    label: string;
    description: string;
}

interface GameItemProps extends React.ComponentPropsWithoutRef<'div'> {
    home_team: string;
    away_team: string;
    game_id: string;
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

const SelectGameItem = forwardRef<HTMLDivElement, GameItemProps>(
    ({home_team, away_team, game_id, ...others}, ref) => (
        <div ref={ref} {...others}>
            <TeamIcon team={home_team}/>
            <TeamIcon team={away_team}/>
        </div>
    )
);

export default function TeamSelector(props: TeamSelectorProps) {
    const teamNames = api.plays.getTeams.useQuery().data!;
    const [teamSelected, setTeamSelected] = useState<string>()
    const [gameSelected, setGameSelected] = useState<string>()
    const [hasLoaded, setHasLoaded] = useState<boolean>(false)

    // make a query to get the games for the selected team that is disabled by default, and then refetch it teamSelected changes
    const { data: gameData, refetch } = api.plays.getGamesByTeam.useQuery({team: teamSelected!}, { enabled: false })
    useEffect(() => {
        if (teamSelected) {
            refetch()
        }
    }, [teamSelected])

    const gameDataArr = []

    if (gameData) {
        for (const game of gameData!) {
            gameDataArr.push({
                homeTeam: game.home_team,
                awayTeam: game.away_team,
                gameId: game.game_id,
            })
        }
    }

    console.log(gameDataArr);
    
    const renderGameData:string[] = [];

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
                    setGameSelected(value!)
                    props.onSelect(value!)
                }}
                />
                }
            </div>
        </>
    )
}