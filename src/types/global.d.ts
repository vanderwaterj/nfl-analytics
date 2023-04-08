import type { Play } from "@prisma/client";

declare global {
    export type Drive = {
        playData: Play[];
        driveNum: number;
        posTeam: string;
        defTeam: string;
        result: string;
        numPlays: number;
        homeScoreAfterDrive: number;
        awayScoreAfterDrive: number; 
    }

    export type GameData = {
        gameId: string;
        homeTeam: string;
        awayTeam: string;
        driveData: Drive[];
    }
}
