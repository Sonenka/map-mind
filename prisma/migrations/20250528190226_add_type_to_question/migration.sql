-- CreateTable
CREATE TABLE "Question" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "type" TEXT NOT NULL DEFAULT 'capitals',
    "question" TEXT NOT NULL,
    "options" TEXT NOT NULL,
    "correct" TEXT NOT NULL
);
