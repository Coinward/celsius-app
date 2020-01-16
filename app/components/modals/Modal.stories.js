import React from "react";
import { View } from "react-native";
import { Provider } from "react-redux";
import { storiesOf } from "@storybook/react-native/dist";
import store from "../../redux/store";
import { openModal } from "../../redux/ui/uiActions";
import { MODALS } from "../../constants/UI";
import CelButton from "../atoms/CelButton/CelButton";
import CenterView from "../../../storybook/stories/CenterView";
import LoanAlertsPayoutPrincipalModal from "./LoanAlertsModals/LoanAlertsPayoutPrincipalModal/LoanAlertsPayoutPrincipalModal";
import LoanAlertsMarginCallDepositCoinsModal from "./LoanAlertsModals/LoanAlertsMarginCallDepositCoinsModal/LoanAlertsMarginCallDepositCoinsModal";
import LoanAlertsDepositCoinsModal from "./LoanAlertsModals/LoanAlertsDepositCoinsModal/LoanAlertsDepositCoinsModal";
import LoanAlertsMarginCallLockCoinModal from "./LoanAlertsModals/LoanAlertsMarginCallLockCoinModal/LoanAlertsMarginCallLockCoinModal";

import ApiKeyRevokeModalStories from "./ApiKeyRevokeModal/ApiKeyRevokeModal.stories";
import ApiKeySuccessModalStories from "./ApiKeySuccessModal/ApiKeySuccessModal.stories";
import BecomeCelMemberModalStories from "./BecomeCelMemberModal/BecomeCelMemberModal.stories";
import CalculateLoyaltyLevelModalStories from "./CalculateLoyaltyLevelModal/CalculateLoyaltyLevelModal.stories";
import CancelLoanModalStories from "./CancelLoanModal/CancelLoanModal.stories";
import CelPayReceivedModalStories from "./CelPayReceivedModal/CelPayReceivedModal.stories";
import ChangeWithdrawalAddressModalStories from "./ChangeWithdrawalAddressModal/ChangeWithdrawalAddressModal.stories";
import ConfirmWithdrawalAddressModalStories from "./ConfirmWithdrawalAddressModal/ConfirmWithdrawalAddressModal.stories";
import CreateNewAccountModalStories from "./CreateNewAccountModal/CreateNewAccountModal.stories";
import DepositInfoModalStories from "./DepositInfoModal/DepositInfoModal.stories";
import LoanApplicationSuccessModalStories from "./LoanApplicationSuccessModal/LoanApplicationSuccessModal.stories";
import LoseMembershipModalStories from "./LoseMembershipModal/LoseMembershipModal.stories";
import LoseTierModalStories from "./LoseTierModal/LoseTierModal.stories";
import MemoIdModalStories from "./MemoIdModal/MemoIdModal.stories";
import PrepayDollarInterestModalStories from "./PrepayDollarInterestModal/PrepayDollarInterestModal.stories";
import PrepaymentSuccessfulModalStories from "./PrepaymentSuccessfulModal/PrepaymentSuccessfulModal.stories";
import ReferralSendModalStories from "./ReferralSendModal/ReferralSendModal.stories";
import RegisterPromoCodeModalStories from "./RegisterPromoCodeModal/RegisterPromoCodeModal.stories";
import RejectionReasonsModalStories from "./RejectionReasonsModal/RejectionReasonsModal.stories";
import RemoveAuthAppModalStories from "./RemoveAuthAppModal/RemoveAuthAppModal.stories";
import SsnModalStories from "./SsnModal/SsnModal.stories";
import TransactionFilterModalStories from "./TransactionFilterModal/TransactionFilterModal.stories";
import VerifyAuthAppModalStories from "./VerifyAuthAppModal/VerifyAuthAppModal.stories";
import WithdrawalInfoModalStories from "./WithdrawalInfoModal/WithdrawalInfoModal.stories";
import WithdrawWarningModalStories from "./WithdrawWarningModal/WithdrawWarningModal.stories";
import DestinationInfoTagModalStories from "./DestinationInfoTagModal/DestinationInfoTagModal.stories";
import InterestDueModalStories from "./InterestDueModal/InterestDueModal.stories";
import ReferralReceivedModalStories from "./ReferralReceivedModal/ReferralReceivedModal.stories";
import ConfirmCelPayModalStories from "./ConfirmCelPayModal/ConfirmCelPayModal.stories";
import CelPayInfoModalStories from "./CelPayInfoModal/CelPayInfoModal.stories";

storiesOf("Modals", module)
  .addDecorator(getStory => (
    <Provider store={store}>
      <CenterView>{getStory()}</CenterView>
    </Provider>
  ))
  .add("All Modals", () => (
    <View>
      <ReferralReceivedModalStories />
      <DepositInfoModalStories />
      <LoanApplicationSuccessModalStories />
      <WithdrawalInfoModalStories />
      <ConfirmCelPayModalStories />
      <InterestDueModalStories />
      <ApiKeyRevokeModalStories />
      <ApiKeySuccessModalStories />
      <BecomeCelMemberModalStories />
      <CalculateLoyaltyLevelModalStories />
      <CancelLoanModalStories />
      <CelPayReceivedModalStories />
      <ChangeWithdrawalAddressModalStories />
      <ConfirmWithdrawalAddressModalStories />
      <CreateNewAccountModalStories />
      <DestinationInfoTagModalStories />
      <DepositInfoModalStories />
      <LoanApplicationSuccessModalStories />
      <LoseMembershipModalStories />
      <LoseTierModalStories />
      <MemoIdModalStories />
      <PrepayDollarInterestModalStories />
      <PrepaymentSuccessfulModalStories />
      <ReferralSendModalStories />
      <RegisterPromoCodeModalStories />
      <RejectionReasonsModalStories />
      <RemoveAuthAppModalStories />
      <SsnModalStories />
      <TransactionFilterModalStories />
      <VerifyAuthAppModalStories />
      <WithdrawWarningModalStories />
      <CelPayInfoModalStories/>
    </View>
  ))
  .add("LoanAlertsPayoutPrincipalModal", () => (
    <View style={{ marginBottom: 30 }}>
      <CelButton
        onPress={() => store.dispatch(openModal(MODALS.LOAN_ALERT_MODAL))}
      >
        Open LoanAlertsPayoutPrincipalModal
      </CelButton>
      <LoanAlertsPayoutPrincipalModal />
    </View>
  ))
  .add("LoanAlertsDepositCoinsModal", () => (
    <View style={{ marginBottom: 30 }}>
      <CelButton
        onPress={() => store.dispatch(openModal(MODALS.LOAN_ALERT_MODAL))}
      >
        Open LoanAlertsDepositCoinsModal
      </CelButton>
      <LoanAlertsDepositCoinsModal />
    </View>
  ))
  .add("LoanAlertsMarginCallDepositCoinsModal", () => (
    <View style={{ marginBottom: 30 }}>
      <CelButton
        onPress={() => store.dispatch(openModal(MODALS.LOAN_ALERT_MODAL))}
      >
        Open LoanAlertsMarginCallDepositCoinsModal
      </CelButton>
      <LoanAlertsMarginCallDepositCoinsModal yesCopy={"Deposit coins"} />
    </View>
  ))
  .add("LoanAlertsMarginCallLockCoinModal", () => (
    <View style={{ marginBottom: 30 }}>
      <CelButton
        onPress={() => store.dispatch(openModal(MODALS.LOAN_ALERT_MODAL))}
      >
        Open LoanAlertsMarginCallLockCoinModal
      </CelButton>
      <LoanAlertsMarginCallLockCoinModal />
    </View>
  ));
