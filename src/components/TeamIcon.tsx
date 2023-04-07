interface TeamIconProps {
    team: string;
    sizePx: number;
}

export default function TeamIcon(props: TeamIconProps) {

    const url = `./teamicons/${props.team}.svg`;

    return (
        <>
            <img src={url} alt={props.team} width={props.sizePx} height={props.sizePx} />
        </>
    )
}