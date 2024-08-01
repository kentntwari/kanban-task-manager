import { publicProcedure, router } from "../trpc";
import * as db from "~/utils/db";
import * as s from "~/utils/zodSchema";

export const appRouter = router({
  getBoardNames: publicProcedure
    .input(s.getUserIdSchema)
    .query(({ input: { userId } }) => db.queryBoardNames(userId)),

  getBoardId: publicProcedure
    .input(s.getBoardIdSchema)
    .query(({ input: { userId, boardName } }) =>
      db.queryBoardId(userId, boardName)
    ),

  getBoardTasks: publicProcedure
    .input(s.getBoardTasksSchema)
    .query(({ input: { id, userId } }) => db.queryBoardTasks(id, userId)),

  getAllStatus: publicProcedure
    .input(s.getAvailableStatusSchema)
    .query(({ input: { taskId, userId } }) =>
      db.queryAvailableStatus(taskId, userId)
    ),

  getTask: publicProcedure
    .input(s.getTaskSchema)
    .query(({ input: { id, userId } }) => db.queryTask(id, userId)),

  addNewBoard: publicProcedure
    .input(s.addNewBoardSchema)
    .mutation(({ input: { user, boardName, columns } }) =>
      db.addNewBoard(boardName, columns, user)
    ),

  updateBoard: publicProcedure
    .input(s.updateBoardSchema)
    .mutation(({ input: { board, columns, userId } }) =>
      db.updateBoard(board, columns, userId)
    ),

  deleteBoard: publicProcedure
    .input(s.deleteBoardSchema)
    .mutation(({ input: { boardId, userId } }) =>
      db.deleteBoard(boardId, userId)
    ),

  addNewTask: publicProcedure
    .input(s.addNewTaskSchema)
    .mutation(
      ({ input: { userId, boardId, title, description, status, subTasks } }) =>
        db.addNewTask(userId, boardId, title, status, description, subTasks)
    ),

  updateTask: publicProcedure
    .input(s.updateTaskSchema)
    .mutation(
      ({ input: { id, userId, title, status, description, subTasks } }) =>
        db.updateTask(id, userId, title, status, description, subTasks)
    ),

  deleteTask: publicProcedure
    .input(s.deleteTaskSchema)
    .mutation(({ input: { id, userId } }) => db.deleteTask(id, userId)),
});

// export type definition of API
export type AppRouter = typeof appRouter;
