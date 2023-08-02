import React, {useState} from 'react';
import {
  Image,
  View,
  Pressable,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import {useThemeAwareObject} from '../../theme';
import {hp, wp} from '../../util';
import Text from '../CustomText';
import ImagePicker, {ImageOrVideo} from 'react-native-image-crop-picker';
import Modal from 'react-native-modal';
import {CameraIcon, ImageIcon} from './Icons/Index';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
// import {useDispatch} from 'react-redux';
import {
  placeholderSvg as PlaceHolderSvg,
  cameraSvg as CameraSvg,
} from '../../../assets/Icons/Svgs';
import avatarImage from '../../../assets/images/Avatar.png';
const ImageCropPicker = props => {
  const createStyles = theme => {
    const themeStyles = StyleSheet.create({
      avatarImage: {
        marginRight: wp(5),
      },

      options: {
        backgroundColor: theme.color.textWhite,
        flexDirection: 'row',
        borderTopRightRadius: 30,
        borderTopLeftRadius: 30,
      },
      option: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      },
      avatar: {
        height: hp(15),
        width: hp(15),
        borderRadius: hp(15),
        // padding: 20,
      },
      editIconContainer: {
        borderWidth: 1,
        borderColor: theme.color.textWhite,
        alignItems: 'center',
        justifyContent: 'center',
        width: wp(8),
        height: hp(4),
        backgroundColor: theme.color.textBlack,
        borderRadius: hp(10),
        flexDirection: 'row',
        position: 'absolute', //Here is the trick
        bottom: 0, //Here is the trick
        right: 1,
      },
      imageStyle: {
        borderRadius: hp(13),
        backgroundColor: theme.color.dividerColor,
        borderColor: '#F2F2F2',
        borderWidth: hp(0.5),
      },
      avatarImageStyle: {
        width: hp(13),
        height: hp(13),
        backgroundColor: '#F2F2F2',
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        borderRadius: hp(10),
        borderColor: '#F2F2F2',
        borderWidth: hp(1),
      },
    });
    return themeStyles;
  };
  const styles = useThemeAwareObject(createStyles);
  const [uri, setUri] = useState(props.uri || undefined);

  const [visible, setVisible] = useState(false);
  const close = () => {
    setVisible(false), props.setMediaOpen(false);
  };
  const open = () => {
    setVisible(true);
  };
  // const dispatch = useDispatch();
  const chooseImage = () => {
    ImagePicker.openPicker({
      width: 300,
      height: 400,
      cropping: true,
      mediaType: props.mediaType ? 'all' : false,
      multiple: props.multipleMedia ? true : false,
    })
      .then(image => {
        props.onChange(image);
        setUri(image.path);
      })
      .finally(close);
  };

  const openCamera = () => {
    ImagePicker.openCamera({
      width: 300,
      height: 400,
      cropping: true,
    })
      .then(image => {
        props.onChange(image);
        setUri(image.path);
      })
      .finally(close);
  };

  return (
    <>
      <View>
        {props?.uri ? (
          <>
            <ImageBackground
              resizeMode="cover"
              style={styles.avatar}
              imageStyle={[styles.imageStyle, props.imgStyles]}
              {...props}
              source={
                props.profile
                  ? {uri}
                  : uri
                  ? props.uri == uri
                    ? {uri: uri.uri}
                    : {uri: uri}
                  : avatarImage
              }>
              <TouchableOpacity onPress={open} style={styles.editIconContainer}>
                <CameraSvg onPressCamera={open} />
              </TouchableOpacity>
            </ImageBackground>
          </>
        ) : (
          <>
            <ImageBackground
              resizeMode="cover"
              style={styles.avatar}
              imageStyle={[styles.imageStyle, props.imgStyles]}
              {...props}
              source={require('../../../assets/images/avatar-placeholder.png')}>
              <TouchableOpacity onPress={open} style={styles.editIconContainer}>
                <CameraSvg onPressCamera={open} />
              </TouchableOpacity>
            </ImageBackground>
          </>
        )}
      </View>
      <Modal
        isVisible={props.mediaOpen == true ? true : visible ? true : false}
        onBackButtonPress={close}
        onBackdropPress={close}
        style={{justifyContent: 'flex-end', margin: 0}}>
        <SafeAreaView style={styles.options}>
          <Pressable style={styles.option} onPress={chooseImage}>
            <ImageIcon />
            <Text>Library </Text>
          </Pressable>
          {props.camera ? (
            <Pressable style={styles.option} onPress={openCamera}>
              <CameraIcon />
              <Text>Camera</Text>
            </Pressable>
          ) : null}
        </SafeAreaView>
      </Modal>
    </>
  );
};

export default ImageCropPicker;
