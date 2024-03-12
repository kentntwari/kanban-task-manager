import { z } from 'zod'
import { publicProcedure, router } from '../trpc'
import prisma from '~/utils/prisma'

export const appRouter = router({
  getAllTasks: publicProcedure.query(async () => {
    const t = await prisma.board.findMany({
      include: {
        columns: {
          select: {
            id: true,
            name: true,
            tasks: true
          }
        }
      }
    })
    console.log(t)
    await prisma.$disconnect()
    return t
  }),
  getTask: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input: { id } }) => {
      const t = await prisma.task.findUnique({
        where: {
          id,
        }
      })
      console.log(t)
      await prisma.$disconnect()
      return t
    }),
  addNewBoard: publicProcedure
    .input(z.object({ boardName: z.string(), columns: z.array(z.string()) }))
    .mutation(async ({ input: { boardName, columns } }) => {
      const t = await prisma.board.create({
        data: {
          name: boardName,
          columns: {
            create: columns.map(name => ({ name }))
          }
        }
      })

      const x = await prisma.board.findUnique({
        where: {
          id: t.id
        },
        include: {
          columns: {
            select: {
              name: true
            }
          }
        }
      })
      await prisma.$disconnect()
      return x
    }),
  addNewColumn: publicProcedure
    .input(z.object({ boardId: z.string(), columnName: z.string() }))
    .mutation(async ({ input: { boardId, columnName } }) => {
      const t = await prisma.column.create({
        data: {
          name: columnName,
          board: {
            connect: {
              id: boardId
            }
          }
        }
      })

      console.log(t)
      await prisma.$disconnect()
      return t
    }),
  addNewTask: publicProcedure
    .input(z.object({
      title: z.string(),
      description: z.string(),
      status: z.string(),
      subTasks: z.array(z.string()),
      columnId: z.string()
    })).mutation(async ({ input: { title, description, status, subTasks, columnId } }) => {
      const t = await prisma.task.create({
        data: {
          title,
          description,
          status,
          subTasks: {
            create: subTasks.map(title => ({ title, isCompleted: false }))
          },
          column: {
            connect: {
              id: columnId
            }
          }
        }
      })
      console.log(t)
      await prisma.$disconnect()
      return t
    })
})

// export type definition of API
export type AppRouter = typeof appRouter
