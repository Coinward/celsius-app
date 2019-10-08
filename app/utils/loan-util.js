import { LOAN_PAYMENT_TYPES, LOAN_STATUS, LOAN_TYPES } from "../constants/DATA";
import STYLES from "../constants/STYLES";
import logger from "./logger-util";
import formatter from "./formatter";
import store from "../redux/store";

const loanUtil = {
  mapLoan,
};

function mapLoan(loan) {
  const newLoan = { ...loan };
  newLoan.uiProps = getLoanStatusDetails(loan);
  newLoan.uiSections = getLoanSections(loan);
  newLoan.amortization_table = flagPaidPayments(loan);
  newLoan.margin_call = getMarginCallParams(loan)

  if (newLoan.id) {
    // NOTE should probably be removed or updated once BE is done
    newLoan.total_interest = getTotalInterest(newLoan);
    newLoan.total_interest_paid = getInterestPaid(newLoan);
    newLoan.hasInterestPaymentFinished = isInterestPaid(newLoan) && !!Number(newLoan.total_interest_paid)
    newLoan.isPrincipalPaid = isPrincipalPaid(newLoan)

    newLoan.max_possible_prepayment_period = getMaxPossiblePrepaymentPeriod(newLoan)
    newLoan.maxPossiblePrepaymentPeriod = getMaxPossiblePrepaymentPeriod(newLoan)
    newLoan.canPrepayInterest = [LOAN_STATUS.ACTIVE, LOAN_STATUS.APPROVED].includes(loan.status) && newLoan.can_pay_interest && newLoan.maxPossiblePrepaymentPeriod >= 6
  }


  logger.log({ newLoan })

  return newLoan
}

function getLoanStatusDetails(loan) {
  const commonProps = {
    displayAmount: loan.type === LOAN_TYPES.USD_LOAN
      ? formatter.usd(loan.loan_amount)
      : formatter.crypto(loan.loan_amount, loan.coin_loan_asset, { noPrecision: true })
  }

  switch (loan.status) {
    case LOAN_STATUS.ACTIVE:
    case LOAN_STATUS.APPROVED:
      return {
        ...commonProps,
        color: STYLES.COLORS.CELSIUS_BLUE,
        displayText: "Active Loan",
        collateral: "Collateral:"
      };

    case LOAN_STATUS.PENDING:
      return {
        ...commonProps,
        color: STYLES.COLORS.ORANGE,
        displayText: "Pending Loan",
        collateral: "Estimated Collateral:"
      };

    case LOAN_STATUS.COMPLETED:
      return {
        ...commonProps,
        color: STYLES.COLORS.GREEN,
        displayText: "Completed Loan",
        collateral: "Unlocked Collateral:"
      };

    case LOAN_STATUS.REJECTED:
      return {
        ...commonProps,
        color: STYLES.COLORS.RED,
        displayText: "Loan rejected",
        collateral: "Estimated Collateral:"
      };

    case LOAN_STATUS.CANCELED:
      return {
        ...commonProps,
        color: STYLES.COLORS.RED,
        displayText: "Canceled Loan",
        collateral: "Estimated Collateral:"
      };

    default:
      break;
  }
};

function getLoanSections(loan) {
  switch(loan.status) {
    case LOAN_STATUS.ACTIVE:
    case LOAN_STATUS.APPROVED:
      return ["initiation:date", "collateral", "term", "annualInterest", "marginCall", "liquidation", "nextInterest", "maturity"];
    case LOAN_STATUS.PENDING:
      return ["initiation:date", "estimated:collateral", "term", "annualInterest", "marginCall", "liquidation", "firstInterest"];
    case LOAN_STATUS.COMPLETED:
      return ["completion:date", "initiation:date", "unlocked:collateral", "term", "annualInterest"];
    case LOAN_STATUS.CANCELED:
      return ["cancellation:date", "initiation:date", "term", "annualInterest"];
    case LOAN_STATUS.REJECTED:
      return ["rejection:date", "initiation:date", "term", "annualInterest"];
    default:
      break;
  }
}

function flagPaidPayments(loan) {
  if (!loan.amortization_table || !loan.amortization_table.length) return []

  const amortizationTable = loan.amortization_table.map(p => ({
    ...p,
    amountPaid: p.status === 'PAID' ? p.amountToPay : 0,
    isPaid: p.status === 'PAID',
  }))

  return amortizationTable
}

function isInterestPaid(loan) {
  let areAllPaymentsMade = !!loan.amortization_table.length
  loan.amortization_table
    .filter(row => row.type === LOAN_PAYMENT_TYPES.MONTHLY_INTEREST)
    .forEach(row => {
      areAllPaymentsMade = areAllPaymentsMade && row.isPaid
    })

  return areAllPaymentsMade
}

function getTotalInterest(loan) {
  let totalInterest = 0
  loan.amortization_table
    .filter(row => row.type === LOAN_PAYMENT_TYPES.MONTHLY_INTEREST)
    .forEach(row => {
      totalInterest += Number(row.amountToPay)
    })

  return totalInterest.toFixed(2)
}


function getInterestPaid(loan) {
  let interestPaid = 0
  loan.amortization_table
    .filter(row => row.type === LOAN_PAYMENT_TYPES.MONTHLY_INTEREST)
    .forEach(row => {
      interestPaid += Number(row.amountPaid)
    })

  return interestPaid.toFixed(2)
}

function getMaxPossiblePrepaymentPeriod(loan) {
  const numOfInterestPayments = loan.amortization_table
    .filter(row => row.type === LOAN_PAYMENT_TYPES.MONTHLY_INTEREST)
    .length

  const numOfPaidInterestPayments = loan.amortization_table
    .filter(row => (row.type === LOAN_PAYMENT_TYPES.MONTHLY_INTEREST && row.isPaid))
    .length

  const paymentsLeft = numOfInterestPayments - numOfPaidInterestPayments

  return paymentsLeft > 12 ? 12 : paymentsLeft
}

function isPrincipalPaid(loan) {
  const principalPayment = loan.amortization_table
    .find(row => row.type === LOAN_PAYMENT_TYPES.RECEIVING_PRINCIPAL_BACK)

  return principalPayment.isPaid
}

function getMarginCallParams(loan) {
  if (!loan.margin_call_activated) return;

  // Fix for loans before margin call
  if (loan.margin_call.margin_call_amount === 'NaN' || loan.margin_call.margin_call_usd_amount === 'NaN') return;

  const walletSummary = store.getState().wallet.summary;
  const hasEnoughOriginalCoin = !!walletSummary.coins.find(coin => coin.short === loan.margin_call.collateral_coin && Number(coin.amount) >= Number(loan.margin_call.margin_call_amount));
  const hasEnoughOtherCoins = !!walletSummary.coins.find(coin => Number(loan.margin_call.margin_call_amount) <= Number(coin.amount));

 return {
    ...loan.margin_call,
    hasEnoughOriginalCoin,
    hasEnoughOtherCoins
  }
}

export default loanUtil
