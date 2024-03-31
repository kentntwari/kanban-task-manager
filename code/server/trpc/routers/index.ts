import { z } from "zod";
import { publicProcedure, router } from "../trpc";
import * as db from "~/utils/db";

export const appRouter = router({
	getBoardNames: publicProcedure.query(db.queryBoardNames),

	getBoardTasks: publicProcedure
		.input(z.object({ id: z.nullable(z.string()) }))
		.query(({ input: { id } }) => db.queryBoardTasks(id)),

	getAvailableStatus: publicProcedure
		.input(z.object({ taskId: z.string() }))
		.query(({ input: { taskId } }) => db.queryAvailableStatus(taskId)),

	getTask: publicProcedure
		.input(z.object({ id: z.string() }))
		.query(({ input: { id } }) => db.queryTask(id)),

	addNewBoard: publicProcedure
		.input(
			z.object({
				boardName: z.string(),
				columns: z.array(z.object({ name: z.string() })).nullable(),
			})
		)
		.mutation(({ input: { boardName, columns } }) =>
			db.addNewBoard(boardName, columns)
		),

	deleteBoard: publicProcedure
		.input(z.object({ boardId: z.string() }))
		.mutation(({ input: { boardId } }) => db.deleteBoard(boardId)),

	editColumn: publicProcedure
		.input(
			z.object({
				boardId: z.string(),
				columns: z.array(z.object({ id: z.string(), name: z.string() })),
			})
		)
		.mutation(({ input: { boardId, columns } }) =>
			db.editColumn(boardId, columns)
		),

	addNewTask: publicProcedure
		.input(
			z.object({
				title: z.string(),
				description: z.string().nullable(),
				status: z.string(),
				subTasks: z.array(z.object({ title: z.string() })).nullable(),
			})
		)
		.mutation(({ input: { title, description, status, subTasks } }) =>
			db.addNewTask(title, description, status, subTasks)
		),

	updateTask: publicProcedure
		.input(
			z.object({
				id: z.string(),
				status: z.nullable(z.string()),
				subTasks: z.nullable(
					z.array(
						z.object({
							id: z.string(),
							isCompleted: z.boolean(),
						})
					)
				),
			})
		)
		.mutation(({ input: { id, status, subTasks } }) =>
			db.updateTask(id, status, subTasks)
		),

	deleteTask: publicProcedure
		.input(z.object({ id: z.string() }))
		.mutation(({ input: { id } }) => db.deleteTask(id)),
});

// export type definition of API
export type AppRouter = typeof appRouter;
