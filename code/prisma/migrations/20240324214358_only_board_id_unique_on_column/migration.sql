/*
  Warnings:

  - A unique constraint covering the columns `[board_id]` on the table `columns` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "columns_board_id_name_key";

-- CreateIndex
CREATE UNIQUE INDEX "columns_board_id_key" ON "columns"("board_id");
