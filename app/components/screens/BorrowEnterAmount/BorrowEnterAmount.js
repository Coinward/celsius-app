import React, { Component } from 'react'
import { View, TouchableOpacity } from 'react-native'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'


import * as appActions from '../../../redux/actions'
import CelText from '../../atoms/CelText/CelText'
import CelButton from '../../atoms/CelButton/CelButton'
import RegularLayout from '../../layouts/RegularLayout/RegularLayout'
import CelNumpad from '../../molecules/CelNumpad/CelNumpad'
import HeadingProgressBar from '../../atoms/HeadingProgressBar/HeadingProgressBar'
import { KEYPAD_PURPOSES, THEMES } from "../../../constants/UI";
import formatter from '../../../utils/formatter'
import STYLES from '../../../constants/STYLES'
import PredefinedAmounts from '../../organisms/PredefinedAmounts/PredefinedAmounts'
import { getPadding } from '../../../utils/styles-util'
import CelSelect from "../../molecules/CelSelect/CelSelect";
import Icon from "../../atoms/Icon/Icon";
import BorrowEnterAmountStyle from "./BorrowEnterAmount.styles";
import { isCompanyMember } from "../../../utils/user-util";
import { LOAN_TYPES } from '../../../constants/DATA';

@connect(
  state => ({
    loanCompliance: state.compliance.loan,
    formData: state.forms.formData,
    walletSummary: state.wallet.summary,
    minimumLoanAmount: state.generalData.minimumLoanAmount,
    keypadOpen: state.ui.isKeypadOpen,
    currencies: state.currencies.rates,
    appSettings: state.user.appSettings,
  }),
  dispatch => ({ actions: bindActionCreators(appActions, dispatch) })
)
class BorrowEnterAmount extends Component {
  static propTypes = {}
  static defaultProps = {}

  static navigationOptions = () => ({
    title: 'Enter the loan amount'
  })

  constructor (props) {
    super(props)
    const { loanCompliance, walletSummary, minimumLoanAmount, currencies } = props
    const eligibleCoins = walletSummary.coins.filter(coinData =>
      loanCompliance.collateral_coins.includes(coinData.short)
    )

    const coinSelectItems = currencies
      .filter(c => loanCompliance.loan_coins.includes(c.short))
      .map(c => ({ label: `${c.displayName}  (${c.short})`, value: c.short }))

    coinSelectItems.push({ label: `US Dollar ($)`, value: 'USD' })

    this.state = {
      activePeriod: '',
      coinSelectItems,
    }

    const maxAmount =
      eligibleCoins.reduce(
        (max, element) => (element.amount_usd > max ? element.amount_usd : max),
        0
      ) / 2

    props.actions.initForm({
      loanAmount: minimumLoanAmount.toString(),
      maxAmount,
      coin: 'USD'
    })
  }

  onPressPredefinedAmount = ({ label, value }) => {
    const { formData, minimumLoanAmount, actions } = this.props
    let amount
    if (value === 'max') amount = formatter.floor10(formData.maxAmount, 0)
    if (value === 'min') amount = minimumLoanAmount.toString()
    this.handleAmountChange(amount, label)
    actions.toggleKeypad(false)
  }

  getAmountColor = () => {
    const { keypadOpen } = this.props

    if (keypadOpen) return STYLES.COLORS.CELSIUS_BLUE

    return STYLES.COLORS.DARK_GRAY
  }

  handleAmountChange = (newValue, predefined = '') => {
    const { actions, formData, minimumLoanAmount } = this.props
    
    if (newValue < minimumLoanAmount) {
      actions.showMessage(
        'warning',
        `$${minimumLoanAmount} is currently the minimum loan amount. Please adjust your loan amount to proceed.`
      )
    }

    if (newValue > formData.maxAmount) {
      return actions.showMessage('warning', 'Insufficient funds!')
    }

    actions.updateFormField('loanAmount', newValue)
    this.setState({ activePeriod: predefined })
  }

