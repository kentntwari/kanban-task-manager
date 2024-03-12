/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `boards` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[board_id,name]` on the table `columns` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "boards_name_key" ON "boards"("name");

-- CreateIndex
CREATE UNIQUE INDEX "columns_board_id_name_key" ON "columns"("board_id", "name");
