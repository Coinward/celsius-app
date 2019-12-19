import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  View,
  TouchableOpacity,
  Image,
  SafeAreaView,
  Dimensions,
} from "react-native";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
// TODO(sb): RN update dependencies fixes
// import * as ImagePicker from "expo-image-picker";
import { RESULTS } from "react-native-permissions";
import { withNavigationFocus } from "react-navigation";
import { RNCamera } from "react-native-camera";
import ImageEditor from "@react-native-community/image-editor";
import ImagePicker from "react-native-image-crop-picker";
import * as appActions from "../../../redux/actions";
import CameraScreenStyle from "./CameraScreen.styles";
import Icon from "../../atoms/Icon/Icon";
import STYLES from "../../../constants/STYLES";
import API from "../../../constants/API";
import CelText from "../../atoms/CelText/CelText";
import loggerUtil from "../../../utils/logger-util";
import ThemedImage from "../../atoms/ThemedImage/ThemedImage";
import {
  ALL_PERMISSIONS,
  requestForPermission,
} from "../../../utils/device-permissions";

const { height, width } = Dimensions.get("window");

@connect(
  state => ({
    cameraType: state.camera.cameraType,
    cameraRollLastPhoto: state.camera.cameraRollPhotos[0],
    photo: state.camera.photo,
    cameraField: state.camera.cameraField,
    cameraHeading: state.camera.cameraHeading,
    cameraCopy: state.camera.cameraCopy,
    mask: state.camera.mask,
  }),
  dispatch => ({ actions: bindActionCreators(appActions, dispatch) })
)
class CameraScreen extends Component {
  static navigationOptions = () => ({
    headerSameColor: false,
    transparent: true,
  });

