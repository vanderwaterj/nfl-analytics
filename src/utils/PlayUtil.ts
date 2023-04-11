import type { Play } from "@prisma/client";

const getDriveDataFromPlayData = (data: Play[]): Drive[] => {
    const driveData: Drive[] = [];
    // For each play in data, check to see if there is a drive in driveData with a matching driveNum to play.drive
    // If there is, add the play to the playData array of that drive
    // If there isn't, create a new drive with the play as the first playData

    if (data.length === 0) return driveData;

    data.forEach((play) => {
        // If the play does not have a drive, skip it
        if (!play.drive) return;

        const driveIndex = driveData.findIndex(drive => drive.driveNum === play.drive);
        if (driveIndex === -1) {
            driveData.push({
                playData: [play],
                driveNum: play.drive,
                posTeam: play.posteam!,
                defTeam: play.defteam!,
                result: play.drive_end_transition!,
                numPlays: play.drive_play_count!,
                homeScoreAfterDrive: play.total_home_score,
                awayScoreAfterDrive: play.total_away_score,
            })
        } else {
            driveData[driveIndex]!.playData.push(play);

            if (play.total_home_score > driveData[driveIndex]!.homeScoreAfterDrive) {
                driveData[driveIndex]!.homeScoreAfterDrive = play.total_home_score;
            }

            if (play.total_away_score > driveData[driveIndex]!.awayScoreAfterDrive) {
                driveData[driveIndex]!.awayScoreAfterDrive = play.total_away_score;
            }

            if (!driveData[driveIndex]!.posTeam && play.posteam && play.defteam) {
                driveData[driveIndex]!.posTeam = play.posteam
                driveData[driveIndex]!.posTeam = play.defteam
            } 
        }
    })

    // Within each element of driveData, sort the playData array by the play's play_id
    driveData.forEach((drive) => {
        drive.playData.sort((a, b) => parseInt(a.play_id) - parseInt(b.play_id));
    })
    // Sort driveData by its corresponding driveNum
    driveData.sort((a, b) => a.driveNum - b.driveNum);

    return driveData;
}

export const getGameDataFromPlayData = (data: Play[]): GameData => {
    const driveData = getDriveDataFromPlayData(data);

    if (driveData.length === 0) {
        if (data[0]) {
            return ({
                gameId: data[0].game_id,
                homeTeam: data[0].home_team,
                awayTeam: data[0].away_team,
                driveData: [],
            } as GameData)
        } else {
            return ({
                gameId: '',
                homeTeam: '',
                awayTeam: '',
                driveData: [],
            } as GameData)
        }
    }

    // Get the first drive from driveData, if it exists. Otherwise, return null.
    const firstDrive = driveData[0];

    // Get the first play from the first drive
    const firstPlay = firstDrive?.playData[0];

    return ({
        gameId: firstPlay!.game_id,
        homeTeam: firstPlay!.home_team,
        awayTeam: firstPlay!.away_team,  
        driveData: driveData, 
    } as GameData)
}