import React, {useState} from 'react';
import {
  ImageBackground,
  Pressable,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import Modal from 'react-native-modal';
import Svg, {Path} from 'react-native-svg';
import {useThemeAwareObject} from '../../theme';
import {hp, wp} from '../../util';
import Text from '../CustomText';
import {CameraIcon, ImageIcon} from './Icons/Index';
const ImageCropPickerModal = props => {
  const createStyles = theme => {
    const themeStyles = StyleSheet.create({
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

      uploadIdView: {
        height: hp(30),
        width: wp(85),
        borderWidth: 1,
        borderStyle: 'dashed',
        borderRadius: wp(5),
        justifyContent: 'center',
        overflow: 'hidden',
        alignItems: 'center',
        paddingTop: hp(5),
        marginHorizontal: wp(3),
        marginTop: hp(1),
        marginBottom: hp(2),
        backgroundColor: '#F8F8F8',
        // backgroundColor: theme.color.dividerColor,
      },
      imageStyle: {},
      avatar: {
        height: hp(31),
        width: wp(85),
      },
      uplaodIdText: {
        paddingTop: hp(3),
        fontSize: theme.size.medium,
        fontFamily: theme.fontFamily.boldFamily,
        color: theme.color.textGray,
      },
    });
    return themeStyles;
  };
  const styles = useThemeAwareObject(createStyles);
  const [uri, setUri] = useState(props?.uri || undefined);

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
        <TouchableOpacity style={styles.uploadIdView} onPress={open}>
          {uri && (
            <ImageBackground
              resizeMode="cover"
              style={styles.avatar}
              imageStyle={styles.imageStyle}
              {...props}
              source={{uri}}></ImageBackground>
          )}
          {!uri && (
            <Svg
              width={wp(24)}
              height={wp(12)}
              viewBox="0 0 45 36"
              fill="none"
              xmlns="http://www.w3.org/2000/svg">
              <Path
                d="M40.5 0H4.5C2.01825 0 0 2.01825 0 4.5V31.5C0 33.9818 2.01825 36 4.5 36H40.5C42.9818 36 45 33.9818 45 31.5V4.5C45 2.01825 42.9818 0 40.5 0ZM15.1088 9C17.6985 9 19.6087 10.9102 19.6087 13.5C19.6087 16.0898 17.6985 18 15.1088 18C12.519 18 10.6088 16.0898 10.6088 13.5C10.6088 10.9102 12.5168 9 15.1088 9ZM23.4675 25.9538C23.4675 26.5316 22.9991 27 22.4213 27H7.79625C7.21842 27 6.75 26.5316 6.75 25.9538C6.75 22.8645 10.521 19.6875 15.1088 19.6875C19.6965 19.6875 23.4675 22.8645 23.4675 25.9538ZM38.25 22.5C38.25 23.7426 37.2426 24.75 36 24.75H31.5C30.2574 24.75 29.25 23.7426 29.25 22.5C29.25 21.2574 30.2574 20.25 31.5 20.25H36C37.2426 20.25 38.25 21.2574 38.25 22.5ZM38.25 13.5C38.25 14.7426 37.2426 15.75 36 15.75H29.25C28.0074 15.75 27 14.7426 27 13.5C27 12.2574 28.0074 11.25 29.25 11.25H36C37.2426 11.25 38.25 12.2574 38.25 13.5Z"
                fill="black"
              />
            </Svg>
          )}
          <Text style={styles.uplaodIdText}>Upload Valid ID</Text>
        </TouchableOpacity>
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

export default ImageCropPickerModal;
