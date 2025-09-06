-- CreateTable
CREATE TABLE "persons" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "age" INTEGER,
    "gender" TEXT,
    "description" TEXT NOT NULL,
    "lastSeen" DATETIME,
    "lastLocation" TEXT,
    "photos" TEXT,
    "status" TEXT NOT NULL DEFAULT 'missing',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "informations" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "personId" TEXT NOT NULL,
    "informantName" TEXT NOT NULL,
    "informantPhone" TEXT,
    "informantEmail" TEXT,
    "sightingDate" DATETIME,
    "sightingLocation" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "photos" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "archived" BOOLEAN NOT NULL DEFAULT false,
    "archivedAt" DATETIME,
    CONSTRAINT "informations_personId_fkey" FOREIGN KEY ("personId") REFERENCES "persons" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
