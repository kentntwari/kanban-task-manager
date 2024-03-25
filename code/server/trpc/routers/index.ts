import { z } from "zod";
import { Prisma } from "@prisma/client";
import { publicProcedure, router } from "../trpc";
import prisma from "~/utils/prisma";

export const appRouter = router({
	getBoardNames: publicProcedure.query(async () => {
		const t = await prisma.board.findMany({
			select: {
				id: true,
				name: true,
			},
		});
		await prisma.$disconnect();
		return t;
	}),
	getBoardTasks: publicProcedure
		.input(z.object({ id: z.nullable(z.string()) }))
		.query(async ({ input: { id } }) => {
			if (!id) {
				await prisma.$disconnect();
				return null;
			}

			const t = await prisma.board.findFirst({
				where: {
					id,
				},
				include: {
					columns: {
						select: {
							id: true,
							name: true,
							tasks: {
								include: {
									subTasks: true,
								},
							},
						},
					},
				},
			});
			await prisma.$disconnect();
			return t;
		}),
	getAvailableStatus: publicProcedure
		.input(z.object({ taskId: z.string() }))
		.query(async ({ input: { taskId } }) => {
			const parentColumn = await prisma.task.findFirst({
				where: {
					id: taskId,
				},
				select: {
					id: true,
				},
			});

			const parentBoard = await prisma.column.findFirst({
				where: {
					id: parentColumn?.id,
				},
				select: {
					id: true,
				},
			});

			const AllStatuses = await prisma.task.findMany({
				distinct: ["status"],
				where: {
					column: {
						boardId: parentBoard?.id,
					},
				},
				select: {
					status: true,
				},
			});

			return AllStatuses.filter((x) => x.status !== "");
		}),
	getTask: publicProcedure
		.input(z.object({ id: z.string() }))
		.query(async ({ input: { id } }) => {
			const t = await prisma.task.findUnique({
				where: {
					id,
				},
				include: {
					subTasks: true,
				},
			});
			await prisma.$disconnect();
			return t;
		}),
	addNewBoard: publicProcedure
		.input(
			z.object({
				boardName: z.string(),
				columns: z.array(z.object({ name: z.string() })).nullable(),
			})
		)
		.mutation(async ({ input: { boardName, columns } }) => {
			if (!columns) {
				return await prisma.board.create({
					data: {
						name: boardName,
					},
				});
			}

			const t = await prisma.board.create({
				data: {
					name: boardName,
					columns: {
						create: columns.map((column) => ({ name: column.name })),
					},
				},
			});
			const x = await prisma.board.findUnique({
				where: {
					id: t.id,
				},
				include: {
					columns: {
						select: {
							name: true,
						},
					},
				},
			});
			await prisma.$disconnect();
			return x;
		}),
	addNewColumn: publicProcedure
		.input(
			z.object({
				boardId: z.string(),
				columns: z.array(z.object({ id: z.string(), name: z.string() })),
			})
		)
		.mutation(async ({ input: { boardId, columns } }) => {
			if (columns.length > 0) {
				await Promise.all(
					columns.map(async (column) => {
						try {
							await prisma.column.upsert({
								where: { id: column.id },
								update: {},
								create: {
									name: column.name,
									board: {
										connect: {
											id: boardId,
										},
									},
								},
							});
						} catch (error) {
							if (
								error instanceof Prisma.PrismaClientKnownRequestError &&
								error.code === "P2002"
							) {
								console.log("Column already exists");
							}
						}
					})
				);

				return await prisma.$disconnect();
			} else {
				console.log(columns);
				await prisma.column.deleteMany({
					where: {
						id: boardId,
					},
				});

				return await prisma.$disconnect();
			}
		}),
	addNewTask: publicProcedure
		.input(
			z.object({
				title: z.string(),
				description: z.string(),
				status: z.string(),
				subTasks: z.array(z.string()),
				columnId: z.string(),
			})
		)
		.mutation(
			async ({ input: { title, description, status, subTasks, columnId } }) => {
				const t = await prisma.task.create({
					data: {
						title,
						description,
						status,
						subTasks: {
							create: subTasks.map((title) => ({ title, isCompleted: false })),
						},
						column: {
							connect: {
								id: columnId,
							},
						},
					},
				});
				await prisma.$disconnect();
				return t;
			}
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
		.mutation(async ({ input: { id, status, subTasks } }) => {
			await prisma.$transaction(async (tx) => {
				if (status !== null) {
					await tx.task.update({
						where: {
							id,
						},
						data: {
							status,
						},
					});
				}

				if (subTasks !== null) {
					await tx.task.update({
						where: {
							id,
						},
						data: {
							subTasks: {
								update: subTasks.map((subTask) => ({
									where: {
										id: subTask.id,
									},
									data: {
										isCompleted: subTask.isCompleted,
									},
								})),
							},
						},
					});
				}
			});

			await prisma.$disconnect();
		}),
});

// export type definition of API
export type AppRouter = typeof appRouter;
