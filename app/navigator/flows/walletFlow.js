import { createStackNavigator } from 'react-navigation'
import CoinDetails from '../../components/screens/CoinDetails/CoinDetails'
import WalletLanding from '../../components/screens/WalletLanding/WalletLanding'
import WalletInterest from '../../components/screens/WalletInterest/WalletInterest'
import AllTransactions from '../../components/screens/AllTransactions/AllTransactions'
import BalanceHistory from '../../components/screens/BalanceHistory/BalanceHistory'
import TransactionDetails from '../../components/screens/TransactionDetails/TransactionDetails'
import Profile from '../../components/screens/Profile/Profile'
import { defaultNavigationOptions, transitionConfig } from '../navigationConfig'
import Deposit from '../../components/screens/Deposit/Deposit'
import { celPayFlow } from './celPayFlow'
import { withdrawFlow } from './withdrawFlow'


const walletFlow = {
  screens: {
    WalletLanding,
    WalletInterest,
    BalanceHistory,
    CoinDetails,
    AllTransactions,
    TransactionDetails,
    Profile,
    Deposit,
    ...celPayFlow.screens,
    ...withdrawFlow.screens
  },
  props: {
    initialRouteName: 'WalletLanding',
    defaultNavigationOptions,
    transitionConfig
  }
}

export const walletNavigator = createStackNavigator(walletFlow.screens, walletFlow.props);