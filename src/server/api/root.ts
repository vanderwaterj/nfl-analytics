import { createTRPCRouter } from "~/server/api/trpc";
import { playsRouter } from "~/server/api/routers/plays";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  plays: playsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
