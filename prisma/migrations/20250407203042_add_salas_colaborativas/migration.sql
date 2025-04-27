-- CreateTable
CREATE TABLE "Sala" (
    "id" SERIAL NOT NULL,
    "codigo" TEXT NOT NULL,
    "proyectoId" INTEGER NOT NULL,
    "activa" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Sala_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UsuarioSala" (
    "id" SERIAL NOT NULL,
    "salaId" INTEGER NOT NULL,
    "usuarioId" INTEGER NOT NULL,

    CONSTRAINT "UsuarioSala_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Sala_codigo_key" ON "Sala"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "Sala_proyectoId_key" ON "Sala"("proyectoId");

-- CreateIndex
CREATE UNIQUE INDEX "UsuarioSala_salaId_usuarioId_key" ON "UsuarioSala"("salaId", "usuarioId");

-- AddForeignKey
ALTER TABLE "Sala" ADD CONSTRAINT "Sala_proyectoId_fkey" FOREIGN KEY ("proyectoId") REFERENCES "Proyecto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsuarioSala" ADD CONSTRAINT "UsuarioSala_salaId_fkey" FOREIGN KEY ("salaId") REFERENCES "Sala"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsuarioSala" ADD CONSTRAINT "UsuarioSala_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
