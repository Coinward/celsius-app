import axios from "axios";
import apiUrl from "./api-url";

const simplexService = {
  getQuote,
  createPaymentRequest,
  getAllPayments,
};

/**
 * Gets all Simplex payment requests for user
 *
 * @returns {Promise}
 */
function getAllPayments() {
  return axios.get(`${apiUrl}/simplex/payment`);
}

/**
 * Gets Simplex quote for a user
 * @param {string} coin
 * @param {string} fiatCurrency
 * @param {string} requestedCurrency
 * @param {string} amount
 * @returns {Promise}
 */
function getQuote(coin, fiatCurrency, requestedCurrency, amount) {
  return axios.post(`${apiUrl}/simplex/quote`, {
    coin,
    fiat_currency: fiatCurrency,
    requested_currency: requestedCurrency,
    amount: !amount ? "0" : amount,
  });
}

/**
 * Creates Payment Request for Simplex
 * @param {object} payment
 * @param {string} payment.quote_id - id from simplex quote
 * @param {string} payment.coin - BTC|ETH
 * @param {number} payment.amount - amount in crypto from simplex quote
 * @param {number} payment.fiat_amount - total amount in fiat
 * @param {string} payment.fiat_currency - USD
 * @param {number} payment.fiat_base_amount - fiat amount without fees
 * @param {object} verification
 * @param {string} verification.pin
 * @param {string} verification.twoFactorCode
 * @returns {Promise}
 */
function createPaymentRequest(payment, verification) {
  return axios.post(`${apiUrl}/simplex/payment`, {
    ...payment,
    ...verification,
  });
}

export default simplexService;
