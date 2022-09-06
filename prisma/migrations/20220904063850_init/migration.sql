-- CreateTable
CREATE TABLE "Users" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "isAdmin" BOOLEAN NOT NULL DEFAULT false,
    "password" TEXT NOT NULL,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Houses" (
    "id" SERIAL NOT NULL,
    "price" INTEGER NOT NULL,
    "location" DOUBLE PRECISION[],
    "address" TEXT NOT NULL,
    "area" INTEGER NOT NULL,
    "images" TEXT[],
    "advertiserId" INTEGER NOT NULL,

    CONSTRAINT "Houses_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Users_email_key" ON "Users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Houses_location_key" ON "Houses"("location");

-- AddForeignKey
ALTER TABLE "Houses" ADD CONSTRAINT "Houses_advertiserId_fkey" FOREIGN KEY ("advertiserId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
