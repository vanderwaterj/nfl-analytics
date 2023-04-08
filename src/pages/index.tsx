import { type NextPage } from "next";
import { SignInButton, SignOutButton } from "@clerk/nextjs";
import { useUser } from "@clerk/nextjs";
import Head from "next/head";
import DriveAccordion from "../components/DriveAccordion";
import type { Play } from "@prisma/client";
import { api } from "~/utils/api";

const getDriveDataFromPlayData = (data: Play[]): Drive[] => {
    let driveData: Drive[] = [];
    // For each play in data, check to see if there is a drive in driveData with a matching driveNum to play.drive
    // If there is, add the play to the playData array of that drive
    // If there isn't, create a new drive with the play as the first playData

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
        }
    })

    // Sort driveData by its corresponding driveNum
    driveData.sort((a, b) => a.driveNum - b.driveNum);

    return driveData;
}

const getGameDataFromPlayData = (data: Play[]): GameData | undefined => {
    const driveData = getDriveDataFromPlayData(data);

    // Get the first drive from driveData, if it exists. Otherwise, return null.
    const firstDrive = driveData[0];
    if (!firstDrive) return undefined;

    // Get the first play from the first drive
    const firstPlay = firstDrive.playData[0];

    return ({
        gameId: firstPlay!.game_id,
        homeTeam: firstPlay!.home_team,
        awayTeam: firstPlay!.away_team,  
        driveData: driveData, 
    } as GameData)
}

const Home: NextPage = () => {
  const user = useUser();

  const {data, isLoading} = api.plays.getAll.useQuery();

  if (isLoading) return <div>Loading...</div>;
  if (!data) return <div>No data...</div>;

  const gameData = getGameDataFromPlayData(data);

  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex justify-center h-screen">
        <div className="w-full h-full md:max-w-2xl border-x border-slate-400">
            <div className="border-b border-slate-400 p-4">
                {!user.isSignedIn && <div className="flex justify-center"><SignInButton /></div> }
                {!!user.isSignedIn && <div className="flex justify-center"><SignOutButton /></div>}
            </div>
            {gameData && <DriveAccordion gameData={gameData}/>}
        </div>
      </main>
    </>
  );
};

export default Home;
