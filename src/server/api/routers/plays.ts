import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const playsRouter = createTRPCRouter({
    getAll: publicProcedure.query(({ ctx }) => {
        const plays = ctx.prisma.play.findMany();
        return plays;
    }),

    deleteAll: publicProcedure.query( async ({ ctx }) => {
        const plays = await ctx.prisma.play.deleteMany({});
        return plays;
    }),

    getTeams: publicProcedure.query(async ({ ctx }) => {
        const teams = await ctx.prisma.play.findMany({
            select: {
                away_team: true,
                home_team: true,
            },
        });

        const teamNames = teams.map((team) => {
            return team.away_team;
        });

        const uniqueTeamNames = [...new Set(teamNames)].sort();

        return uniqueTeamNames;
    }),

    getPlaysByGameId: publicProcedure.input(z.object({
        gameId: z.string(),
    })).query(async ({ ctx, input }) => {
        const plays = await ctx.prisma.play.findMany({
            where: {
                game_id: input.gameId,
            },
        });

        console.log(plays)
        return plays;
    }),

    // write a procedure to get all the games for a team
    getGamesByTeam: publicProcedure.input(z.object({
        team: z.string(),
    })).query(async ({ ctx, input }) => {
        const games = await ctx.prisma.play.findMany({
            where: {
                OR: [
                    {
                        away_team: input.team,
                    },
                    {
                        home_team: input.team,
                    },
                ],
                NOT: {
                    game_id: undefined,
                },
            }, 
            distinct: ["game_id"],
        });

        return games;
    }),
    
    create: publicProcedure.input(z.object({
        away_team: z.string(),
        home_team: z.string(),

        posteam: z.string().optional(),
        defteam: z.string().optional(),

        desc: z.string(),
        down: z.number().optional(),
        drive: z.number().optional(),
        drive_start_yard_line: z.string().optional(),
        drive_end_yard_line: z.string().optional(),
        drive_end_transition: z.string().optional(),
        drive_play_count: z.number().optional(),
        drive_play_id_ended: z.string().optional(),

        game_date: z.date(),
        game_id: z.string(),

        play_id: z.string(),
        play_type: z.string().optional(),
        total_away_score: z.number(),
        total_home_score: z.number(),

        time: z.string(),

        ydstogo: z.number(),
        yrdln: z.string().optional(),
    })).mutation( async ({ctx, input}) => {
        const play = await ctx.prisma.play.create({
            data: {
                away_team: input.away_team,
                home_team: input.home_team,

                posteam: input.posteam,
                defteam: input.defteam,

                desc: input.desc,
                down: input.down,
                drive: input.drive,
                drive_start_yard_line: input.drive_start_yard_line,
                drive_end_yard_line: input.drive_end_yard_line,
                drive_end_transition: input.drive_end_transition,
                drive_play_count: input.drive_play_count,
                drive_play_id_ended: input.drive_play_id_ended,
                
                game_date: input.game_date,
                game_id: input.game_id,

                play_id: input.play_id,
                play_type: input.play_type,
                total_away_score: input.total_away_score,
                total_home_score: input.total_home_score,

                time: input.time,

                ydstogo: input.ydstogo,
                yrdln: input.yrdln,
            }
        });
    // console.log(play);
    return play;
    }),
});