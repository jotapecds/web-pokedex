-- CreateTable
CREATE TABLE "Pokemon" (
    "codigo" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "codigo_tipo_primario" INTEGER NOT NULL,
    "codigo_tipo_secundario" INTEGER,
    CONSTRAINT "Pokemon_codigo_tipo_primario_fkey" FOREIGN KEY ("codigo_tipo_primario") REFERENCES "Tipo" ("codigo") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Pokemon_codigo_tipo_secundario_fkey" FOREIGN KEY ("codigo_tipo_secundario") REFERENCES "Tipo" ("codigo") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Tipo" (
    "codigo" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL
);