  static propTypes = {
    cameraField: PropTypes.string,
    cameraHeading: PropTypes.string,
    cameraCopy: PropTypes.string,
    cameraType: PropTypes.oneOf(["front", "back"]),
    photo: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.instanceOf(Object),
    ]),
    mask: PropTypes.oneOf(["circle", "document"]),
    onSave: PropTypes.func,
  };

  static defaultProps = {
    cameraField: "lastPhoto",
    cameraHeading: "Take Photo",
    mask: "circle",
  };

  constructor(props) {
    super(props);

    this.state = {
      hasCameraPermission: false,
      hasCameraRollPermission: false,
      hasInitialPhoto: !!props.photo,
      size: {
        width,
        height,
      },
    };
  }

  async componentDidMount() {
    const { actions } = this.props;
    actions.setFabType("hide");
    await this.getCameraPermissions();
    await this.getCameraRollPermissions();
  }

  getCameraPermissions = async () => {
    const { actions } = this.props;
    const perm = await requestForPermission(ALL_PERMISSIONS.CAMERA);

    if (perm === RESULTS.GRANTED) {
      this.setState({ hasCameraPermission: true });
    } else {
      actions.showMessage(
        "warning",
        "It looks like you denied Celsius app access to your camera. Please enable it in your phone settings."
      );
      actions.navigateBack();
    }
  };

  getCameraRollPermissions = async () => {
    const { actions, cameraRollLastPhoto } = this.props;
    const perm = await requestForPermission(ALL_PERMISSIONS.LIBRARY);

    if (perm === RESULTS.GRANTED) {
      if (!cameraRollLastPhoto) actions.getCameraRollPhotos();
      this.setState({ hasCameraRollPermission: true });
    } else {
      actions.showMessage(
        "warning",
        "It looks like you denied Celsius app access to your camera roll. Please enable it in your phone settings."
      );
    }
  };

  getMaskImage = mask => {
    switch (mask) {
      case "document":
        return {
          lightSource: require("../../../../assets/images/mask/card-mask-transparent.png"),
          darkSource: require("../../../../assets/images/mask/dark-card-mask-transparent.png"),
        };
      case "circle":
      default:
        return {
          lightSource: require("../../../../assets/images/mask/circle-mask.png"),
          darkSource: require("../../../../assets/images/mask/dark-circle-mask.png"),
        };
    }
  };

  pickImage = async () => {
    const { actions, mask, navigation } = this.props;
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [
        STYLES.CAMERA_MASK_SIZES[mask].width,
        STYLES.CAMERA_MASK_SIZES[mask].height,
      ],
    });
    if (result.cancelled) {
      return;
    }
    actions.navigateTo("ConfirmCamera", {
      onSave: navigation.getParam("onSave"),
    });
    actions.takeCameraPhoto(result);
  };

  takePhoto = async camera => {
    if (camera) {
      const { actions, mask, navigation } = this.props;
      const options = { quality: 0.5, base64: true };

      try {
        if (!this.state.hasCameraPermission) {
          return await this.getCameraPermissions();
        }
        const photo = await camera.takePictureAsync(options);

        actions.startApiCall(API.TAKE_CAMERA_PHOTO);
        await actions.navigateTo("ConfirmCamera", {
          onSave: navigation.getParam("onSave"),
        });

        const { size } = this.state;
        let cropWidth;

        if (photo.width / photo.height > size.width / size.height) {
          const coef = photo.width * (size.height / photo.height);
          const overScan = ((coef - size.width) * 0.5) / coef;
          cropWidth = photo.width - 2 * size.width * overScan;
          cropWidth =
            (cropWidth * STYLES.CAMERA_MASK_SIZES[mask].width) / size.width;
        } else {
          cropWidth =
            (STYLES.CAMERA_MASK_SIZES[mask].width / size.width) * photo.width;
        }

        const cropHeight =
          (cropWidth / STYLES.CAMERA_MASK_SIZES[mask].width) *
          STYLES.CAMERA_MASK_SIZES[mask].height;

        // const imageManipulations = [
        //   {
        //     resize: { ...photo },
        //   },
        //   {
        //     crop: {
        //       originX: (photo.width - cropWidth) / 2,
        //       originY: (photo.height - cropHeight) / 2,
        //       width: cropWidth,
        //       height: cropHeight,
        //     },
        //   },
        // ];
        //
        // if (cameraType === "front") { //<-- add cameraType in props
        //   imageManipulations.push({
        //     flip: "horizontal",
        //   });
        // }

        // const resizedPhoto = await ImageManipulator.manipulateAsync(
        //   photo.uri,
        //   imageManipulations,
        //   { compress: 0.95, format: "jpeg" }
        // );

        const croppedImage = await ImageEditor.cropImage(photo.uri, {
          offset: {
            x: (photo.width - cropWidth) / 2,
            y: (photo.height - cropHeight) / 2,
          },
          size: { width: cropWidth, height: cropHeight },
          displaySize: { width: cropWidth, height: cropHeight },
          resizeMode: "contain",
        });

        actions.takeCameraPhoto({ uri: croppedImage });
      } catch (err) {
        loggerUtil.err(err);
      }
    }
  };

  renderMask = () => {
    const { mask, cameraHeading } = this.props;
    const imageSource = this.getMaskImage(mask);
    const style = CameraScreenStyle();
    return (
      <View
        style={{
          alignSelf: "center",
          flex: 1,
          justifyContent: "center",
          width: "100%",
        }}
      >
        <View style={[style.mask, style.maskOverlayColor]}>
          <SafeAreaView
            style={{ flex: 1, flexDirection: "row", marginBottom: 20 }}
          >
            <CelText
              weight="700"
              type="H1"
              align="center"
              style={{ alignSelf: "flex-end", flex: 1 }}
            >
              {cameraHeading}
            </CelText>
          </SafeAreaView>
        </View>
        <View style={{ flexDirection: "row" }}>
          <View style={[style.mask, style.maskOverlayColor]} />
          <ThemedImage
            {...imageSource}
            style={{
              width: STYLES.CAMERA_MASK_SIZES[mask].width,
              height: STYLES.CAMERA_MASK_SIZES[mask].height,
              alignSelf: "center",
            }}
          />
          <View style={[style.mask, style.maskOverlayColor]} />
        </View>
        <View style={[style.mask, style.maskOverlayColor]}>
          <View
            style={{
              width: STYLES.CAMERA_MASK_SIZES[mask].width,
              alignSelf: "center",
              marginTop: 20,
            }}
          />
        </View>
      </View>
    );
  };

  render() {
    const { cameraType, actions, cameraRollLastPhoto } = this.props;
    const style = CameraScreenStyle();
    const Mask = this.renderMask;
    const isFocused = this.props.navigation.isFocused();

    if (!isFocused) return null;

    return (
      <RNCamera
        ref={ref => {
          this.camera = ref;
        }}
        onLayout={event => {
          this.setState({ size: event.nativeEvent.layout });
        }}
        style={style.camera}
        type={RNCamera.Constants.Type[cameraType]}
      >
        <Mask />
        <SafeAreaView style={style.bottomView}>
          <View style={style.actionBar}>
            <TouchableOpacity style={{ flex: 1 }} onPress={this.pickImage}>
              {cameraRollLastPhoto && (
                <Image
                  source={{ uri: cameraRollLastPhoto.node.image.uri }}
                  resizeMode="cover"
                  style={{ width: 50, height: 50 }}
                />
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={{ flex: 1 }}
              onPress={() => this.takePhoto(this.camera)}
            >
              <Icon
                name="Shutter"
                fill={STYLES.COLORS.CELSIUS_BLUE}
                width="60"
                height="60"
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={{ flex: 1 }}
              onPress={() => {
                this.setState({ ratio: "4:3" }, actions.flipCamera);
              }}
            >
              <Icon
                style={{ alignSelf: "flex-end" }}
                name="Swap"
                width="35"
                fill={"#3D4853"}
              />
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </RNCamera>
    );
  }
}

export default withNavigationFocus(CameraScreen);
