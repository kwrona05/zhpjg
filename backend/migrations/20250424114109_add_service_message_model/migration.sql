-- CreateTable
CREATE TABLE "ServiceMessage" (
    "id" SERIAL NOT NULL,
    "text" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ServiceMessage_pkey" PRIMARY KEY ("id")
);