  renderButton () {
    const { formData, actions, minimumLoanAmount } = this.props

    if (Number(formData.loanAmount) > Number(formData.maxAmount)) {
      return (
        <CelButton
          onPress={() => {
            actions.navigateTo('Deposit')
            actions.toggleKeypad()
          }}
          margin='40 0 0 0'
        >
          Deposit more
        </CelButton>
      )
    }

    return (
      <CelButton
        disabled={Number(formData.loanAmount) < Number(minimumLoanAmount)}
        onPress={() => {
          actions.navigateTo('BorrowCollateral')
          actions.toggleKeypad()
          actions.getLinkedBankAccount()
          // actions.navigateTo('VerifyProfile', { onSuccess: () => actions.openModal(UI.MODALS.BORROW_CONFIRM)})
        }}
        margin='20 0 0 0'
        iconRight='arrowRight'
      >
        Choose collateral
      </CelButton>
    )
  }

  renderCoinIcon = () => {
    const { appSettings, formData } = this.props
    if (formData.coin === 'USD') return null
    return (
      <Icon
        name={`Icon${formData.coin}`}
        width='40'
        height='40'
        fill={ appSettings.theme !== THEMES.DARK ? STYLES.COLORS.DARK_GRAY3 : STYLES.COLORS.WHITE_OPACITY3 }
      />
    )
  }

  render () {
    const { activePeriod, coinSelectItems } = this.state
    const {
      actions,
      formData,
      minimumLoanAmount
    } = this.props

    const styles = BorrowEnterAmountStyle()

    const predifinedAmount = [
      { label: `$${minimumLoanAmount} min`, value: 'min' },
      {
        label: `${formatter.floor10(formData.maxAmount, 0)} max`,
        value: 'max'
      }
    ]

    const CoinIcon = this.renderCoinIcon

    return (
      <RegularLayout padding='0 0 0 0' fabType={'hide'}>
        <HeadingProgressBar steps={6} currentStep={1} />
        <View
          style={[
            { flex: 1, width: '100%', height: '100%' },
            { ...getPadding('20 20 100 20') }
          ]}
        >
          <View style={{ paddingTop: 10, alignItems: 'center' }}>
            <CelText align='center' type='H4' margin='30 0 60 0'>
              How much would you like to borrow?
            </CelText>

            { isCompanyMember() && (
              <CelSelect
                margin="0 30 20 30"
                items={coinSelectItems}
                field='coin'
                value={formData.coin}
                updateFormField={actions.updateFormField}
                onChange={(value) => actions.updateFormFields({ coin: value, loanType: value === 'USD' ? LOAN_TYPES.USD_LOAN : LOAN_TYPES.STABLE_COIN_LOAN})}
                placeholder='Choose a coin'
              />
            )}

            <View style={{ width: '100%' }}>
              <TouchableOpacity
                onPress={actions.toggleKeypad}
                style={{ width: '100%' }}
              >
                <View style={styles.coinIconWrapper}>
                  <CoinIcon />
                </View>
                <CelText
                  color={this.getAmountColor()}
                  type='H1'
                  weight='regular'
                  align='center'
                >
                  {formatter.usd(formData.loanAmount, {
                    code: '',
                    precision: 0
                  })}
                </CelText>
                <View style={styles.coinTextWrapper}>
                  <CelText color='gray' type='H3'>
                    { formData.coin }
                  </CelText>
                </View>
              </TouchableOpacity>
            </View>
          </View>

          <PredefinedAmounts
            data={predifinedAmount}
            onSelect={this.onPressPredefinedAmount}
            activePeriod={activePeriod}
          />

          {/* <Card margin='20 0 5 0'>
            <CelText type="H6" color='gray' >
              The max amount is based on your wallet balance.
            </CelText>
          </Card> */}

          {this.renderButton()}

          <CelNumpad
            field={'loanAmount'}
            value={formData.loanAmount || ''}
            updateFormField={actions.updateFormField}
            setKeypadInput={actions.setKeypadInput}
            toggleKeypad={actions.toggleKeypad}
            onPress={this.handleAmountChange}
            purpose={KEYPAD_PURPOSES.BORROW}
          />
        </View>
      </RegularLayout>
    )
  }
}

export default BorrowEnterAmount
