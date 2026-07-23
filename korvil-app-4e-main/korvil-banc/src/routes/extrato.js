// ==============================================================
// Rotas de Extrato
// GET /api/extrato          -> lista movimentacoes + saldo consolidado
// Filtros: ?modulo=k-th
// ==============================================================
import { Router } from "express";
import { prisma } from "../lib/prisma.js";

export const extratoRouter = Router();

// Status que contam como "recebido/confirmado"
const STATUS_PAGO = ["RECEIVED", "CONFIRMED"];

extratoRouter.get("/", async (req, res) => {
  const { modulo } = req.query;
  const where = {};
  if (modulo) where.modulo = String(modulo);

  // Todas as cobrancas (movimentacoes)
  const cobrancas = await prisma.cobranca.findMany({
    where,
    include: { repasse: true, cliente: true },
    orderBy: { criadoEm: "desc" },
  });

  // Calcula os totais para o "saldo atual"
  const pagas = cobrancas.filter((c) => STATUS_PAGO.includes(c.status));
  const totalBruto = pagas.reduce((s, c) => s + c.valor, 0);
  const totalLiquido = pagas.reduce((s, c) => s + (c.valorLiquido ?? 0), 0);
  const totalPendente = cobrancas
    .filter((c) => c.status === "PENDING")
    .reduce((s, c) => s + c.valor, 0);

  // Total ja repassado (DONE)
  const repassesDone = await prisma.repasse.findMany({ where: { status: "DONE" } });
  const totalRepassado = repassesDone.reduce((s, r) => s + r.valor, 0);

  return res.json({
    saldo: {
      totalBruto: Number(totalBruto.toFixed(2)),
      totalLiquido: Number(totalLiquido.toFixed(2)),
      totalPendente: Number(totalPendente.toFixed(2)),
      totalRepassado: Number(totalRepassado.toFixed(2)),
      // saldo disponivel = liquido recebido ainda nao repassado
      saldoDisponivel: Number((totalLiquido - totalRepassado).toFixed(2)),
    },
    movimentacoes: cobrancas,
  });
});
