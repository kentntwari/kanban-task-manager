import prisma from "~/utils/prisma";
import { Prisma } from "@prisma/client";

export async function queryBoardNames() {
  try {
    const boardNames = await prisma.board.findMany({
      select: {
        id: true,
        name: true,
      },
    });

    await prisma.$disconnect();
    return boardNames;
  } catch (error) {
    logErrors(error);
  }
}

export async function queryBoardTasks(id: string | null) {
  try {
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
  } catch (error) {
    logErrors(error);
  }
}

export async function queryTask(id: string | null) {
  try {
    if (!id) {
      await prisma.$disconnect();
      return null;
    }
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
  } catch (error) {
    logErrors(error);
  }
}

export async function queryAvailableStatus(taskId: string | null) {
  try {
    if (!taskId) {
      await prisma.$disconnect();
      return null;
    }

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

    const allStatuses = await prisma.task.findMany({
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

    await prisma.$disconnect();
    return allStatuses.filter((x) => x.status !== "");
  } catch (error) {
    logErrors(error);
  }
}

export async function addNewBoard(
  boardName: string,
  columns: { name: string }[] | null
) {
  try {
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
  } catch (error) {
    logErrors(error);
  }
}

export async function deleteBoard(boardId: string) {
  try {
    await prisma.board.delete({
      where: {
        id: boardId,
      },
    });
    await prisma.$disconnect();
  } catch (error) {
    logErrors(error);
  }
}

export async function editColumn(
  boardId: string,
  columns: { id: string; name: string }[]
) {
  try {
    if (columns.length === 0) {
      await prisma.board.update({
        where: {
          id: boardId,
        },
        data: {
          columns: {
            deleteMany: {},
          },
        },
      });
      await prisma.$disconnect();
    }

    const existingColumns = await prisma.column.findMany({
      where: {
        boardId,
      },
      select: {
        id: true,
      },
    });

    const missingIncomingColumns = existingColumns.filter(
      (x) => !columns.some((y) => y.id === x.id)
    );

    if (missingIncomingColumns.length > 0) {
      await prisma.column.deleteMany({
        where: {
          id: {
            in: missingIncomingColumns.map((x) => x.id),
          },
        },
      });
    }

    let retryCount = 0;
    await Promise.all(
      columns.map(async (column) => {
        try {
          while (retryCount < 5) {
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
            break;
          }
        } catch (error) {
          if (
            error instanceof Prisma.PrismaClientKnownRequestError &&
            error.code === "P2002"
          ) {
            retryCount++;
            await new Promise((resolve) => setTimeout(resolve, 1000)); // wait for 1 second before retrying
          } else {
            console.log("error", error);
          }
        }
      })
    );
    return await prisma.$disconnect();
  } catch (error) {
    logErrors(error);
  }
}

export async function addNewTask(
  title: string,
  status: string,
  description?: string,
  subTasks?: { title: string }[]
) {
  try {
    const matchingColumn = await prisma.column.findFirst({
      where: {
        name: status,
      },
      select: {
        id: true,
      },
    });

    switch (true) {
      case !description && subTasks !== undefined:
        await prisma.column.update({
          where: {
            id: matchingColumn?.id,
          },
          data: {
            tasks: {
              create: {
                title,
                status,
                subTasks: {
                  create: subTasks.map(({ title }) => ({
                    title,
                    isCompleted: false,
                  })),
                },
              },
            },
          },
        });

        await prisma.$disconnect();
        break;

      case description !== undefined && subTasks !== undefined:
        await prisma.column.update({
          where: {
            id: matchingColumn?.id,
          },
          data: {
            tasks: {
              create: {
                title,
                description,
                status,
                subTasks: {
                  create: subTasks.map(({ title }) => ({
                    title,
                    isCompleted: false,
                  })),
                },
              },
            },
          },
        });
        await prisma.$disconnect();
        break;

      default:
        await prisma.column.update({
          where: {
            id: matchingColumn?.id,
          },
          data: {
            tasks: {
              create: {
                title,
                status,
              },
            },
          },
        });
        await prisma.$disconnect();
        break;
    }
  } catch (error) {
    logErrors(error);
  }
}

export async function updateTask(
  id: string,
  title?: string,
  description?: string,
  status?: string,
  subTasks?: {
    id: string | null;
    title: string;
    isCompleted: boolean;
  }[]
) {
  try {
    if (title) {
      await prisma.task.update({
        where: {
          id,
        },
        data: {
          title,
        },
      });
    }

    if (status) {
      await prisma.task.update({
        where: {
          id,
        },
        data: {
          status,
        },
      });
    }

    if (description) {
      await prisma.task.update({
        where: {
          id,
        },
        data: {
          description,
        },
      });
    }

    if (subTasks?.length === 0) {
      await prisma.subTask.deleteMany({});
    }

    if (subTasks && subTasks.length > 0) {
      await prisma.$transaction(async (tx) => {
        // find existing subtasks
        const existingSubTasks = subTasks.filter((x) => x.id !== null);

        //find new potential subtasks
        const newSubTasks = subTasks.filter((x) => x.id === null);

        if (existingSubTasks.length > 0)
          await tx.task.update({
            where: {
              id,
            },
            data: {
              subTasks: {
                update: existingSubTasks.map((x) => ({
                  where: {
                    id: x.id ?? "",
                  },
                  data: {
                    title: x.title,
                    isCompleted: x.isCompleted,
                  },
                })),
              },
            },
          });

        if (newSubTasks.length > 0)
          await tx.task.update({
            where: {
              id,
            },
            data: {
              subTasks: {
                create: newSubTasks.map((x) => ({
                  title: x.title,
                  isCompleted: x.isCompleted,
                })),
              },
            },
          });
      });
    }

    await prisma.$disconnect();
    return;
  } catch (error) {
    logErrors(error);
  }
}

export async function deleteTask(taskId: string) {
  try {
    await prisma.task.delete({
      where: {
        id: taskId,
      },
    });

    await prisma.subTask.deleteMany({
      where: {
        taskId,
      },
    });
    await prisma.$disconnect();
  } catch (error) {
    logErrors(error);
  }
}

function logErrors(error: unknown) {
  switch (true) {
    // This error is thrown when the query is invalid
    case error instanceof Prisma.PrismaClientKnownRequestError:
      console.error("PrismaClientKnownRequestError", error.message);
      break;

    // This error is thrown when the Prisma Client encounters an unknown error
    case error instanceof Prisma.PrismaClientUnknownRequestError:
      console.error("PrismaClientUnknownRequestError", error.message);
      break;

    // This error is thrown when the Prisma Client encounters a Rust panic
    case error instanceof Prisma.PrismaClientRustPanicError:
      console.error("PrismaClientRustPanicError", error.message);
      break;

    // This error is thrown when the Prisma Client could not be initialized
    case error instanceof Prisma.PrismaClientInitializationError:
      console.error("PrismaClientInitializationError", error.message);
      break;

    // This error is thrown when validation fails, read more here: https://www.prisma.io/docs/orm/reference/error-reference
    case error instanceof Prisma.PrismaClientValidationError:
      console.error("PrismaClientValidationError", error.message);
      break;

    // This error is thrown when you try to call `findMany` on an undefined object
    case error instanceof TypeError:
      console.error("TypeError", error.message);
      break;

    default:
      // Unknown error
      console.error("Unknown error", error);
      break;
  }
}
