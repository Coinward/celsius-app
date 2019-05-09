import React, { Component } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from "redux";
import _ from "lodash";
import { withNavigationFocus } from "react-navigation";

import testUtil from "../../../utils/test-util";
import * as appActions from "../../../redux/actions";
import RegularLayout from "../../layouts/RegularLayout/RegularLayout";
import CelText from "../../atoms/CelText/CelText";
import CoinCard from '../../molecules/CoinCard/CoinCard';
import cryptoUtil from '../../../utils/crypto-util';
import WalletDetailsCard from '../../organisms/WalletDetailsCard/WalletDetailsCard';
import WalletLandingStyle from './WalletLanding.styles';
import CoinListCard from '../../molecules/CoinListCard/CoinListCard';
import LoadingScreen from '../LoadingScreen/LoadingScreen';
import Icon from '../../atoms/Icon/Icon';
import STYLES from '../../../constants/STYLES';
import CelPayReceivedModal from "../../organisms/CelPayReceivedModal/CelPayReceivedModal";
import { WALLET_LANDING_VIEW_TYPES } from '../../../constants/UI'
import TodayInterestRatesModal from "../../organisms/TodayInterestRatesModal/TodayInterestRatesModal";
import BecameCelMemberModal from '../../organisms/BecameCelMemberModal/BecameCelMemberModal';
import { KYC_STATUSES } from "../../../constants/DATA";

@connect(
  state => {
    const branchTransfer = state.branch.transferHash && state.transfers.transfers[state.branch.transferHash]
      ? state.transfers.transfers[state.branch.transferHash]
      : null

    return {
      branchTransfer,
      appSettings: state.user.appSettings,
      currenciesRates: state.currencies.rates,
      walletSummary: state.wallet.summary,
      currenciesGraphs: state.currencies.graphs,
      user: state.user.profile,
      kycStatus: state.user.profile.kyc
        ? state.user.profile.kyc.status
        : KYC_STATUSES.collecting,
    }
  },
  dispatch => ({ actions: bindActionCreators(appActions, dispatch) }),
)
class WalletLanding extends Component {
  static propTypes = {};
  static defaultProps = {}
  static walletFetchingInterval

  static navigationOptions = ({ navigation }) => {
    const { params } = navigation.state
    return {
      title: params && params.title ? params.title : 'Welcome',
      right: 'profile',
      hideBack: true
    }
  };

  constructor(props) {
    super(props);

    const { navigation } = props;

    navigation.setParams({
      title: `Welcome ${props.user.first_name}!`
    })

    this.state = {
      activeView: props.appSettings.default_wallet_view
    };
  }

  componentDidMount = async () => {
    const {actions, appSettings } = this.props;
    if (appSettings && !appSettings.accepted_terms_of_use) {
      return actions.navigateTo("TermsOfUse", {purpose: "accept", nextScreen: "WalletLanding"});
    }

    const { currenciesRates, currenciesGraphs, user } = this.props;

    await actions.getWalletSummary();
    if (!currenciesRates) actions.getCurrencyRates();
    if (!currenciesGraphs) actions.getCurrencyGraphs();
    if (!user.celsius_member) actions.getCelsiusMemberStatus();

    this.setWalletFetchingInterval()
  };

  componentDidUpdate(prevProps) {
    const {isFocused} = this.props;

    if (prevProps.isFocused !== isFocused && isFocused === true) {
      this.setWalletFetchingInterval()
    }

    if (isFocused === false && this.walletFetchingInterval) {
      clearInterval(this.walletFetchingInterval)
    }
  }

  componentWillUnmount() {
    clearInterval(this.walletFetchingInterval)
  }

  setWalletFetchingInterval = () => {
    const { actions } = this.props

    this.walletFetchingInterval = setInterval(() => {
      actions.getWalletSummary()
    }, 5000)
  }

  getIconFillColor = (cond) => cond ? STYLES.COLORS.DARK_GRAY : STYLES.COLORS.DARK_GRAY_OPACITY;

  toggleView = (viewType) => {
    this.setState({ activeView: viewType })
  }

  renderCoinWithAmount = () => {
    const { walletSummary, currenciesRates, currenciesGraphs, actions } = this.props;
    const { activeView } = this.state;

    const coinWithAmount = [];
    if (walletSummary) {
      walletSummary.coins.forEach((coin) => {
        if (coin.amount_usd > 0) {
          coinWithAmount.push(coin)
        }
      });
    }

    const isGrid = activeView === WALLET_LANDING_VIEW_TYPES.GRID

    return coinWithAmount.length ? coinWithAmount.map((coin) => {
      const currency = currenciesRates.find(c => c.short === coin.short.toUpperCase())
      const graphData = !_.isEmpty(currenciesGraphs[coin.short]) ? currenciesGraphs[coin.short] : null;

      // Render grid item
      if (isGrid) {
        return <CoinCard
          key={coin.short}
          coin={coin}
          displayName={currency.displayName}
          currencyRates={currency}
          onCardPress={() => actions.navigateTo('CoinDetails', { coin: coin.short, title: currency.displayName })}
          graphData={graphData}
        />
      }

      // Render list item
      return <CoinListCard
        key={coin.short}
        coin={coin}
        displayName={currency.displayName}
        currencyRates={currency}
        onCardPress={() => actions.navigateTo('CoinDetails', { coin: coin.short, title: currency.displayName })}
      />
    })

      : null;
  }

