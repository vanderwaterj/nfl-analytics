import { Select } from '@mantine/core';
import React, { forwardRef } from 'react';

interface GameSelectorProps {
    onChange: (game: GameData) => void;
    games: GameData[];
}

interface GameItemProps extends React.ComponentPropsWithoutRef<'div'> {
    label: string;
}

const SelectGameItem = forwardRef<HTMLDivElement, GameItemProps>(
    ({label, ...others}, ref) => (
        <div ref={ref} {...others}>
            <div className="flex items-center">
                <span>{label}</span>
            </div>
        </div>
    )
);

export default function GameSelector(props: GameSelectorProps) {
    const selectData = props.games.map((game) => {
        return {
            label: `${game.homeTeam} vs ${game.awayTeam}`,
            value: game.gameId,

            homeTeam: game.homeTeam,
            awayTeam: game.awayTeam,
        }
    })

    return (
        <Select 
        className="p-1"
        data={selectData}
        placeholder="Select a game"
        itemComponent={SelectGameItem}
        disabled = {props.games.length === 0}
        onChange={(value) => {
            const gameSelected = props.games.find((game) => game.gameId === value);
            props.onChange(gameSelected!)
            console.log('Game selected:', value);
        }}
        />
    )
}