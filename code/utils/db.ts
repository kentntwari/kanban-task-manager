import prisma from "~/utils/prisma";
import { getRandomColor } from "~/utils/colors";
import { Prisma } from "@prisma/client";

export async function queryBoardNames(userId: string) {
  try {
    const boardNames = await prisma.board.findMany({
      where: {
        userId,
      },
      select: {
        id: true,
        name: true,
      },
    });

    await prisma.$disconnect();

    if (boardNames.length > 0) return boardNames;
    return null;
  } catch (error) {
    logErrors(error);
  }
}

export async function queryBoardId(userId: string, boardName: string) {
  try {
    const boardId = await prisma.board.findFirst({
      where: {
        name: boardName,
        userId,
      },
      select: {
        id: true,
      },
    });

    await prisma.$disconnect();
    return boardId;
  } catch (error) {
    logErrors(error);
  }
}

export async function queryBoardTasks(id: string | null, userId: string) {
  try {
    if (!id) {
      await prisma.$disconnect();
      return null;
    }

    const t = await prisma.board.findFirst({
      where: {
        id,
        userId,
      },
      include: {
        columns: {
          select: {
            id: true,
            name: true,
            color: true,
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

export async function queryTask(id: string | null, userId: string) {
  try {
    if (!id) {
      await prisma.$disconnect();
      return null;
    }
    const t = await prisma.task.findUnique({
      where: {
        id,
        column: {
          board: {
            userId,
          },
        },
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

export async function queryAvailableStatus(taskId: string, userId: string) {
  try {
    const task = await prisma.task.findFirst({
      where: {
        id: taskId,
        column: {
          board: {
            userId,
          },
        },
      },
      select: {
        columnId: true,
      },
    });

    if (!task || !task.columnId) {
      await prisma.$disconnect();
      return null;
    }

    const column = await prisma.column.findFirst({
      where: {
        id: task.columnId,
      },
      select: {
        boardId: true,
      },
    });

    const columnNames = await prisma.column.findMany({
      where: {
        boardId: column?.boardId,
      },
      select: {
        name: true,
      },
    });

    await prisma.$disconnect();
    return columnNames;
  } catch (error) {
    logErrors(error);
  }
}

export async function addNewBoard(
  boardName: string,
  columns: { name: string }[] | null,
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email?: string;
    picture?: string;
  }
) {
  try {
    const currentUser = await prisma.user.upsert({
      where: {
        id: user.id,
      },
      update: {},
      create: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: !user.email ? null : user.email,
        picture: !user.picture ? null : user.picture,
      },
    });

    if (!columns) {
      return await prisma.board.create({
        data: {
          name: boardName,
          user: {
            connect: {
              id: currentUser.id,
            },
          },
        },
      });
    }

    const t = await prisma.board.create({
      data: {
        name: boardName,
        columns: {
          create: columns.map((column) => ({
            name: column.name,
            color: getRandomColor(),
          })),
        },
        user: {
          connect: {
            id: currentUser.id,
          },
        },
      },
    });

    const x = await prisma.board.findUnique({
      where: {
        id: t.id,
        userId: currentUser.id,
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
    console.error("issue here");
    // logErrors(error);
  }
}

export async function deleteBoard(boardId: string, userId: string) {
  try {
    await prisma.board.delete({
      where: {
        id: boardId,
        userId,
      },
    });
    await prisma.$disconnect();
  } catch (error) {
    logErrors(error);
  }
}

export async function updateBoard(
  board: { id: string; name?: string },
  columns: { id: string; name: string }[],
  userId: string
) {
  try {
    if (board.name) {
      await prisma.board.update({
        where: {
          id: board.id,
          userId,
        },
        data: {
          name: board.name,
        },
      });
    }

    if (columns.length === 0) {
      await prisma.board.update({
        where: {
          id: board.id,
          userId,
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
        board: {
          id: board.id,
          userId,
        },
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
          board: {
            userId,
          },
        },
      });
    }

    let retryCount = 0;
    await Promise.allSettled(
      columns.map(async (column) => {
        try {
          while (retryCount < 5) {
            await prisma.column.upsert({
              where: { id: column.id, board: { userId } },
              update: {
                name: column.name,
              },
              create: {
                name: column.name,
                color: getRandomColor(),
                board: {
                  connect: {
                    id: board.id,
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
            // wait for 1 second before retrying
            await new Promise((resolve) => setTimeout(resolve, 1000));
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
  userId: string,
  boardId: string,
  title: string,
  status: string,
  description?: string,
  subTasks?: { title: string }[]
) {
  try {
    const matchingColumn = await prisma.column.findFirst({
      where: {
        name: status,
        board: {
          id: boardId,
          userId,
        },
      },
      select: {
        id: true,
        board: {
          select: {
            name: true,
          },
        },
      },
    });

    switch (true) {
      case !description && subTasks !== undefined:
        await prisma.column.update({
          where: {
            id: matchingColumn?.id,
            board: {
              userId,
            },
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
            board: {
              userId,
            },
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
            board: {
              userId,
            },
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
  userId: string,
  title?: string,
  status?: string,
  description?: string,
  subTasks?: {
    id: string | null;
    title: string;
    isCompleted: boolean;
  }[]
) {
  try {
    //UPDATE THE TITLE IF IT EXISTS
    if (title) {
      await prisma.task.update({
        where: {
          id,
          column: {
            board: {
              userId,
            },
          },
        },
        data: {
          title,
        },
      });
    }

    // UPDATE THE STATUS IF IT EXITS
    if (status) {
      // FIND WHERE THE CURRENT PARENT COLUMN BEFORE UPDDATE
      const currentColumnName = await prisma.task.findFirst({
        where: {
          id,
          column: {
            board: {
              userId,
            },
          },
        },
        select: {
          column: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      // CHANGE COLUMNS IF STATUS IS DEIFFERENT FROM CURRENT COLUMN NAME
      if (currentColumnName && status !== currentColumnName.column?.name) {
        await prisma.column.update({
          where: {
            id: currentColumnName.column?.id,
            board: {
              userId,
            },
          },
          data: {
            tasks: {
              disconnect: {
                id,
              },
            },
          },
        });

        const matchingColumn = await prisma.column.findFirst({
          where: {
            name: status,
            board: {
              userId,
            },
          },
          select: {
            id: true,
          },
        });

        await prisma.column.update({
          where: {
            id: matchingColumn?.id,
            board: {
              userId,
            },
          },
          data: {
            tasks: {
              connect: {
                id,
              },
            },
          },
        });
      }

      // JUST UPDATE THE STATUS IF SIMILAR
      if (currentColumnName && status === currentColumnName.column?.name)
        await prisma.task.update({
          where: {
            id,
            column: {
              board: {
                userId,
              },
            },
          },
          data: {
            status,
          },
        });
    }

    // UPDATE THE DESCRIPTION IF IT EXISTS
    if (description) {
      await prisma.task.update({
        where: {
          id,
          column: {
            board: {
              userId,
            },
          },
        },
        data: {
          description,
        },
      });
    }

    // DELETE ALL SUBTASKS IF INCOMING SUBTASKS IS EMPTY
    if (subTasks?.length === 0) {
      await prisma.subTask.deleteMany({
        where: { task: { column: { board: { userId } } } },
      });
    }

    // UPDATE EXISTING SUBTASKS AND CREATE NEW ONES IF THERE ARE ANY
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
              column: {
                board: {
                  userId,
                },
              },
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
              column: {
                board: {
                  userId,
                },
              },
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

export async function deleteTask(taskId: string, userId: string) {
  try {
    await prisma.task.delete({
      where: {
        id: taskId,
        column: {
          board: {
            userId,
          },
        },
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
