import axios from 'axios';
import apiUrl from './api-url';

const kycService = {
  getKYCDocTypes,
};


/**
 * Gets documents that Onfido supports for all countries
 * @todo: move to getCelsiusInitialData
 *
 * @returns {Promise}
 */
function getKYCDocTypes() {
  return axios.get(`${apiUrl}/kyc/countries`);
}

export default kycService;
