// ==============================================================
// Servico de notificacao WhatsApp (integracao interna)
// Chama o webhook interno POST /whatsapp-korvil/ para disparar msg.
// ==============================================================
import axios from "axios";
import { env } from "../config/env.js";
import { logger } from "../lib/logger.js";

/**
 * Notifica o sistema de WhatsApp que uma cobranca foi paga.
 * @param {object} cobranca - registro Cobranca (com cliente incluso)
 */
export async function notificarWhatsapp(cobranca) {
  try {
    const payload = {
      evento: "PAGAMENTO_CONFIRMADO",
      cobrancaId: cobranca.id,
      modulo: cobranca.modulo,
      tipo: cobranca.tipo,
      valor: cobranca.valor,
      cliente: {
        nome: cobranca.cliente?.nome,
        telefone: cobranca.cliente?.telefone,
        email: cobranca.cliente?.email,
      },
      mensagem: `Pagamento de R$ ${cobranca.valor.toFixed(2)} confirmado no modulo ${cobranca.modulo}. Obrigado!`,
    };

    await axios.post(env.whatsappWebhookUrl, payload, { timeout: 10000 });
    await logger.info("whatsapp", "notificacao_enviada", { cobrancaId: cobranca.id });
  } catch (err) {
    // Falha de notificacao nao deve quebrar o fluxo de pagamento/repasse
    await logger.error("whatsapp", "erro_notificacao", {
      cobrancaId: cobranca.id,
      erro: err.message,
    });
  }
}
