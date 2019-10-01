import React, { Component } from 'react';
import { View } from 'react-native';

import CelsiusStatsStyle from "./CelStats.styles";
import CelText from '../../atoms/CelText/CelText';
import Separator from "../../atoms/Separator/Separator";
import STYLES from "../../../constants/STYLES";
import { THEMES } from '../../../constants/UI'
import formatter from "../../../utils/formatter";
import { getTheme } from '../../../utils/styles-util'

class CelStats extends Component {


  constructor(props) {
    super(props);
    this.state = {};
  }

  setTierColor = tier => {

    switch (tier) {
      case 'platinum':
        return STYLES.COLORS.CELSIUS_BLUE
      case 'gold':
        return STYLES.COLORS.ORANGE
      case 'silver':
        return STYLES.COLORS.DARK_GRAY
      default:
        return null
    }
  }


  render() {
    const style = CelsiusStatsStyle();
    const theme = getTheme()
    const { celTierStats, totalCelUsers } = this.props

    if (!celTierStats || !totalCelUsers) {
      return null
    }

    const TEXT_LENGTH = 80
    const TEXT_HEIGHT = 22
    const OFFSET = TEXT_LENGTH / 2 - TEXT_HEIGHT / 2


    return (
      <View style={style.container}>
        <Separator
            text={'CEL INTEREST STATS'}
            margin={'30 0 20 0'}
        />

        <View
            style={ style.celTierHead }
        >
          <View style={ style.celTierHeadIndentation } />

          <View
              style={ style.celTierItem }
          >
            <CelText
                type={'H7'}
                align={'center'}
            >
              Total Interest Distributed in CEL
            </CelText>
          </View>
          <View
              style={ style.celTierItem }
          >
            <CelText
                type={'H7'}
                align={'center'}
            >
              Percentage of Users
            </CelText>
          </View>
          <View
              style={ style.celTierItem }
          >
            <CelText
                type={'H7'}
                align={'center'}
            >
              Receiving Interest in CEL
            </CelText>
          </View>
        </View>

        { celTierStats.map((i, k) => (
            <View style={ style.celTierWrapper} key={k}>
              <View style={[style.celTierIndentation, { backgroundColor: this.setTierColor(i.name.toLowerCase()) }]} >
                <View style={{
                  width: TEXT_HEIGHT,
                  height: TEXT_LENGTH,
                }}
                >
                  <View style={{
                    transform: [
                      { rotate: '-90deg' },
                      { translateX: -OFFSET },
                      { translateY: -OFFSET }
                    ],
                    height: 22,
                    width: 80,
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                  >
                    <CelText
                        color={ STYLES.COLORS.WHITE }
                        allCaps
                        weight={'600'}
                        type={'H7'}
                    >
                      { i.name }
                    </CelText>
                  </View>
                </View>
              </View>
              <View style={ style.celTierItem}>
                <CelText
                    weight={'600'}
                    type={'H5'}
                    align={'center'}
                    margin={'30 0 15 0'}
                >
                  { formatter.crypto(i.totalCelInterests, '',{noPrecision: true} ) }
                </CelText>
              </View>
              <Separator
                  vertical
                  height={'50%'}
                  margin={'20 0 0 0'}
                  color={ theme === THEMES.DARK ? STYLES.COLORS.LIGHT_GRAY : null }
              />
              <View style={ style.celTierItem}>
                <CelText
                    weight={'600'}
                    type={'H5'}
                    align={'center'}
                    margin={'30 0 15 0'}
                >
                  { formatter.percentageDisplay(i.percentageOfUsers / 100) }
                </CelText>
              </View>
              <Separator
                  vertical
                  height={'50%'}
                  margin={'20 0 0 0'}
                  color={ theme === THEMES.DARK ? STYLES.COLORS.LIGHT_GRAY : null }
              />
              <View style={ style.celTierItem }>
                <CelText
                    weight={'600'}
                    type={'H5'}
                    align={'center'}
                    margin={'30 0 15 0'}
                >
                  { formatter.percentageDisplay(i.interestInCelInPercentages / 100) }
                </CelText>
              </View>
            </View>)) }
        <CelText
            type={'H2'}
            weight={'600'}
            align={'center'}
            margin={'10 0 10 0'}
        >
          { formatter.percentageDisplay(totalCelUsers / 100) }
        </CelText>
        <CelText
            type={'H7'}
            align={'center'}
            weight={'300'}
            style={ style.celStatsBottomCopy}
        >
          of the community is choosing to earn interest income in CEL!
        </CelText>
      </View>
    );
  }
}

export default CelStats
