// ==============================================================
// Rotas de Cobrancas (dinamicas - billingType UNDEFINED)
// POST /api/cobrancas        -> cria cobranca dinamica no Asaas
// GET  /api/cobrancas        -> lista cobrancas (filtro ?modulo=)
// GET  /api/cobrancas/:id    -> detalhe
// ==============================================================
import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import { logger } from "../lib/logger.js";
import { criarCobrancaAsaas, criarClienteAsaas } from "../services/asaas.js";
import { moduloValido } from "../modules/index.js";

export const cobrancasRouter = Router();

// Tipos de cobranca aceitos
const TIPOS_VALIDOS = ["ASSINATURA", "UNICO", "INSCRICAO"];

// Cria uma cobranca dinamica
cobrancasRouter.post("/", async (req, res) => {
  try {
    const { clienteId, cliente, modulo, tipo, valor, parcelas = 1, descricao } = req.body;

    // Validacoes de negocio
    if (!modulo || !moduloValido(modulo)) {
      return res.status(400).json({ erro: "Modulo invalido.", modulo });
    }
    if (!tipo || !TIPOS_VALIDOS.includes(tipo)) {
      return res.status(400).json({ erro: "Tipo invalido. Use ASSINATURA, UNICO ou INSCRICAO." });
    }
    if (!valor || Number(valor) <= 0) {
      return res.status(400).json({ erro: "Valor deve ser maior que zero." });
    }

    // Resolve o cliente: usa clienteId existente OU cria um novo a partir de "cliente"
    let clienteRegistro = null;
    if (clienteId) {
      clienteRegistro = await prisma.cliente.findUnique({ where: { id: clienteId } });
      if (!clienteRegistro) return res.status(404).json({ erro: "Cliente nao encontrado." });
    } else if (cliente && cliente.nome) {
      const asaasCustomer = await criarClienteAsaas(cliente);
      clienteRegistro = await prisma.cliente.create({
        data: {
          nome: cliente.nome,
          email: cliente.email,
          cpfCnpj: cliente.cpfCnpj,
          telefone: cliente.telefone,
          asaasId: asaasCustomer.id,
        },
      });
    } else {
      return res.status(400).json({ erro: "Informe 'clienteId' ou os dados de 'cliente'." });
    }

    // 1) Cria o registro local (status PENDING) para obter o id de referencia
    const cobranca = await prisma.cobranca.create({
      data: {
        clienteId: clienteRegistro.id,
        modulo,
        tipo,
        parcelas: Number(parcelas),
        valor: Number(valor),
        descricao: descricao || `KORVIL ${modulo} - ${tipo}`,
        status: "PENDING",
      },
    });

    // 2) Cria a cobranca DINAMICA no Asaas (billingType UNDEFINED)
    const payment = await criarCobrancaAsaas({
      asaasCustomerId: clienteRegistro.asaasId,
      valor: Number(valor),
      descricao: cobranca.descricao,
      referenciaExterna: cobranca.id,
      parcelas: Number(parcelas),
    });

    // 3) Atualiza a cobranca local com dados do Asaas
    const atualizada = await prisma.cobranca.update({
      where: { id: cobranca.id },
      data: {
        asaasId: payment.id,
        invoiceUrl: payment.invoiceUrl,
        status: payment.status || "PENDING",
      },
    });

    await logger.info("api", "cobranca_criada", { cobrancaId: atualizada.id, modulo });
    return res.status(201).json(atualizada);
  } catch (err) {
    await logger.error("api", "erro_criar_cobranca", { erro: err.message });
    return res.status(500).json({ erro: "Falha ao criar cobranca.", detalhe: err.message });
  }
});

// Lista cobrancas, com filtro opcional por modulo (?modulo=k-th)
cobrancasRouter.get("/", async (req, res) => {
  const { modulo, status } = req.query;
  const where = {};
  if (modulo) where.modulo = String(modulo);
  if (status) where.status = String(status);

  const cobrancas = await prisma.cobranca.findMany({
    where,
    include: { cliente: true, repasse: true },
    orderBy: { criadoEm: "desc" },
  });
  return res.json(cobrancas);
});

// Detalhe de uma cobranca
cobrancasRouter.get("/:id", async (req, res) => {
  const cobranca = await prisma.cobranca.findUnique({
    where: { id: req.params.id },
    include: { cliente: true, repasse: true },
  });
  if (!cobranca) return res.status(404).json({ erro: "Cobranca nao encontrada." });
  return res.json(cobranca);
});