  renderCoinWithoutAmount = () => {
    const { walletSummary, currenciesRates, currenciesGraphs, actions, kycStatus } = this.props;
    const { activeView } = this.state;

    const coinWithoutAmount = [];

    if (walletSummary) {
      walletSummary.coins.forEach((coin) => {
        const withoutAmountNoPrior = coin.amount_usd === 0 && cryptoUtil.priorityCoins.indexOf(coin.short) !== -1
        if (coin.amount_usd === 0 && withoutAmountNoPrior) {
          coinWithoutAmount.push(coin)
        }
      });
    }

    const isGrid = activeView === WALLET_LANDING_VIEW_TYPES.GRID

    return coinWithoutAmount.length ? coinWithoutAmount.map((coin) => {
      const currency = currenciesRates.find(c => c.short === coin.short.toUpperCase())
      const graphData = !_.isEmpty(currenciesGraphs[coin.short]) ? currenciesGraphs[coin.short] : null;

      // Render grid item
      if (isGrid) {
        return <CoinCard
          key={coin.short}
          coin={coin}
          displayName={currency.displayName}
          currencyRates={currency}
          onCardPress={() => kycStatus === KYC_STATUSES.passed ? actions.navigateTo('Deposit', { coin: coin.short }) : actions.navigateTo("KYCLanding")}
          graphData={graphData}
        />
      }

      // Render list item
      return <CoinListCard
        key={coin.short}
        coin={coin}
        displayName={currency.displayName}
        currencyRates={currency}
        onCardPress={() => kycStatus === KYC_STATUSES.passed ? actions.navigateTo('Deposit', { coin: coin.short }) : actions.navigateTo("KYCLanding")}
      />
    })
      : null;
  }

  renderAddMoreCoins = () => {
    const { actions, kycStatus } = this.props;
    const { activeView } = this.state
    const style = WalletLandingStyle();

    const isGrid = activeView === WALLET_LANDING_VIEW_TYPES.GRID
    const gridStyle = isGrid ? style.addMoreCoinsGrid : style.addMoreCoinsList

    return (
      <TouchableOpacity style={gridStyle} onPress={() => kycStatus === KYC_STATUSES.passed ? actions.navigateTo('Deposit') : actions.navigateTo("KYCLanding")}>
        <Icon fill={'gray'} width="17" height="17" name="CirclePlus" />
        <CelText type="H5" margin={isGrid ? '5 0 0 0' : '0 0 0 5'}>Deposit coins</CelText>
      </TouchableOpacity>
    )
  }


  renderCoinsCard = () => {
    const CoinWithAmount = this.renderCoinWithAmount;
    const CoinWithoutAmount = this.renderCoinWithoutAmount;
    const AddMoreCoins = this.renderAddMoreCoins;
    const style = WalletLandingStyle();
    return (
      <View style={style.coinCardContainer}>
        <CoinWithAmount />
        <CoinWithoutAmount />
        <AddMoreCoins />
      </View>
    )
  }

  render() {
    const { activeView } = this.state
    const { actions, walletSummary, currenciesRates, currenciesGraphs, user, branchTransfer } = this.props;
    // const style = WalletLandingStyle();

    if (!walletSummary || !currenciesRates || !currenciesGraphs || !user) return <LoadingScreen />;

    const CoinsCard = this.renderCoinsCard;
    return (
      <RegularLayout>
        <View>
          <WalletDetailsCard
            walletSummary={walletSummary}
            navigateTo={actions.navigateTo}
            openModal={actions.openModal}
          />

          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <CelText style={{ alignSelf: 'center', marginTop: 20 }} weight='500'>Deposited coins</CelText>
            <View style={{ flexDirection: 'row', marginTop: 20 }}>
              <TouchableOpacity onPress={() => this.toggleView(WALLET_LANDING_VIEW_TYPES.GRID)} >
                <Icon fill={this.getIconFillColor(activeView === WALLET_LANDING_VIEW_TYPES.GRID)} name="GridView" width="18" />
              </TouchableOpacity>
              <TouchableOpacity style={{ marginLeft: 16 }} onPress={() => this.toggleView(WALLET_LANDING_VIEW_TYPES.LIST)}>
                <Icon fill={this.getIconFillColor(activeView === WALLET_LANDING_VIEW_TYPES.LIST)} name="ListView" width="18" />
              </TouchableOpacity>
            </View>
          </View>
          <View>
            <CoinsCard />
          </View>
        </View>
        <CelPayReceivedModal
          navigateTo={actions.navigateTo}
          closeModal={actions.closeModal}
          transfer={branchTransfer}
        />

        <TodayInterestRatesModal />
        <BecameCelMemberModal />
      </RegularLayout>
    );
  }
}

export default testUtil.hookComponent(withNavigationFocus(WalletLanding));
