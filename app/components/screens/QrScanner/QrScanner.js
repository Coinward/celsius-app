import React, { Component } from 'react';
import PropTypes from "prop-types";
import { View, Image, Platform } from "react-native";
import { BarCodeScanner, Permissions } from 'expo';
import { connect } from 'react-redux';
import { bindActionCreators } from "redux";

import * as appActions from "../../../redux/actions";

import QrScannerStyle from './QrScanner.styles';
import RegularLayout from "../../layouts/RegularLayout/RegularLayout";
import testUtil from "../../../utils/test-util";
import CelText from "../../atoms/CelText/CelText";

const style = QrScannerStyle();

const ScanOverlayBackground = () => (
  <Image resizeMode="cover" source={require('../../../../assets/images/camera-mask-qr.png')} style={style.overlayBackground} />
);

const ScanOverlayContent = ({ children }) => (
  <View style={style.overlayContent}>
    {children}
  </View>
);

@connect(
  () => ({}),
  dispatch => ({ actions: bindActionCreators(appActions, dispatch) }),
)
class QrScannerScreen extends Component {
  static propTypes = {
    formField: PropTypes.string,
    onScan: PropTypes.func,
  };

  static defaultProps = {
    formField: 'lastQRScan',
  };

  static navigationOptions = () => ({
    title: "QR code scan"
  })

  constructor(props) {
    super(props)
    this.state = {
      hasCameraPermission: null,
      handleBarCodeRead: undefined,
    };
  }

  async componentDidMount() {
    let permission = await Permissions.getAsync(Permissions.CAMERA);

    if (permission.status !== 'granted') {
      permission = await Permissions.askAsync(Permissions.CAMERA);
    }

    this.setState({ hasCameraPermission: permission.status === 'granted', handleBarCodeRead: this.handleBarCodeRead });
  }

  handleBarCodeRead = async ({ data }) => {
    const { actions, formField, navigation } = this.props;

    this.setState({ handleBarCodeRead: undefined });

    const onScan = navigation.getParam('onScan');


    // scanning metamask address -> 'ethereum:0x...'
    let address = data.indexOf(':') === -1 ? data : data.split(':')[1];
    address = address.trim();

    if (onScan) {
      onScan(address);
    } else {
      actions.updateFormField(formField, address);
    }

    actions.navigateBack();
  };

  renderScanner = () => {
    const { hasCameraPermission } = this.state;
    const { navigation } = this.props;

    const scanTitle = navigation.getParam('scanTitle');

    return (
      <View style={style.container}>
        <BarCodeScanner
          onBarCodeRead={this.state.handleBarCodeRead}
        >
          {Platform.OS === 'ios' && <ScanOverlayBackground />}
          <ScanOverlayContent>
            {!!scanTitle && <CelText type={"H1"} style={[style.scanText, style.scanTitle]}>{scanTitle}</CelText>}
            <CelText type={"H4"} style={[style.scanText, style.scanInstructions]}>
              {hasCameraPermission === false ?
                'Camera permission is needed in order to scan the QR Code.' :
                'Please center the address’ QR code in the marked area.'}
            </CelText>
          </ScanOverlayContent>
          {Platform.OS !== 'ios' && <ScanOverlayBackground />}
        </BarCodeScanner>
      </View>
    );
  };

  render() {
    return (
      <RegularLayout>
        {this.renderScanner()}
      </RegularLayout>
    )
  }
}

export default testUtil.hookComponent(QrScannerScreen);
