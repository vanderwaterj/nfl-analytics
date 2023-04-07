import {
    Accordion,
    AccordionHeader,
    AccordionBody,
  } from "@material-tailwind/react";

import TeamIcon from "./TeamIcon";

import { Play } from "@prisma/client";
import { useState } from "react";

interface DriveAccordionProps {
    gameData: GameData;
}

function Icon({ id, open }:{id: number, open: number}) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className={`${
          id === open ? "rotate-180" : ""
        } h-5 w-5 transition-transform`}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
      </svg>
    );
};


export default function DriveAccordion(props: DriveAccordionProps) {
    const [open, setOpen] = useState(-1);

    const handleOpen = (value: number) => {
        setOpen(open == value ? 0 : value);
    }

    const gameData = props.gameData;
    const driveData = gameData.driveData;

    if (!driveData) return <div>No data...</div>;

    return (
        <>
            {driveData.map((drive, driveIndex) => {
                return (
                    <Accordion open={open === driveIndex + 1} icon={<Icon id={driveIndex + 1} open={open} />}>
                        <AccordionHeader onClick={() => handleOpen(driveIndex + 1)}>
                            <div className="flex w-full justify-between">
                                <div className="flex flex-row space-x-1 left-0justify-center items-center">
                                    <TeamIcon team={drive.posTeam} sizePx={40} />
                                    <span className="text-sm">{drive.result} - {drive.numPlays} play{drive.numPlays !== 1 ? 's' : ''}</span>
                                </div>
                                <div className="flex flex-row space-x-2 right-0">
                                    <div className="flex flex-col">
                                        <TeamIcon team={gameData.homeTeam} sizePx={20} />
                                        <span className="text-sm">{drive.homeScoreAfterDrive}</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <TeamIcon team={gameData.awayTeam} sizePx={20} />
                                        <span className="text-sm">{drive.awayScoreAfterDrive}</span>
                                    </div>     
                                </div>  
                            </div>
                        </AccordionHeader>
                        <AccordionBody>
                            <ul className="flex flex-col" key={driveIndex + 1}>
                                {drive?.playData.map((play, playIndex) => {
                                    return (
                                        <li key={playIndex + 1}>
                                            {play.desc}
                                        </li>
                                    )
                                })}
                            </ul>
                        </AccordionBody>
                    </Accordion>
                )
            })}
        </>
    )
}