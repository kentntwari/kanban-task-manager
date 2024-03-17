import type { inferRouterInputs, inferRouterOutputs } from '@trpc/server';
import type { AppRouter } from '@/server/trpc/routers';

export type Board=inferRouterOutputs<AppRouter>['getBoardNames']
export type Task = inferRouterOutputs<AppRouter>['getTask']