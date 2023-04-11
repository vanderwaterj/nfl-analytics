import { forwardRef,  useState } from "react";
import { Select } from '@mantine/core'
import TeamIcon from "./TeamIcon";

interface TeamSelectorProps {
    onChange: (gameId: string) => void;
    teams: string[];
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
    const teamNames = props.teams;
    const [teamSelected, setTeamSelected] = useState<string>()

    return (
        <>
            {teamNames && <Select 
                className="p-1"
                data={teamNames}
                placeholder="Select a team"
                searchable
                itemComponent={SelectTeamItem}
                onChange={(value) => {
                    setTeamSelected(value!)
                    props.onChange(value!)
                }}
                icon={teamSelected && <TeamIcon team={teamSelected} sizePx={20}/>}
            />}
        </>
    )
}

/**
 * <Select 
                data={gameDataArr.map((item) => {
                    return item.gameId
                })}
                placeholder="Select a game"
                searchable
                onChange={(value) => {
                    props.onSelect(value!)
                }}
                className="w-1/2"
                />
 */