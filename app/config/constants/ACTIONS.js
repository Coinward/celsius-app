export default {
  // api actions
  START_API_CALL: 'START_API_CALL',
  API_ERROR: 'API_ERROR',
  CLEAR_API_ERROR: 'CLEAR_API_ERROR',
  SET_INTERNET_CONNECTIVITY: 'SET_INTERNET_CONNECTIVITY',

  // navigation actions
  NAVIGATE: 'Navigation/NAVIGATE',

  // general data actions
  GET_SUPPORTED_CURRENCIES_SUCCESS: 'GET_SUPPORTED_CURRENCIES_SUCCESS',

  // ui actions
  SHOW_MESSAGE: 'SHOW_MESSAGE',
  CLEAR_MESSAGE: 'CLEAR_MESSAGE',
  SET_HEADER_HEIGHT: 'SET_HEADER_HEIGHT',
  TOGGLE_CAMERA: 'TOGGLE_CAMERA',
  FLIP_CAMERA: 'FLIP_CAMERA',
  TAKE_CAMERA_PHOTO: 'TAKE_CAMERA_PHOTO',
  UPDATE_FORM_FIELD: 'UPDATE_FORM_FIELD',
  ACTIVATE_CAMERA: 'ACTIVATE_CAMERA',
  DEACTIVATE_CAMERA: 'DEACTIVATE_CAMERA',
  RETAKE_PHOTO: 'RETAKE_PHOTO',
  INIT_FORM: 'INIT_FORM',
  CLEAR_FORM: 'CLEAR_FORM',
  UPDATE_PORTFOLIO_FORM_DATA: 'UPDATE_PORTFOLIO_FORM_DATA',

  // portfolio actions
  CREATE_PORTFOLIO_SUCCESS: 'CREATE_PORTFOLIO_SUCCESS',
  GET_PORTFOLIO_SUCCESS: 'GET_PORTFOLIO_SUCCESS',
  GET_ESTIMATED_LOAN_SUCCESS: 'GET_ESTIMATED_LOAN_SUCCESS',
  GET_ESTIMATED_INTEREST_SUCCESS: 'GET_ESTIMATED_INTEREST_SUCCESS',

  // auth actions
  LOGIN_USER_SUCCESS: 'LOGIN_USER_SUCCESS',
  LOGIN_BORROWER_SUCCESS: 'LOGIN_BORROWER_SUCCESS',
  GET_LOGGED_IN_BORROWER_SUCCESS: 'GET_LOGGED_IN_BORROWER_SUCCESS',
  REGISTER_USER_SUCCESS: 'REGISTER_USER_SUCCESS',
  REGISTER_USER_TWITTER_SUCCESS: 'REGISTER_USER_TWITTER_SUCCESS',
  LOGIN_USER_TWITTER_SUCCESS: 'LOGIN_USER_TWITTER_SUCCESS',
  REGISTER_USER_FACEBOOK_SUCCESS: 'REGISTER_USER_FACEBOOK_SUCCESS',
  LOGIN_USER_FACEBOOK_SUCCESS: 'LOGIN_USER_FACEBOOK_SUCCESS',
  REGISTER_USER_GOOGLE_SUCCESS: 'REGISTER_USER_GOOGLE_SUCCESS',
  LOGIN_USER_GOOGLE_SUCCESS: 'LOGIN_USER_GOOGLE_SUCCESS',
  UPDATE_USER_SUCCESS: 'UPDATE_USER_SUCCESS',
  REGISTER_BORROWER_SUCCESS: 'REGISTER_BORROWER_SUCCESS',
  REGISTER_EXISTING_BORROWER_SUCCESS: 'REGISTER_EXISTING_BORROWER_SUCCESS',
  SET_USER_LOCATION: 'SET_USER_LOCATION',
  SEND_RESET_LINK_SUCCESS: 'SEND_RESET_LINK_SUCCESS',
  RESET_PASSWORD_SUCCESS: 'RESET_PASSWORD_SUCCESS',
  LOGOUT_USER: 'LOGOUT_USER',
  UPDATE_USER_APP_SETTINGS: 'UPDATE_USER_APP_SETTINGS',

  // 3rd party user on-boarding
  TWITTER_GET_ACCESS_TOKEN: 'TWITTER_GET_ACCESS_TOKEN',
  TWITTER_SUCCESS: 'TWITTER_SUCCESS',
  TWITTER_CLOSE: 'TWITTER_CLOSE',
  TWITTER_OPEN: 'TWITTER_OPEN',
  FACEBOOK_SUCCESS: 'FACEBOOK_SUCCESS',
  GOOGLE_GET_ACCESS_TOKEN: 'GOOGLE_GET_ACCESS_TOKEN',
  GOOGLE_SUCCESS: 'GOOGLE_SUCCESS',
  GOOGLE_CLOSE: 'GOOGLE_CLOSE',
  GOOGLE_OPEN: 'GOOGLE_OPEN',

  // user actions
  GET_USER_PERSONAL_INFO_SUCCESS: 'GET_USER_PERSONAL_INFO_SUCCESS',
  UPDATE_USER_PERSONAL_INFO_SUCCESS: 'UPDATE_PERSONAL_USER_INFO_SUCCESS',
  UPDATE_USER_PERSONAL_INFO_ERROR: 'UPDATE_PERSONAL_USER_INFO_ERROR',
  TOGGLE_TERMS_OF_USE: 'TOGGLE_TERMS_OF_USE',
  UPLOAD_PLOFILE_IMAGE_SUCCESS: 'UPLOAD_PLOFILE_IMAGE_SUCCESS',
  CREATE_KYC_DOCUMENTS_SUCCESS: 'CREATE_KYC_DOCUMENTS_SUCCESS',
  GET_KYC_DOCUMENTS_SUCCESS: 'GET_KYC_DOCUMENTS_SUCCESS',
  SEND_VERIFICATION_SMS_SUCCESS: 'SEND_VERIFICATION_SMS_SUCCESS',
  VERIFY_SMS_SUCCESS: 'VERIFY_SMS_SUCCESS',
  START_KYC_SUCCESS: 'START_KYC_SUCCESS',
  GET_KYC_STATUS_SUCCESS: 'GET_KYC_STATUS_SUCCESS',

  // wallet actions
  GET_WALLET_DETAILS_SUCCESS: 'GET_WALLET_DETAILS_SUCCESS',
  GET_COIN_BALANCE_SUCCESS: 'GET_COIN_BALANCE_SUCCESS',
  GET_COIN_ADDRESS_SUCCESS: 'GET_COIN_ADDRESS_SUCCESS',
  GET_COIN_ORIGINATING_ADDRESS_SUCCESS: 'GET_COIN_ORIGINATING_ADDRESS_SUCCESS',
  WITHDRAW_CRYPTO_SUCCESS: 'WITHDRAW_CRYPTO_SUCCESS',
  GET_TRANSACTION_DETAILS_SUCCESS: 'GET_TRANSACTION_DETAILS_SUCCESS',
  GET_ALL_TRANSACTIONS_SUCCESS: 'GET_ALL_TRANSACTIONS_SUCCESS',
  GET_COIN_TRANSACTIONS_SUCCESS: 'GET_COIN_TRANSACTIONS_SUCCESS',
  SET_PIN: 'SET_PIN_SUCCESS',
  SET_PIN_SUCCESS: 'SET_PIN_SUCCESS',
  STORE_PIN: 'STORE_PIN',
  CHECK_USER_PIN_STATUS: 'CHECK_USER_PIN_STATUS',
  CHECK_USER_PIN_STATUS_SUCCESS: 'CHECK_USER_PIN_STATUS_SUCCESS',
}
