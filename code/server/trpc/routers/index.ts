import { z } from 'zod'
import { publicProcedure, router } from '../trpc'
import prisma from '~/utils/prisma'

export const appRouter = router({
  getBoardNames: publicProcedure.query(async () => {
    const t = await prisma.board.findMany({
      select: {
        id: true,
        name: true
      }
    })
    await prisma.$disconnect()
    return t
  }),
  getBoardTasks: publicProcedure
    .input(z.object({ id: z.nullable(z.string()) }))
    .query(async ({ input: { id } }) => {
      if (!id) {
        await prisma.$disconnect()
        return null
      }

      const t = await prisma.board.findFirst({
        where: {
          id
        },
        include: {
          columns: {
            select: {
              id: true,
              name: true,
              tasks: {
                include:{
                  subTasks: true
                }
              },
            }
          }
        }
      })
        await prisma.$disconnect()
      return t
    }),
    getParentColumnStatuses: publicProcedure
    .input(z.object({taskId: z.string()}))
    .query(async({input: { taskId }})=>{
      function removeDuplicates(tasks: Array<{status: string}>){
        const sortedArray = tasks.sort((a, b) => {
          if (a.status < b.status) {
            return -1;
          }
          if (a.status > b.status) {
            return 1;
          }
          return 0;
        });

        return sortedArray.filter((obj, index, self) => {
          return index === 0 || obj.status !== self[index - 1].status; 
        })
      }

        const parentColumn = await prisma.task.findFirst({
          where: {
            id: taskId
          },
          select: {
            columnId: true,
          }
        })

        const parentBoard = await prisma.column.findFirst({
          where: {
            id: parentColumn?.columnId as string
          },
          select: {
            boardId: true
          }
        })

        const columnStatuses = await prisma.board.findMany({
          where:{
            id: parentBoard?.boardId as string
          },
          select:{
            columns:{
              select:{
                tasks:{
                  select:{
                    status: true
                  }
                }
              }
            }
          },
        })

        await prisma.$disconnect()

        return columnStatuses[0].columns.map(column => removeDuplicates(column.tasks)).flat()
      
      
    }) ,
  getTask: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input: { id } }) => {
      const t = await prisma.task.findUnique({
        where: {
          id,
        },
        include:{
          subTasks: true
        }
      })
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
        await prisma.$disconnect()
      return t
    }),
    updateTask: publicProcedure
    .input(z.object({
      id:z.string(),
      status:z.nullable(z.string()),
      subTasks: z.nullable(z.array(z.object({
        id:z.string(),
        isCompleted:z.boolean()
      })))
    })).mutation(async ({ input: { id, status, subTasks } }) => {
      await prisma.$transaction(async (tx) => {
        if(status !== null){
          await tx.task.update({
            where:{
              id
            },
            data:{
              status,
            }
          })
      }

        if(subTasks !== null){
          await tx.task.update({
            where:{
              id
            },
            data:{
              subTasks:{
                update: subTasks.map(subTask => ({
                  where:{
                    id: subTask.id
                  },
                  data:{
                    isCompleted: subTask.isCompleted
                  }
                }))
              }
            }
          })
        }
      })

      await prisma.$disconnect()
    })
})

// export type definition of API
export type AppRouter = typeof appRouter
