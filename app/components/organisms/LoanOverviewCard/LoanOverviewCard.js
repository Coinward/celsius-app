import React, { Component } from "react";
import { View } from "react-native";
import PropTypes from "prop-types";
import moment from "moment";

import LoanOverviewCardStyle from "./LoanOverviewCard.styles";
import CelText from "../../atoms/CelText/CelText";
import Card from "../../atoms/Card/Card";
import Separator from "../../atoms/Separator/Separator";
import CelButton from "../../atoms/CelButton/CelButton";
import Icon from "../../atoms/Icon/Icon";
import formatter from "../../../utils/formatter";
import { getMargins } from "../../../utils/styles-util";
import CircularProgressBar from "../../graphs/CircularProgressBar/CircularProgressBar";
import { LOAN_STATUS } from "../../../constants/DATA";
import PaymentListItem from "../../atoms/PaymentListItem/PaymentListItem";

class LoanOverviewCard extends Component {

  static propTypes = {
    loan: PropTypes.instanceOf(Object),
    navigateTo: PropTypes.func.isRequired,
    index: PropTypes.number,
  };
  static defaultProps = {
    payed: false,
    loanSettings: false,
    index: 0,
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  getMarginForIndex(index) {
    if (index === 0) return "0 0 0 40"

    return "0 0 0 0"
  }

  render() {
    const { loan, navigateTo, index } = this.props;
    const style = LoanOverviewCardStyle();

    const previousPayments = loan.amortization_table.filter(p => p.isPaid)
    const previous5Payments = previousPayments.slice(0, 5)

    return (
      <View style={[style.container, getMargins(this.getMarginForIndex(index))]}>
        <Card padding={"0 0 0 0"}>
          <View style={style.info}>
            <View style={style.status}>
              <Icon name={"TransactionLoan"} fill={loan.uiProps.color} width={"25"} height={"25"}/>
              <CelText type={"H5"} color={loan.uiProps.color} margin={"0 5 0 0"}>{loan.uiProps.displayText}</CelText>
            </View>

            <CelText type={"H2"} weight={"600"} margin={"5 0 5 0"}>{loan.uiProps.displayAmount}</CelText>

            {loan.status === LOAN_STATUS.COMPLETED && (
              <View style={{ flexDirection: 'row', alignItems: "center", justifyContent: 'space-between' }}>
                <CelText type={"H6"}>Loan Completed:</CelText>
                <CelText type={"H6"}>{moment(loan.maturity_date).format("MMMM DD, YYYY")}</CelText>
              </View>
            )}

            {loan.status === LOAN_STATUS.CANCELED && (
              <View style={{ flexDirection: 'row', alignItems: "center", justifyContent: 'space-between' }}>
                <CelText type={"H6"}>Request Canceled:</CelText>
                <CelText type={"H6"}>{moment(loan.canceled_at).format("MMMM DD, YYYY")}</CelText>
              </View>
            )}

            {[LOAN_STATUS.APPROVED, LOAN_STATUS.ACTIVE].includes(loan.status) && (
              <View style={{ flexDirection: 'row', alignItems: "center", justifyContent: 'space-between' }}>
                <CelText type={"H6"}>Loan Approved:</CelText>
                <CelText type={"H6"}>{moment(loan.approved_at).format("MMMM DD, YYYY")}</CelText>
              </View>
            )}

            <View style={{ flexDirection: 'row', alignItems: "center", justifyContent: 'space-between' }}>
              <CelText type={"H6"}>Loan Requested:</CelText>
              <CelText type={"H6"}>{moment(loan.created_at).format("MMMM DD, YYYY")}</CelText>
            </View>

            {loan.status === LOAN_STATUS.PENDING &&
              <Card color={style.card.color} margin={"30 0 0 0"}>
                <CelText type={"H7"}>
                  Someone from our team is already reviewing your request. You will be notified when your request is approved.
                </CelText>
              </Card>
            }
          </View>

          { [LOAN_STATUS.ACTIVE, LOAN_STATUS.APPROVED].includes(loan.status) && (
            <View>
              <Separator size={2} margin={"0 0 10 0"}/>
              <View style={style.interest}>
                <View>
                  <CelText type={"H6"} weight={"300"}>Monthly interest</CelText>
                  <CelText type={"H3"} weight={"600"}>{formatter.usd(loan.monthly_payment)}</CelText>
                  <CelText type={"H6"} weight={"300"} margin={"15 0 0 0"}>Total interest</CelText>
                  <CelText type={"H3"} weight={"600"}>{formatter.usd(loan.total_interest)}</CelText>

                  <Card color={style.card.color} padding={"5 5 5 5"}>
                    <CelText type={"H7"} weight={"300"}>{"-XX if paid in CEL"}</CelText>
                  </Card>

                </View>
                <View style={style.progress}>
                  <CircularProgressBar
                    amountLoaned={Number(loan.total_interest)}
                    amountPaid={Number(loan.total_interest_paid)}
                  />
                </View>
              </View>
            </View>
          )}

          <Separator size={2} margin={"10 0 0 0"}/>

          <View style={style.buttonContainer}>
            <CelButton
              onPress={() => navigateTo("LoanRequestDetails", { id: loan.id })}
              basic
              textSize={"H6"}
            >
              Loan Details
            </CelButton>

            { [LOAN_STATUS.ACTIVE, LOAN_STATUS.APPROVED].includes(loan.status) && (
              <View style={{ flexDirection: 'row', justifyContent: "space-around" }}>
                <Separator vertical/>
                <CelButton
                  // onPress={() => navigateTo("LoanRequestDetails", { id: loan.id })}
                  onPress={() => navigateTo("PrincipalPayment", { id: loan.id })}
                  basic
                  textSize={"H6"}
                >
                  Loan Settings
                </CelButton>
              </View>
            )}
          </View>

          {loan.hasInterestPaymentFinished && loan.status === LOAN_STATUS.ACTIVE &&
            <View>
              <Separator size={2} margin={"0 0 0 0"}/>
              <CelButton
                onPress={() => navigateTo("LoanRequestDetails", { id: loan.id })}
                margin={"15 0 15 0"}
                color="green"
              >
                Payout Principal
              </CelButton>
            </View>
          }
        </Card>

        { loan.status === LOAN_STATUS.PENDING && (
          <CelButton
            margin="15 0 15 0"
            onPress={() => navigateTo("LoanRequestDetails", { id: loan.id })}
            color="red"
          >
            Cancel loan
          </CelButton>
        )}

        { loan.status === LOAN_STATUS.APPROVED && (
          <Card close>
            <CelText weight="500">
              Did you know you can prepay loan interest?
            </CelText>

            <CelText
              type="H6"
              style={{ opacity: 0.7 }}
            >
              Choose a period of six months or more to prepay your interest. You will get notified as soon as your interest payment is due again.
            </CelText>

            <CelButton
              basic
              textSize={"H6"}
              onPress={() => navigateTo("LoanRequestDetails", { id: loan.id })}
            >
              Prepay interest
            </CelButton>
          </Card>
        )}

        { loan.status === LOAN_STATUS.ACTIVE && (
          <View>
            <CelText>Payment History</CelText>

            { previous5Payments.map((p, i) => (
              <PaymentListItem key={`${p.dueDate}${i}`} payment={p} />
            ))}

            { previousPayments.length > 5 && (
              <CelButton
                basic
                onPress={() => navigateTo('LoanPaymentHistory', { id: loan.id })}
              >
                See all
              </CelButton>
            )}

          </View>
        )}

        { loan.status === LOAN_STATUS.ACTIVE && !loan.hasInterestPaymentFinished && (
          <View>
            <Separator margin="10 0 10 0" />
            <CelButton onPress={() => navigateTo('LoanPaymentList', { id: loan.id })}>
              Upcoming Payments
            </CelButton>
          </View>
        )}
      </View>
    );
  }
}

export default LoanOverviewCard;
