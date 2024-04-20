import { publicProcedure, router } from "../trpc";
import * as db from "~/utils/db";
import * as s from "~/utils/zodSchema";

export const appRouter = router({
  getBoardNames: publicProcedure.query(db.queryBoardNames),

  getBoardTasks: publicProcedure
    .input(s.getBoardTasksSchema)
    .query(({ input: { id } }) => db.queryBoardTasks(id)),

  getAllStatus: publicProcedure
    .input(s.getAvailableStatusSchema)
    .query(({ input: { taskId } }) => db.queryAvailableStatus(taskId)),

  getTask: publicProcedure
    .input(s.getTaskSchema)
    .query(({ input: { id } }) => db.queryTask(id)),

  addNewBoard: publicProcedure
    .input(s.addNewBoardSchema)
    .mutation(({ input: { boardName, columns } }) =>
      db.addNewBoard(boardName, columns)
    ),

  updateBoard: publicProcedure
    .input(s.updateBoardSchema)
    .mutation(({ input: { boardId, columns } }) =>
      db.updateBoard(boardId, columns)
    ),

  deleteBoard: publicProcedure
    .input(s.deleteBoardSchema)
    .mutation(({ input: { boardId } }) => db.deleteBoard(boardId)),

  addNewTask: publicProcedure
    .input(s.addNewTaskSchema)
    .mutation(({ input: { title, description, status, subTasks } }) =>
      db.addNewTask(title, status, description, subTasks)
    ),

  updateTask: publicProcedure
    .input(s.updateTaskSchema)
    .mutation(({ input: { id, title, status, description, subTasks } }) =>
      db.updateTask(id, title, status, description, subTasks)
    ),

  deleteTask: publicProcedure
    .input(s.deleteTaskSchema)
    .mutation(({ input: { id } }) => db.deleteTask(id)),
});

// export type definition of API
export type AppRouter = typeof appRouter;
