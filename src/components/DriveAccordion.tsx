import { Accordion, Table } from '@mantine/core';

import TeamIcon from "./TeamIcon";

interface DriveAccordionProps {
    gameData: GameData;
}

export default function DriveAccordion(props: DriveAccordionProps) {
    const gameData = props.gameData;
    const driveData = gameData.driveData;

    if (!driveData) return <div>No data...</div>;

    return (
        <Accordion>
            {driveData.map((drive, driveIndex) => {
                return (
                    <Accordion.Item key={driveIndex} value={driveIndex.toString()}>
                        <Accordion.Control>
                            <div className="flex w-full justify-between">
                                <div className="flex flex-row space-x-1 left-0 justify-center items-center">
                                    <TeamIcon team={drive.posTeam} sizePx={20} />
                                    <span className="text-sm">{drive.result} - {drive.numPlays} play{drive.numPlays !== 1 ? 's' : ''}</span>
                                </div>
                                <div className="flex flex-row space-x-2 right-0 items-center">
                                    <div className="flex flex-col">
                                        <TeamIcon team={gameData.homeTeam} sizePx={20} />
                                        <span className="text-sm text-center">{drive.homeScoreAfterDrive}</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <TeamIcon team={gameData.awayTeam} sizePx={20} />
                                        <span className="text-sm text-center">{drive.awayScoreAfterDrive}</span>
                                    </div>     
                                </div> 
                            </div>
                        </Accordion.Control>
                        <Accordion.Panel>
                            <Table>
                                <thead>
                                    <tr>
                                        <th>Description</th>
                                        <th>Down & Distance</th>
                                        <th>Yard Line</th>
                                        <th>Time</th>
                                    </tr>
                                    {
                                        drive?.playData.map((play, playIndex) => {
                                            return (
                                                <tr key={playIndex + 1}>
                                                    <td>{play.desc}</td>
                                                    {(play.down) ? <td>{play.down} & {play.ydstogo}</td> : <td></td>}
                                                    <td>{play.yrdln}</td>
                                                    <td>{play.time}</td>
                                                </tr>
                                            )
                                        })
                                    }
                                </thead>
                            </Table>
                        </Accordion.Panel>
                    </Accordion.Item>
                )}
            )}
        </Accordion>
    )
}