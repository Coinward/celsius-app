import { createStackNavigator } from 'react-navigation'
import Profile from '../../components/screens/Profile/Profile'
import BorrowLoanOption from '../../components/screens/BorrowLoanOption/BorrowLoanOption'
import BorrowCollateral from '../../components/screens/BorrowCollateral/BorrowCollateral'
import BorrowBankAccount from '../../components/screens/BorrowBankAccount/BorrowBankAccount'
import VerifyProfile from '../../components/screens/VerifyProfile/VerifyProfile'
import Deposit from '../../components/screens/Deposit/Deposit'
import BorrowLoanTerm from '../../components/screens/BorrowLoanTerm/BorrowLoanTerm'
import BorrowLanding from '../../components/screens/BorrowLanding/BorrowLanding'
import BorrowEnterAmount from '../../components/screens/BorrowEnterAmount/BorrowEnterAmount'
import TransactionDetails from '../../components/screens/TransactionDetails/TransactionDetails'
import { defaultNavigationOptions, transitionConfig } from '../navigationConfig'

const borrowFlow = {
  screens: {
    BorrowEnterAmount,
    BorrowCollateral,
    BorrowLoanOption,
    BorrowLoanTerm,
    BorrowBankAccount,
    VerifyProfile,
    BorrowLanding,
    TransactionDetails,
    Profile,
    Deposit
  },
  props: {
    initialRouteName: 'BorrowLanding',
    defaultNavigationOptions,
    transitionConfig
  }
}

export const borrowNavigator = createStackNavigator(borrowFlow.screens, borrowFlow.props);