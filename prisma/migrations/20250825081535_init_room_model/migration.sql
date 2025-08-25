-- CreateTable
CREATE TABLE "Room" (
    "id" SERIAL NOT NULL,
    "ceiling" TEXT NOT NULL,
    "floor" TEXT NOT NULL,
    "walls" TEXT NOT NULL,
    "windows" TEXT,
    "furniture" TEXT,
    "lighting" TEXT,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Room_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Room_userId_key" ON "Room"("userId");

-- AddForeignKey
ALTER TABLE "Room" ADD CONSTRAINT "Room_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
