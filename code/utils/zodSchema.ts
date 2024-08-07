import { z } from "zod";

export const updateTaskSchema = z.object({
  id: z.string(),
  userId: z.string(),
  title: z.string().optional(),
  description: z.string().optional(),
  status: z.string().optional(),
  subTasks: z
    .array(
      z.object({
        id: z.string().nullable(),
        title: z.string(),
        isCompleted: z.boolean(),
      })
    )
    .optional(),
});

export const addNewBoardSchema = z.object({
  user: z.object({
    id: z.string(),
    firstName: z.string(),
    lastName: z.string(),
    email: z.string().email().optional(),
    picture: z.string().optional(),
  }),
  boardName: z.string(),
  columns: z.array(z.object({ name: z.string() })).nullable(),
});

export const addNewTaskSchema = z.object({
  userId: z.string(),
  boardId: z.string(),
  title: z.string(),
  description: z.string().optional(),
  status: z.string(),
  subTasks: z
    .array(
      z.object({
        title: z.string(),
      })
    )
    .optional(),
});

export const getTaskSchema = z.object({ id: z.string(), userId: z.string() });

export const getUserIdSchema = z.object({ userId: z.string() });

export const getBoardIdSchema = z.object({
  userId: z.string(),
  boardName: z.string(),
});

export const getBoardTasksSchema = z.object({
  id: z.nullable(z.string()),
  userId: z.string(),
});

export const getAvailableStatusSchema = z.object({
  taskId: z.string(),
  userId: z.string(),
});

export const deleteBoardSchema = z.object({
  boardId: z.string(),
  userId: z.string(),
});

export const deleteTaskSchema = z.object({
  id: z.string(),
  userId: z.string(),
});

export const updateBoardSchema = z.object({
  board: z.object({ id: z.string(), name: z.string().optional() }),
  columns: z.array(z.object({ id: z.string(), name: z.string() })),
  userId: z.string(),
});

export const formTask = z.object({
  taskTitle: z
    .string({
      required_error: "title is required",
    })
    .min(1),
  taskDescription: z.string().optional(),
  taskStatus: z.string(),
  subTasks: z
    .array(
      z.object({
        id: z.string().nullable().default(null),
        title: z
          .string({
            required_error: "can't be empty",
          })
          .min(1),
        isCompleted: z.boolean().default(false),
      })
    )
    .optional(),
});
