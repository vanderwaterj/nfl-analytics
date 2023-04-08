import Image from "next/image";

interface TeamIconProps {
    team: string;
    sizePx?: number;
}

export default function TeamIcon(props: TeamIconProps) {

    const url = `./teamicons/${props.team}.svg`;

    return (
        <>
            <Image src={url} alt={props.team} width={props?.sizePx} height={props?.sizePx}/>
        </>
    )
}

// <img src={url} alt={props.team} width={props.sizePx} height={props.sizePx} />