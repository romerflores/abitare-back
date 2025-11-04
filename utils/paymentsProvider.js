// utils/paymentsProvider.js
async function createPaymentOrder({ facturaId, amount, description }) {
  // Aquí integrarías la API de la pasarela
  // Ejemplo: llamar a https://api.pasarela/create con clave, recibir checkout_url o payment_id
  return {
    provider: 'tigo_sandbox',
    checkout_url: 'https://pasarela.test/checkout/abc123',
    payment_id: 'external-123'
  };
}

async function verifyWebhookSignature(req) {
  // validar firma si la pasarela la manda
  return true;
}

module.exports = { createPaymentOrder, verifyWebhookSignature };
